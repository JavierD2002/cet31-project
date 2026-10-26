CREATE TABLE public.registro_actividad (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  auth_user_id uuid,
  email text,
  usuario_nombre text,
  rol text,
  accion text NOT NULL,
  modulo text NOT NULL,
  registro_id text,
  detalle jsonb
);
CREATE INDEX registro_actividad_created_idx ON public.registro_actividad (created_at DESC);
GRANT SELECT ON public.registro_actividad TO authenticated;
GRANT ALL ON public.registro_actividad TO service_role;
ALTER TABLE public.registro_actividad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins y directivos ven actividad" ON public.registro_actividad FOR SELECT TO authenticated
USING (public.has_school_role('administrador') OR public.has_school_role('directivo'));

CREATE OR REPLACE FUNCTION public.actor_info(p_uid uuid, OUT email text, OUT nombre text, OUT rol text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (SELECT u.email::text FROM auth.users u WHERE u.id = p_uid),
         (SELECT p.nombre || ' ' || p.apellido FROM public.profiles p WHERE p.id = p_uid),
         (SELECT r.role::text FROM public.user_roles r WHERE r.user_id = p_uid LIMIT 1)
$$;
REVOKE EXECUTE ON FUNCTION public.actor_info(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.audit_school_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  a record;
  o jsonb := CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END;
  n jsonb := CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END;
  d jsonb;
BEGIN
  SELECT * INTO a FROM public.actor_info(v_uid);
  IF TG_OP = 'UPDATE' THEN
    SELECT jsonb_object_agg(k, jsonb_build_object('antes', o->k, 'despues', n->k)) INTO d
    FROM jsonb_object_keys(n) k
    WHERE k NOT IN ('updated_at') AND (o->k) IS DISTINCT FROM (n->k);
    IF d IS NULL THEN RETURN NEW; END IF;
  ELSIF TG_OP = 'INSERT' THEN d := n;
  ELSE d := o;
  END IF;
  INSERT INTO public.registro_actividad (auth_user_id, email, usuario_nombre, rol, accion, modulo, registro_id, detalle)
  VALUES (v_uid, a.email, a.nombre, a.rol,
    CASE TG_OP WHEN 'INSERT' THEN 'alta' WHEN 'UPDATE' THEN 'modificacion' ELSE 'baja' END,
    TG_ARGV[0], COALESCE(n->>'id', o->>'id', n->>'usuario_id', o->>'usuario_id'), d);
  RETURN COALESCE(NEW, OLD);
END $$;

DO $$
DECLARE t text[];
BEGIN
  FOREACH t SLICE 1 IN ARRAY ARRAY[
    ['usuarios','Gestión de Usuarios'],['account_assignments','Gestión de Usuarios'],
    ['docentes','Docentes'],['estudiantes','Estudiantes'],['aulas','Aulas'],
    ['asignaturas','Asignaturas'],['asistencias','Asistencia'],['asistencias_detalle','Asistencia'],
    ['calificaciones','Calificaciones'],['libro_temas','Libro de Temas'],
    ['informes_pedagogicos','Informes'],['plantillas_informes','Informes'],
    ['panol_items','Pañol'],['configuracion_escuela','Configuración']]
  LOOP
    EXECUTE format('CREATE TRIGGER audit_%1$s AFTER INSERT OR UPDATE OR DELETE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.audit_school_change(%2$L)', t[1], t[2]);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.audit_school_login()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a record;
BEGIN
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at AND NEW.last_sign_in_at IS NOT NULL THEN
    BEGIN
      SELECT * INTO a FROM public.actor_info(NEW.id);
      INSERT INTO public.registro_actividad (created_at, auth_user_id, email, usuario_nombre, rol, accion, modulo)
      VALUES (NEW.last_sign_in_at, NEW.id, NEW.email, a.nombre, a.rol, 'inicio_sesion', 'Inicio de sesión');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER audit_school_login AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.audit_school_login();