
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

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
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
      curso: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        dni: initialData.usuario?.dni || initialData.dni || '',
        nombre: initialData.usuario?.nombre || initialData.nombre || '',
        apellido: initialData.usuario?.apellido || initialData.apellido || '',
        email: initialData.usuario?.email || initialData.email || '',
        curso: initialData.curso || ''
      });
    } else {
      reset({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        curso: ''
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  const cursos = [
    "1° Año A", "1° Año B", "1° Año C",
    "2° Año A", "2° Año B", "2° Año C",
    "3° Año A", "3° Año B", "3° Año C",
    "4° Año A", "4° Año B", "4° Año C",
    "5° Año A", "5° Año B", "5° Año C",
    "6° Año A", "6° Año B", "6° Año C"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Complete los datos del estudiante
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
              placeholder="juan.perez@estudiante.edu"
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
            <Label htmlFor="curso">Curso</Label>
            <Select
              value={watch('curso')}
              onValueChange={(value) => setValue('curso', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar curso" />
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
              <p className="text-sm text-red-500">{errors.curso.message as string}</p>
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

export default StudentForm;
