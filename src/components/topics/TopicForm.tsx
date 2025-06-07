
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface TopicFormData {
  fecha: string;
  curso: string;
  asignatura_id: number;
  docente_id: number;
  tema: string;
  contenido: string;
  actividad: string;
  recursos?: string;
  tarea?: string;
  evaluacion?: string;
  observaciones?: string;
  planificado?: boolean;
  estado?: string;
}

interface TopicFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TopicFormData) => void;
  subjects: Array<{ id: number; nombre: string; curso: string; docente_id: number; docente_nombre: string }>;
  teachers: Array<{ id: number; nombre: string }>;
  initialData?: TopicFormData & { id?: number };
  title: string;
}

const cursos = [
  "1° Año A", "1° Año B", "1° Año C",
  "2° Año A", "2° Año B", "2° Año C",
  "3° Año A", "3° Año B", "3° Año C",
  "4° Año A", "4° Año B",
  "5° Año A", "5° Año B"
];

const TopicForm: React.FC<TopicFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  subjects,
  teachers,
  initialData,
  title
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TopicFormData>({
    defaultValues: initialData || {
      fecha: new Date().toISOString().split('T')[0],
      curso: '',
      asignatura_id: 0,
      docente_id: 0,
      tema: '',
      contenido: '',
      actividad: '',
      recursos: '',
      tarea: '',
      evaluacion: '',
      observaciones: '',
      planificado: true,
      estado: 'planificado'
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        fecha: new Date().toISOString().split('T')[0],
        curso: '',
        asignatura_id: 0,
        docente_id: 0,
        tema: '',
        contenido: '',
        actividad: '',
        recursos: '',
        tarea: '',
        evaluacion: '',
        observaciones: '',
        planificado: true,
        estado: 'planificado'
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: TopicFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const cursoSeleccionado = watch('curso');
  const asignaturasDelCurso = subjects.filter(s => s.curso === cursoSeleccionado);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los datos del tema dictado' : 'Completa los datos para registrar un nuevo tema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                {...register('fecha', { required: 'La fecha es requerida' })}
              />
              {errors.fecha && (
                <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="curso">Curso *</Label>
              <Select onValueChange={(value) => setValue('curso', value)} value={watch('curso')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso} value={curso}>
                      {curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.curso && (
                <p className="text-sm text-red-600 mt-1">El curso es requerido</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="asignatura_id">Asignatura *</Label>
            <Select 
              onValueChange={(value) => {
                const asignatura = asignaturasDelCurso.find(a => a.id.toString() === value);
                setValue('asignatura_id', parseInt(value));
                if (asignatura) {
                  setValue('docente_id', asignatura.docente_id);
                }
              }} 
              value={watch('asignatura_id')?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una asignatura" />
              </SelectTrigger>
              <SelectContent>
                {asignaturasDelCurso.map((asignatura) => (
                  <SelectItem key={asignatura.id} value={asignatura.id.toString()}>
                    {asignatura.nombre} - {asignatura.docente_nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asignatura_id && (
              <p className="text-sm text-red-600 mt-1">La asignatura es requerida</p>
            )}
          </div>

          <div>
            <Label htmlFor="tema">Tema de la Clase *</Label>
            <Input
              id="tema"
              {...register('tema', { required: 'El tema es requerido' })}
              placeholder="Ej: Ecuaciones de segundo grado"
            />
            {errors.tema && (
              <p className="text-sm text-red-600 mt-1">{errors.tema.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contenido">Contenido Desarrollado *</Label>
            <Textarea
              id="contenido"
              {...register('contenido', { required: 'El contenido es requerido' })}
              placeholder="Describe el contenido específico que se desarrolló en la clase"
              rows={3}
            />
            {errors.contenido && (
              <p className="text-sm text-red-600 mt-1">{errors.contenido.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="actividad">Actividades Realizadas *</Label>
            <Textarea
              id="actividad"
              {...register('actividad', { required: 'La actividad es requerida' })}
              placeholder="Describe las actividades y metodología utilizada"
              rows={3}
            />
            {errors.actividad && (
              <p className="text-sm text-red-600 mt-1">{errors.actividad.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recursos">Recursos Utilizados</Label>
              <Textarea
                id="recursos"
                {...register('recursos')}
                placeholder="Materiales, tecnología, bibliografía utilizada"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="tarea">Tarea Asignada</Label>
              <Textarea
                id="tarea"
                {...register('tarea')}
                placeholder="Describe la tarea o trabajo para el hogar"
                rows={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="evaluacion">Evaluación</Label>
            <Textarea
              id="evaluacion"
              {...register('evaluacion')}
              placeholder="Tipo de evaluación realizada (oral, escrita, práctica, etc.)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Comentarios adicionales, ausencias, incidentes, etc."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="planificado" 
                checked={watch('planificado')}
                onCheckedChange={(checked) => setValue('planificado', checked as boolean)}
              />
              <Label htmlFor="planificado">Clase planificada</Label>
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value) => setValue('estado', value)} value={watch('estado')}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado de la clase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificado">Planificado</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="reprogramado">Reprogramado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Registrar'} Tema
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicForm;
