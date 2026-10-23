CREATE TYPE public.school_role AS ENUM ('administrador','directivo','docente','estudiante','panolero');
ALTER TABLE public.usuarios ADD COLUMN especialidad text NOT NULL DEFAULT '';
COMMENT ON COLUMN public.usuarios.rol IS 'DEPRECATED for authorization: display only; privileges live in user_roles.';
CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, usuario_id integer UNIQUE REFERENCES public.usuarios(id) ON DELETE SET NULL, nombre text NOT NULL DEFAULT '', apellido text NOT NULL DEFAULT '', preferencias jsonb NOT NULL DEFAULT '{}');
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (nombre,apellido,preferencias) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, role public.school_role NOT NULL);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.account_assignments (usuario_id integer PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE, email text NOT NULL UNIQUE, role public.school_role NOT NULL, active boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.account_assignments TO authenticated;
GRANT ALL ON public.account_assignments TO service_role;
ALTER TABLE public.account_assignments ENABLE ROW LEVEL SECURITY;
INSERT INTO public.account_assignments(usuario_id,email,role) SELECT id,lower(trim(email)),rol::public.school_role FROM public.usuarios WHERE rol IN ('administrador','directivo','docente','estudiante','panolero');
CREATE FUNCTION public.has_school_role(wanted public.school_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles r JOIN public.profiles p ON p.id=r.user_id JOIN public.account_assignments a ON a.usuario_id=p.usuario_id AND a.role=r.role AND a.active WHERE r.user_id=auth.uid() AND r.role=wanted) $$;
CREATE FUNCTION public.school_manager() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_school_role('administrador') OR public.has_school_role('directivo') $$;
CREATE FUNCTION public.school_user_id() RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT p.usuario_id FROM public.profiles p JOIN public.user_roles r ON r.user_id=p.id JOIN public.account_assignments a ON a.usuario_id=p.usuario_id AND a.active AND a.role=r.role WHERE p.id=auth.uid() $$;
CREATE FUNCTION public.teaches_course(wanted text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_school_role('docente') AND EXISTS(SELECT 1 FROM public.asignaturas a JOIN public.docentes d ON d.id=a.docente_id WHERE d.usuario_id=public.school_user_id() AND a.curso=wanted) $$;
CREATE FUNCTION public.teaches_subject(subject_id integer, course_name text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_school_role('docente') AND EXISTS(SELECT 1 FROM public.asignaturas a JOIN public.docentes d ON d.id=a.docente_id WHERE a.id=subject_id AND a.curso=course_name AND d.usuario_id=public.school_user_id()) $$;
CREATE FUNCTION public.own_student(student_id integer) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_school_role('estudiante') AND EXISTS(SELECT 1 FROM public.estudiantes e WHERE e.id=student_id AND e.usuario_id=public.school_user_id()) $$;
CREATE FUNCTION public.grade_responsibility(student_id integer, subject_id integer) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.estudiantes e WHERE e.id=student_id AND public.teaches_subject(subject_id,e.curso)) $$;
CREATE FUNCTION public.attendance_responsibility(attendance_id integer, student_user_id integer) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.asistencias a JOIN public.estudiantes e ON e.curso=a.curso WHERE a.id=attendance_id AND e.usuario_id=student_user_id AND a.profesor_id=public.school_user_id() AND public.teaches_subject(a.asignatura_id,a.curso)) $$;
CREATE FUNCTION public.student_attendance(attendance_id integer) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.has_school_role('estudiante') AND EXISTS(SELECT 1 FROM public.asistencias_detalle d WHERE d.asistencia_id=attendance_id AND d.estudiante_id=public.school_user_id()) $$;
CREATE FUNCTION public.visible_school_user(wanted integer) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT public.school_manager() OR wanted=public.school_user_id() OR EXISTS(SELECT 1 FROM public.estudiantes e WHERE e.usuario_id=wanted AND public.teaches_course(e.curso)) OR (public.has_school_role('estudiante') AND EXISTS(SELECT 1 FROM public.estudiantes e JOIN public.asignaturas a ON a.curso=e.curso JOIN public.docentes d ON d.id=a.docente_id WHERE e.usuario_id=public.school_user_id() AND d.usuario_id=wanted)) $$;
CREATE FUNCTION public.sync_school_account(account_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE u record; assignment record; BEGIN
SELECT id,email,email_confirmed_at,raw_user_meta_data INTO u FROM auth.users WHERE id=account_id;
IF NOT FOUND THEN RETURN; END IF;
INSERT INTO public.profiles(id,nombre,apellido) VALUES(u.id,coalesce(u.raw_user_meta_data->>'nombre',''),coalesce(u.raw_user_meta_data->>'apellido','')) ON CONFLICT(id) DO NOTHING;
IF u.email_confirmed_at IS NULL THEN RETURN; END IF;
SELECT a.* INTO assignment FROM public.account_assignments a WHERE a.email=lower(trim(u.email)) AND a.active;
IF FOUND THEN
UPDATE public.profiles p SET usuario_id=assignment.usuario_id,nombre=s.nombre,apellido=s.apellido FROM public.usuarios s WHERE p.id=u.id AND s.id=assignment.usuario_id;
INSERT INTO public.user_roles(user_id,role) VALUES(u.id,assignment.role) ON CONFLICT(user_id) DO UPDATE SET role=excluded.role;
ELSE
DELETE FROM public.user_roles WHERE user_id=u.id;
UPDATE public.profiles SET usuario_id=NULL WHERE id=u.id;
END IF; END $$;
CREATE FUNCTION public.on_school_auth_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN PERFORM public.sync_school_account(NEW.id); RETURN NEW; END $$;
CREATE TRIGGER school_auth_profile AFTER INSERT OR UPDATE OF email_confirmed_at,email ON auth.users FOR EACH ROW EXECUTE FUNCTION public.on_school_auth_user();
CREATE FUNCTION public.on_school_assignment() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE account_id uuid; BEGIN
IF TG_OP <> 'INSERT' THEN
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM public.profiles WHERE usuario_id=OLD.usuario_id);
UPDATE public.profiles SET usuario_id=NULL WHERE usuario_id=OLD.usuario_id;
END IF;
IF TG_OP <> 'DELETE' THEN
FOR account_id IN SELECT id FROM auth.users WHERE lower(trim(email))=NEW.email AND email_confirmed_at IS NOT NULL LOOP PERFORM public.sync_school_account(account_id); END LOOP;
RETURN NEW; END IF; RETURN OLD; END $$;
CREATE TRIGGER school_assignment_sync AFTER INSERT OR UPDATE OR DELETE ON public.account_assignments FOR EACH ROW EXECUTE FUNCTION public.on_school_assignment();
CREATE POLICY profiles_read ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid() OR public.has_school_role('administrador'));
CREATE POLICY profiles_edit ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE POLICY roles_read ON public.user_roles FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.has_school_role('administrador'));
CREATE POLICY assignments_read ON public.account_assignments FOR SELECT TO authenticated USING(public.has_school_role('administrador'));
ALTER TABLE public.informes_pedagogicos ADD COLUMN asignatura_id integer REFERENCES public.asignaturas(id);
UPDATE public.informes_pedagogicos i SET asignatura_id=a.id FROM public.asignaturas a JOIN public.docentes d ON d.id=a.docente_id, public.estudiantes e WHERE i.estudiante_id=e.id AND i.autor_id=d.usuario_id AND i.tipo_informe=a.nombre AND e.curso=a.curso;
DO $$ DECLARE t text; p record; BEGIN
FOREACH t IN ARRAY ARRAY['usuarios','docentes','estudiantes','aulas','asignaturas','asistencias','asistencias_detalle','calificaciones','libro_temas','informes_pedagogicos','plantillas_informes','panol_items','configuracion_escuela'] LOOP
FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP EXECUTE format('DROP POLICY %I ON public.%I',p.policyname,t); END LOOP;
EXECUTE format('REVOKE ALL ON public.%I FROM anon',t);
EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON public.%I TO authenticated',t);
EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
END LOOP; END $$;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
CREATE POLICY users_read ON public.usuarios FOR SELECT TO authenticated USING(public.visible_school_user(id));
CREATE POLICY users_insert ON public.usuarios FOR INSERT TO authenticated WITH CHECK(public.has_school_role('administrador') OR (public.has_school_role('directivo') AND rol IN ('estudiante','docente')));
CREATE POLICY users_update ON public.usuarios FOR UPDATE TO authenticated USING(public.has_school_role('administrador') OR (public.has_school_role('directivo') AND rol IN ('estudiante','docente'))) WITH CHECK(public.has_school_role('administrador') OR (public.has_school_role('directivo') AND rol IN ('estudiante','docente')));
CREATE POLICY users_delete ON public.usuarios FOR DELETE TO authenticated USING(public.has_school_role('administrador') OR (public.has_school_role('directivo') AND rol IN ('estudiante','docente')));
CREATE FUNCTION public.guard_legacy_role() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN IF NEW.rol IS DISTINCT FROM OLD.rol AND NOT public.has_school_role('administrador') AND current_user IN ('authenticated','anon') THEN RAISE EXCEPTION 'Solo el administrador puede cambiar el rol'; END IF; RETURN NEW; END $$;
CREATE TRIGGER guard_school_role BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.guard_legacy_role();
CREATE POLICY teachers_read ON public.docentes FOR SELECT TO authenticated USING(public.visible_school_user(usuario_id));
CREATE POLICY teachers_manage ON public.docentes FOR ALL TO authenticated USING(public.school_manager()) WITH CHECK(public.school_manager());
CREATE POLICY students_read ON public.estudiantes FOR SELECT TO authenticated USING(public.school_manager() OR public.own_student(id) OR public.teaches_course(curso));
CREATE POLICY students_manage ON public.estudiantes FOR ALL TO authenticated USING(public.school_manager()) WITH CHECK(public.school_manager());
CREATE POLICY rooms_manage ON public.aulas FOR ALL TO authenticated USING(public.school_manager()) WITH CHECK(public.school_manager());
CREATE POLICY subjects_read ON public.asignaturas FOR SELECT TO authenticated USING(public.school_manager() OR public.teaches_subject(id,curso) OR (public.has_school_role('estudiante') AND EXISTS(SELECT 1 FROM public.estudiantes e WHERE e.usuario_id=public.school_user_id() AND e.curso=asignaturas.curso)));
CREATE POLICY subjects_manage ON public.asignaturas FOR ALL TO authenticated USING(public.school_manager()) WITH CHECK(public.school_manager());
CREATE POLICY attendance_read ON public.asistencias FOR SELECT TO authenticated USING(public.school_manager() OR (profesor_id=public.school_user_id() AND public.teaches_subject(asignatura_id,curso)) OR public.student_attendance(id));
CREATE POLICY attendance_manage ON public.asistencias FOR ALL TO authenticated USING(public.school_manager() OR (profesor_id=public.school_user_id() AND public.teaches_subject(asignatura_id,curso))) WITH CHECK(public.school_manager() OR (profesor_id=public.school_user_id() AND public.teaches_subject(asignatura_id,curso)));
CREATE POLICY attendance_detail_read ON public.asistencias_detalle FOR SELECT TO authenticated USING(public.school_manager() OR public.attendance_responsibility(asistencia_id,estudiante_id) OR (public.has_school_role('estudiante') AND estudiante_id=public.school_user_id()));
CREATE POLICY attendance_detail_manage ON public.asistencias_detalle FOR ALL TO authenticated USING(public.school_manager() OR public.attendance_responsibility(asistencia_id,estudiante_id)) WITH CHECK(public.school_manager() OR public.attendance_responsibility(asistencia_id,estudiante_id));
CREATE POLICY grades_read ON public.calificaciones FOR SELECT TO authenticated USING(public.school_manager() OR public.grade_responsibility(estudiante_id,asignatura_id) OR public.own_student(estudiante_id));
CREATE POLICY grades_manage ON public.calificaciones FOR ALL TO authenticated USING(public.school_manager() OR public.grade_responsibility(estudiante_id,asignatura_id)) WITH CHECK(public.school_manager() OR public.grade_responsibility(estudiante_id,asignatura_id));
CREATE POLICY topics_manage ON public.libro_temas FOR ALL TO authenticated USING(public.school_manager() OR (public.teaches_subject(asignatura_id,curso) AND EXISTS(SELECT 1 FROM public.docentes d WHERE d.id=libro_temas.docente_id AND d.usuario_id=public.school_user_id()))) WITH CHECK(public.school_manager() OR (public.teaches_subject(asignatura_id,curso) AND EXISTS(SELECT 1 FROM public.docentes d WHERE d.id=libro_temas.docente_id AND d.usuario_id=public.school_user_id())));
CREATE POLICY reports_read ON public.informes_pedagogicos FOR SELECT TO authenticated USING(public.school_manager() OR (autor_id=public.school_user_id() AND public.has_school_role('docente') AND EXISTS(SELECT 1 FROM public.estudiantes e WHERE e.id=informes_pedagogicos.estudiante_id AND public.teaches_course(e.curso))) OR (public.own_student(estudiante_id) AND estado='finalizado'));
CREATE POLICY reports_manage ON public.informes_pedagogicos FOR ALL TO authenticated USING(public.school_manager() OR (autor_id=public.school_user_id() AND public.grade_responsibility(estudiante_id,asignatura_id))) WITH CHECK(public.school_manager() OR (autor_id=public.school_user_id() AND public.grade_responsibility(estudiante_id,asignatura_id)));
CREATE POLICY templates_read ON public.plantillas_informes FOR SELECT TO authenticated USING(public.school_manager() OR public.has_school_role('docente'));
CREATE POLICY templates_manage ON public.plantillas_informes FOR ALL TO authenticated USING(public.school_manager()) WITH CHECK(public.school_manager());
CREATE POLICY inventory_manage ON public.panol_items FOR ALL TO authenticated USING(public.school_manager() OR public.has_school_role('panolero')) WITH CHECK(public.school_manager() OR public.has_school_role('panolero'));
CREATE POLICY config_read ON public.configuracion_escuela FOR SELECT TO authenticated USING(true);
CREATE POLICY config_manage ON public.configuracion_escuela FOR ALL TO authenticated USING(public.has_school_role('administrador')) WITH CHECK(public.has_school_role('administrador'));
CREATE FUNCTION public.admin_save_school_user(p_id integer,p_dni text,p_nombre text,p_apellido text,p_email text,p_role public.school_role,p_especialidad text,p_curso text,p_active boolean DEFAULT true) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE target integer; BEGIN
IF NOT public.has_school_role('administrador') THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
IF p_id=public.school_user_id() AND (p_role <> 'administrador' OR NOT p_active) THEN RAISE EXCEPTION 'No puede quitar su propio acceso de administrador'; END IF;
IF p_id IS NULL THEN INSERT INTO public.usuarios(dni,nombre,apellido,email,rol,especialidad) VALUES(p_dni,p_nombre,p_apellido,lower(trim(p_email)),p_role::text,p_especialidad) RETURNING id INTO target;
ELSE UPDATE public.usuarios SET dni=p_dni,nombre=p_nombre,apellido=p_apellido,email=lower(trim(p_email)),rol=p_role::text,especialidad=p_especialidad WHERE id=p_id RETURNING id INTO target; END IF;
IF target IS NULL THEN RAISE EXCEPTION 'Usuario inexistente'; END IF;
IF p_role='docente' THEN
UPDATE public.docentes SET especialidad=p_especialidad WHERE usuario_id=target;
IF NOT FOUND THEN INSERT INTO public.docentes(usuario_id,especialidad) VALUES(target,p_especialidad); END IF;
ELSIF p_role='estudiante' THEN
UPDATE public.estudiantes SET curso=p_curso WHERE usuario_id=target;
IF NOT FOUND THEN INSERT INTO public.estudiantes(usuario_id,curso) VALUES(target,p_curso); END IF;
END IF;
INSERT INTO public.account_assignments(usuario_id,email,role,active) VALUES(target,lower(trim(p_email)),p_role,p_active) ON CONFLICT(usuario_id) DO UPDATE SET email=excluded.email,role=excluded.role,active=excluded.active;
RETURN target; END $$;
CREATE FUNCTION public.admin_delete_school_user(p_id integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
IF NOT public.has_school_role('administrador') OR p_id=public.school_user_id() THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
DELETE FROM public.estudiantes WHERE usuario_id=p_id;
DELETE FROM public.docentes WHERE usuario_id=p_id;
DELETE FROM public.usuarios WHERE id=p_id; END $$;
CREATE FUNCTION public.save_school_attendance(p_fecha date,p_profesor integer,p_asignatura integer,p_curso text,p_detalles jsonb) RETURNS integer LANGUAGE plpgsql SET search_path=public AS $$ DECLARE target integer; BEGIN
IF jsonb_array_length(p_detalles)=0 THEN RAISE EXCEPTION 'Debe registrar estudiantes'; END IF;
INSERT INTO public.asistencias(fecha,profesor_id,asignatura_id,curso) VALUES(p_fecha,p_profesor,p_asignatura,p_curso) RETURNING id INTO target;
INSERT INTO public.asistencias_detalle(asistencia_id,estudiante_id,estado,observacion) SELECT target,estudiante_id,estado,observacion FROM jsonb_to_recordset(p_detalles) AS x(estudiante_id integer,estado text,observacion text);
RETURN target; END $$;
DO $$ DECLARE f record; BEGIN FOR f IN SELECT p.oid::regprocedure AS signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname IN ('has_school_role','school_manager','school_user_id','teaches_course','teaches_subject','own_student','grade_responsibility','attendance_responsibility','student_attendance','visible_school_user','sync_school_account','on_school_auth_user','on_school_assignment','guard_legacy_role','admin_save_school_user','admin_delete_school_user','save_school_attendance') LOOP
EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',f.signature);
IF f.signature::text NOT LIKE '%sync_school_account%' AND f.signature::text NOT LIKE '%on_school_%' AND f.signature::text NOT LIKE '%guard_legacy_role%' THEN EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.signature); END IF;
END LOOP; END $$;