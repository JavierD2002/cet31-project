
CREATE TABLE public.configuracion_escuela (
  id integer PRIMARY KEY DEFAULT 1,
  nombre_escuela varchar NOT NULL DEFAULT 'Escuela Técnica de Villa Manzano - Río Negro - Argentina',
  email_contacto varchar NOT NULL DEFAULT 'cet31vmanzano23@gmail.com',
  texto_copyright varchar NOT NULL DEFAULT '© 2025 Sistema de Gestión Escolar',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT solo_un_registro CHECK (id = 1)
);

ALTER TABLE public.configuracion_escuela ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to configuracion_escuela" ON public.configuracion_escuela
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow update access to configuracion_escuela" ON public.configuracion_escuela
  FOR UPDATE TO public USING (true) WITH CHECK (true);

INSERT INTO public.configuracion_escuela (id, nombre_escuela, email_contacto, texto_copyright)
VALUES (1, 'Escuela Técnica de Villa Manzano - Río Negro - Argentina', 'cet31vmanzano23@gmail.com', '© 2025 Sistema de Gestión Escolar');
