
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

interface SubjectFormData {
  nombre: string;
  curso: string;
  docente_id?: number;
  descripcion?: string;
  carga_horaria: number;
}

interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubjectFormData) => void;
  teachers: Array<{ id: number; nombre: string }>;
  initialData?: SubjectFormData & { id?: number };
  title: string;
}

const cursos = [
  "1° Año A", "1° Año B", "1° Año C",
  "2° Año A", "2° Año B", "2° Año C",
  "3° Año A", "3° Año B", "3° Año C",
  "4° Año A", "4° Año B",
  "5° Año A", "5° Año B"
];

const SubjectForm: React.FC<SubjectFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  teachers,
  initialData,
  title
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SubjectFormData>({
    defaultValues: initialData || {
      nombre: '',
      curso: '',
      docente_id: undefined,
      descripcion: '',
      carga_horaria: 1
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        nombre: '',
        curso: '',
        docente_id: undefined,
        descripcion: '',
        carga_horaria: 1
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: SubjectFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los datos de la asignatura' : 'Completa los datos para crear una nueva asignatura'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre de la Asignatura *</Label>
            <Input
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              placeholder="Ej: Matemática, Lengua, Historia..."
            />
            {errors.nombre && (
              <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
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

          <div>
            <Label htmlFor="docente_id">Docente Asignado</Label>
            <Select 
              onValueChange={(value) => setValue('docente_id', value ? parseInt(value) : undefined)} 
              value={watch('docente_id')?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un docente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin asignar</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="carga_horaria">Carga Horaria Semanal *</Label>
            <Input
              id="carga_horaria"
              type="number"
              min="1"
              max="10"
              {...register('carga_horaria', { 
                required: 'La carga horaria es requerida',
                min: { value: 1, message: 'Mínimo 1 hora' },
                max: { value: 10, message: 'Máximo 10 horas' },
                valueAsNumber: true
              })}
              placeholder="Horas por semana"
            />
            {errors.carga_horaria && (
              <p className="text-sm text-red-600 mt-1">{errors.carga_horaria.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Descripción de la asignatura (opcional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Crear'} Asignatura
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectForm;
