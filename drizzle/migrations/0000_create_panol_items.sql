CREATE TABLE public.panol_items (
  id serial PRIMARY KEY,
  item varchar NOT NULL,
  nombre varchar NOT NULL,
  detalle text,
  espacio_taller varchar NOT NULL DEFAULT '',
  unidad_medida varchar NOT NULL DEFAULT 'unidad',
  cantidad numeric NOT NULL DEFAULT 0,
  estado varchar NOT NULL DEFAULT 'bueno',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panol_items TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.panol_items_id_seq TO anon, authenticated;
GRANT ALL ON public.panol_items TO service_role;
ALTER TABLE public.panol_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to panol_items" ON public.panol_items FOR ALL USING (true) WITH CHECK (true);