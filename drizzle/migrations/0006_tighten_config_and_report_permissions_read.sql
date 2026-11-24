DROP POLICY IF EXISTS config_read ON public.configuracion_escuela;
CREATE POLICY config_read ON public.configuracion_escuela FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));
DROP POLICY IF EXISTS report_permissions_read ON public.report_permissions;
CREATE POLICY report_permissions_read ON public.report_permissions FOR SELECT TO authenticated
USING (public.has_school_role(role) OR public.has_school_role('administrador'::public.school_role));