
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ClassroomFormData {
  nombre: string;
  capacidad: number;
  ubicacion: string;
  recursos?: string;
  activa: boolean;
}

interface ClassroomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClassroomFormData) => void;
  initialData?: ClassroomFormData & { id?: number };
  title: string;
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ClassroomFormData>({
    defaultValues: initialData || {
      nombre: '',
      capacidad: 20,
      ubicacion: '',
      recursos: '',
      activa: true
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        nombre: '',
        capacidad: 20,
        ubicacion: '',
        recursos: '',
        activa: true
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: ClassroomFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los datos del aula' : 'Completa los datos para crear una nueva aula'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Aula *</Label>
            <Input
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              placeholder="Ej: Aula 101, Laboratorio de Ciencias..."
            />
            {errors.nombre && (
              <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="capacidad">Capacidad *</Label>
            <Input
              id="capacidad"
              type="number"
              min="1"
              max="100"
              {...register('capacidad', { 
                required: 'La capacidad es requerida',
                min: { value: 1, message: 'Mínimo 1 estudiante' },
                max: { value: 100, message: 'Máximo 100 estudiantes' },
                valueAsNumber: true
              })}
              placeholder="Número de estudiantes"
            />
            {errors.capacidad && (
              <p className="text-sm text-red-600 mt-1">{errors.capacidad.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              {...register('ubicacion', { required: 'La ubicación es requerida' })}
              placeholder="Ej: Planta Baja - Ala Norte"
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-600 mt-1">{errors.ubicacion.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="recursos">Recursos Disponibles</Label>
            <Textarea
              id="recursos"
              {...register('recursos')}
              placeholder="Ej: Proyector, Pizarra Digital, WiFi, Aire acondicionado..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="activa"
              checked={watch('activa')}
              onCheckedChange={(checked) => setValue('activa', !!checked)}
            />
            <Label htmlFor="activa">Aula activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Crear'} Aula
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomForm;
