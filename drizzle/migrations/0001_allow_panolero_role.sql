ALTER TABLE public.usuarios DROP CONSTRAINT usuarios_rol_check;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_rol_check CHECK (rol IN ('estudiante','docente','directivo','administrador','panolero'));
ALTER TABLE public.panol_items ADD CONSTRAINT panol_items_estado_check CHECK (estado IN ('bueno','regular','dar_baja'));
ALTER TABLE public.panol_items ADD CONSTRAINT panol_items_unidad_check CHECK (unidad_medida IN ('metro','litro','kilogramo','unidad'));