
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface TeacherFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      dni: '',
      nombre: '',
      apellido: '',
      email: '',
      especialidad: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        dni: initialData.usuario?.dni || initialData.dni || '',
        nombre: initialData.usuario?.nombre || initialData.nombre || '',
        apellido: initialData.usuario?.apellido || initialData.apellido || '',
        email: initialData.usuario?.email || initialData.email || '',
        especialidad: initialData.especialidad || ''
      });
    } else {
      reset({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        especialidad: ''
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  const especialidades = [
    "Matemáticas", "Lengua y Literatura", "Historia", "Geografía",
    "Ciencias Naturales", "Física", "Química", "Biología",
    "Educación Física", "Arte", "Música", "Inglés", "Informática"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Complete los datos del docente
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              placeholder="12345678"
              {...register('dni', { required: 'El DNI es requerido' })}
            />
            {errors.dni && (
              <p className="text-sm text-red-500">{errors.dni.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Juan"
              {...register('nombre', { required: 'El nombre es requerido' })}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="Pérez"
              {...register('apellido', { required: 'El apellido es requerido' })}
            />
            {errors.apellido && (
              <p className="text-sm text-red-500">{errors.apellido.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan.perez@colegio.edu"
              {...register('email', { 
                required: 'El email es requerido',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Formato de email inválido'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="especialidad">Especialidad</Label>
            <Select
              value={watch('especialidad')}
              onValueChange={(value) => setValue('especialidad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar especialidad" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((especialidad) => (
                  <SelectItem key={especialidad} value={especialidad}>
                    {especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.especialidad && (
              <p className="text-sm text-red-500">{errors.especialidad.message as string}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherForm;
