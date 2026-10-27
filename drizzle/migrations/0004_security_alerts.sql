CREATE TABLE public.alertas_seguridad (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  tipo text NOT NULL CHECK (tipo IN ('login_fallido','cambio_rol')),
  titulo text NOT NULL,
  mensaje text NOT NULL,
  detalle jsonb
);
GRANT SELECT ON public.alertas_seguridad TO authenticated;
GRANT ALL ON public.alertas_seguridad TO service_role;
ALTER TABLE public.alertas_seguridad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Managers read security alerts" ON public.alertas_seguridad FOR SELECT TO authenticated USING (public.school_manager());

CREATE TABLE public.alertas_leidas (
  alerta_id bigint NOT NULL REFERENCES public.alertas_seguridad(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  oculta boolean NOT NULL DEFAULT false,
  PRIMARY KEY (alerta_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.alertas_leidas TO authenticated;
GRANT ALL ON public.alertas_leidas TO service_role;
ALTER TABLE public.alertas_leidas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own alert reads select" ON public.alertas_leidas FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own alert reads insert" ON public.alertas_leidas FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.school_manager());
CREATE POLICY "Own alert reads update" ON public.alertas_leidas FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.intentos_fallidos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL
);
GRANT ALL ON public.intentos_fallidos TO service_role;
ALTER TABLE public.intentos_fallidos ENABLE ROW LEVEL SECURITY;
CREATE INDEX intentos_fallidos_email_idx ON public.intentos_fallidos (email, created_at);

CREATE OR REPLACE FUNCTION public.report_failed_login(p_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE e text := lower(trim(left(coalesce(p_email,''), 255))); n int;
BEGIN
  IF e = '' OR e !~ '^[^@\s]+@[^@\s]+$' THEN RETURN; END IF;
  INSERT INTO public.intentos_fallidos(email) VALUES (e);
  DELETE FROM public.intentos_fallidos WHERE created_at < now() - interval '1 day';
  SELECT count(*) INTO n FROM public.intentos_fallidos WHERE email = e AND created_at > now() - interval '15 minutes';
  IF n >= 3 AND NOT EXISTS (
    SELECT 1 FROM public.alertas_seguridad WHERE tipo='login_fallido' AND detalle->>'email' = e AND created_at > now() - interval '15 minutes'
  ) THEN
    INSERT INTO public.alertas_seguridad(tipo,titulo,mensaje,detalle)
    VALUES ('login_fallido','Inicios de sesión fallidos',
      format('%s intentos fallidos para %s en los últimos 15 minutos', n, e),
      jsonb_build_object('email', e, 'intentos', n));
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.report_failed_login(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.report_failed_login(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.alert_role_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor text; who text; msg text;
BEGIN
  SELECT coalesce(nullif(trim(a.nombre),''), a.email, 'Sistema') INTO actor FROM public.actor_info(auth.uid()) a;
  actor := coalesce(actor, 'Sistema');
  IF TG_TABLE_NAME = 'account_assignments' THEN
    who := coalesce(NEW.email, OLD.email);
    IF TG_OP = 'INSERT' THEN msg := format('%s asignó el rol %s a %s', actor, NEW.role, who);
    ELSIF TG_OP = 'DELETE' THEN msg := format('%s quitó el acceso (%s) de %s', actor, OLD.role, who);
    ELSIF OLD.role IS DISTINCT FROM NEW.role THEN msg := format('%s cambió el rol de %s: %s → %s', actor, who, OLD.role, NEW.role);
    ELSIF OLD.active IS DISTINCT FROM NEW.active THEN msg := format('%s %s el acceso de %s', actor, CASE WHEN NEW.active THEN 'activó' ELSE 'desactivó' END, who);
    ELSE RETURN NULL; END IF;
  ELSE
    SELECT email INTO who FROM auth.users WHERE id = coalesce(NEW.user_id, OLD.user_id);
    who := coalesce(who, 'una cuenta');
    IF TG_OP = 'INSERT' THEN msg := format('La cuenta %s recibió permisos de %s', who, NEW.role);
    ELSIF TG_OP = 'DELETE' THEN msg := format('La cuenta %s perdió sus permisos (%s)', who, OLD.role);
    ELSIF OLD.role IS DISTINCT FROM NEW.role THEN msg := format('Los permisos de %s cambiaron: %s → %s', who, OLD.role, NEW.role);
    ELSE RETURN NULL; END IF;
  END IF;
  INSERT INTO public.alertas_seguridad(tipo,titulo,mensaje,detalle)
  VALUES ('cambio_rol','Cambio de roles y permisos', msg, jsonb_build_object('tabla', TG_TABLE_NAME, 'operacion', TG_OP, 'actor', actor, 'cuenta', who));
  RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION public.alert_role_change() FROM PUBLIC;

CREATE TRIGGER alert_role_change AFTER INSERT OR UPDATE OR DELETE ON public.account_assignments FOR EACH ROW EXECUTE FUNCTION public.alert_role_change();
CREATE TRIGGER alert_role_change AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.alert_role_change();

ALTER PUBLICATION supabase_realtime ADD TABLE public.alertas_seguridad;