CREATE TABLE public.report_permissions (
 report_type text NOT NULL,
 role public.school_role NOT NULL,
 allowed boolean NOT NULL DEFAULT true,
 PRIMARY KEY (report_type, role),
 CONSTRAINT report_permissions_type CHECK (report_type IN ('estudiantes','docentes','aulas','asignaturas','asistencia','reporte_asistencia','calificaciones','boletines','informes','libro_temas','usuarios','panol','auditoria')),
 CONSTRAINT administrator_report_access CHECK (role <> 'administrador' OR allowed)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_permissions TO authenticated;
GRANT ALL ON public.report_permissions TO service_role;
ALTER TABLE public.report_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY report_permissions_read ON public.report_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY report_permissions_admin ON public.report_permissions FOR ALL TO authenticated USING (public.has_school_role('administrador')) WITH CHECK (public.has_school_role('administrador'));

CREATE FUNCTION public.can_consult_report(p_report_type text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT EXISTS (
  SELECT 1 FROM public.user_roles r
  WHERE r.user_id = auth.uid() AND public.has_school_role(r.role)
  AND CASE p_report_type
   WHEN 'usuarios' THEN r.role = 'administrador'
   WHEN 'auditoria' THEN r.role IN ('administrador','directivo')
   WHEN 'panol' THEN r.role IN ('administrador','directivo','panolero')
   WHEN 'aulas' THEN r.role IN ('administrador','directivo')
   WHEN 'estudiantes' THEN r.role IN ('administrador','directivo','docente')
   WHEN 'docentes' THEN r.role IN ('administrador','directivo','docente')
   WHEN 'asignaturas' THEN r.role IN ('administrador','directivo','docente')
   WHEN 'libro_temas' THEN r.role IN ('administrador','directivo','docente')
   WHEN 'reporte_asistencia' THEN r.role IN ('administrador','directivo','docente')
   WHEN 'asistencia' THEN r.role IN ('administrador','directivo','docente','estudiante')
   WHEN 'calificaciones' THEN r.role IN ('administrador','directivo','docente','estudiante')
   WHEN 'boletines' THEN r.role IN ('administrador','directivo','docente','estudiante')
   WHEN 'informes' THEN r.role IN ('administrador','directivo','docente','estudiante')
   ELSE false END
  AND (r.role = 'administrador' OR COALESCE((SELECT p.allowed FROM public.report_permissions p WHERE p.report_type=p_report_type AND p.role=r.role),true))
 );
$$;
REVOKE ALL ON FUNCTION public.can_consult_report(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_consult_report(text) TO authenticated;

CREATE POLICY report_gate_students ON public.estudiantes AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('estudiantes') OR usuario_id=public.school_user_id());
CREATE POLICY report_gate_teachers ON public.docentes AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('docentes') OR usuario_id=public.school_user_id());
CREATE POLICY report_gate_rooms ON public.aulas AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('aulas'));
CREATE POLICY report_gate_subjects ON public.asignaturas AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('asignaturas') OR public.has_school_role('estudiante'));
CREATE POLICY report_gate_attendance ON public.asistencias AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('asistencia'));
CREATE POLICY report_gate_attendance_details ON public.asistencias_detalle AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('asistencia'));
CREATE POLICY report_gate_grades ON public.calificaciones AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('calificaciones'));
CREATE POLICY report_gate_reports ON public.informes_pedagogicos AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('informes'));
CREATE POLICY report_gate_topics ON public.libro_temas AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('libro_temas'));
CREATE POLICY report_gate_inventory ON public.panol_items AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('panol'));
CREATE POLICY report_gate_audit ON public.registro_actividad AS RESTRICTIVE FOR SELECT TO authenticated USING (public.can_consult_report('auditoria'));

CREATE FUNCTION public.assert_report_access(p_report_type text) RETURNS void LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT public.can_consult_report(p_report_type) THEN RAISE EXCEPTION 'No tienes permiso para consultar este reporte.' USING ERRCODE='42501'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.assert_report_access(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assert_report_access(text) TO authenticated;

CREATE FUNCTION public.alert_report_permission_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE n jsonb := CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END; o jsonb := CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END;
BEGIN
 IF TG_OP='UPDATE' AND OLD.allowed IS NOT DISTINCT FROM NEW.allowed THEN RETURN NEW; END IF;
 INSERT INTO public.alertas_seguridad(tipo,titulo,mensaje,detalle) VALUES ('cambio_rol','Cambio de permisos de reportes',format('Se modificó el acceso al reporte %s para el rol %s.',coalesce(n->>'report_type',o->>'report_type'),coalesce(n->>'role',o->>'role')),jsonb_build_object('antes',o,'despues',n,'actor',auth.uid()));
 RETURN COALESCE(NEW,OLD);
END $$;
REVOKE ALL ON FUNCTION public.alert_report_permission_change() FROM PUBLIC;
CREATE TRIGGER alert_report_permissions AFTER INSERT OR UPDATE OR DELETE ON public.report_permissions FOR EACH ROW EXECUTE FUNCTION public.alert_report_permission_change();
CREATE TRIGGER audit_report_permissions AFTER INSERT OR UPDATE OR DELETE ON public.report_permissions FOR EACH ROW EXECUTE FUNCTION public.audit_school_change('Permisos de Reportes');