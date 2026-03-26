
-- 1. Tabla de usuarios (base del sistema)
CREATE TABLE public.usuarios (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  rol VARCHAR(20) NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('administrador', 'directivo', 'docente', 'estudiante')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabla de docentes
CREATE TABLE public.docentes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  especialidad VARCHAR(200) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabla de estudiantes
CREATE TABLE public.estudiantes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  curso VARCHAR(50) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabla de aulas
CREATE TABLE public.aulas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  capacidad INTEGER NOT NULL DEFAULT 30,
  ubicacion VARCHAR(200) NOT NULL DEFAULT '',
  recursos TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabla de asignaturas
CREATE TABLE public.asignaturas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  curso VARCHAR(50) NOT NULL,
  docente_id INTEGER REFERENCES public.docentes(id) ON DELETE SET NULL,
  descripcion TEXT,
  carga_horaria INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tabla de asistencias
CREATE TABLE public.asistencias (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  profesor_id INTEGER NOT NULL REFERENCES public.usuarios(id),
  asignatura_id INTEGER NOT NULL REFERENCES public.asignaturas(id),
  curso VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tabla de detalle de asistencias
CREATE TABLE public.asistencias_detalle (
  id SERIAL PRIMARY KEY,
  asistencia_id INTEGER NOT NULL REFERENCES public.asistencias(id) ON DELETE CASCADE,
  estudiante_id INTEGER NOT NULL REFERENCES public.usuarios(id),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('presente', 'ausente', 'tardanza', 'retirado')),
  observacion TEXT,
  hora_registro TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tabla de calificaciones
CREATE TABLE public.calificaciones (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER NOT NULL REFERENCES public.estudiantes(id) ON DELETE CASCADE,
  asignatura_id INTEGER NOT NULL REFERENCES public.asignaturas(id) ON DELETE CASCADE,
  periodo VARCHAR(30) NOT NULL CHECK (periodo IN ('primer_trimestre', 'segundo_trimestre', 'tercer_trimestre')),
  nota NUMERIC(4,2) NOT NULL,
  fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(estudiante_id, asignatura_id, periodo)
);

-- 9. Tabla de plantillas de informes
CREATE TABLE public.plantillas_informes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL,
  contenido TEXT NOT NULL DEFAULT '',
  campos_requeridos JSONB DEFAULT '[]',
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Tabla de informes pedagógicos
CREATE TABLE public.informes_pedagogicos (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER NOT NULL REFERENCES public.estudiantes(id) ON DELETE CASCADE,
  tipo_informe VARCHAR(50) NOT NULL,
  periodo VARCHAR(100) NOT NULL,
  autor_id INTEGER NOT NULL REFERENCES public.usuarios(id),
  titulo VARCHAR(300) NOT NULL,
  contenido TEXT NOT NULL DEFAULT '',
  observaciones TEXT,
  plantilla_id INTEGER REFERENCES public.plantillas_informes(id),
  fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
  estado VARCHAR(30) NOT NULL DEFAULT 'borrador',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Tabla de libro de temas
CREATE TABLE public.libro_temas (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  curso VARCHAR(50) NOT NULL,
  asignatura_id INTEGER NOT NULL REFERENCES public.asignaturas(id),
  docente_id INTEGER NOT NULL REFERENCES public.docentes(id),
  tema VARCHAR(500) NOT NULL,
  contenido TEXT NOT NULL DEFAULT '',
  actividad TEXT NOT NULL DEFAULT '',
  recursos TEXT,
  tarea TEXT,
  evaluacion TEXT,
  observaciones TEXT,
  planificado BOOLEAN DEFAULT true,
  estado VARCHAR(30) NOT NULL DEFAULT 'planificado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en todas las tablas (pero permitir acceso público por ahora para desarrollo)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantillas_informes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.informes_pedagogicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.libro_temas ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (lectura y escritura para anon, desarrollo)
CREATE POLICY "Allow all access to usuarios" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to docentes" ON public.docentes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to estudiantes" ON public.estudiantes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to aulas" ON public.aulas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to asignaturas" ON public.asignaturas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to asistencias" ON public.asistencias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to asistencias_detalle" ON public.asistencias_detalle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to calificaciones" ON public.calificaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to plantillas_informes" ON public.plantillas_informes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to informes_pedagogicos" ON public.informes_pedagogicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to libro_temas" ON public.libro_temas FOR ALL USING (true) WITH CHECK (true);
