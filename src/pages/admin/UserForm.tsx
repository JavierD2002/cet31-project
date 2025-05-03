
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/types/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type UserFormProps = {
  isEdit?: boolean;
};

const UserForm = ({ isEdit = false }: UserFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'estudiante' as UserRole,
    especialidad: '',
    curso: '',
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isEdit && id) {
        try {
          // En un sistema real, aquí obtendríamos los datos del usuario por ID
          // Por ahora simularemos una carga de datos
          setTimeout(() => {
            setFormData({
              dni: '34567890',
              nombre: 'Carlos',
              apellido: 'Pérez',
              email: 'carlos.perez@escuela.edu',
              password: '',
              rol: 'docente',
              especialidad: 'Historia',
              curso: '',
            });
            setLoading(false);
          }, 800);
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos del usuario",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id, isEdit, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // En un sistema real, aquí enviaríamos los datos al servidor
      // Por ahora simularemos una respuesta exitosa
      setTimeout(() => {
        toast({
          title: isEdit ? "Usuario actualizado" : "Usuario creado",
          description: `${formData.nombre} ${formData.apellido} ha sido ${isEdit ? 'actualizado' : 'registrado'} correctamente`,
        });
        
        navigate('/admin/usuarios');
      }, 1000);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast({
        title: "Error",
        description: `No se pudo ${isEdit ? 'actualizar' : 'crear'} el usuario`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
            <CardDescription>
              {isEdit ? 'Modifique los datos del usuario' : 'Complete el formulario para crear un nuevo usuario'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Ingrese DNI"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select 
                    value={formData.rol} 
                    onValueChange={(value) => handleSelectChange('rol', value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="rol">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="directivo">Directivo</SelectItem>
                      <SelectItem value="docente">Docente</SelectItem>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese nombre"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese apellido"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingrese email"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEdit ? 'Nueva contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEdit ? "••••••••" : "Ingrese contraseña"}
                  required={!isEdit}
                  disabled={loading}
                />
              </div>
              
              {formData.rol === 'docente' && (
                <div className="space-y-2">
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Input
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    placeholder="Ingrese especialidad"
                    disabled={loading}
                  />
                </div>
              )}
              
              {formData.rol === 'estudiante' && (
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso</Label>
                  <Select 
                    value={formData.curso} 
                    onValueChange={(value) => handleSelectChange('curso', value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="curso">
                      <SelectValue placeholder="Seleccione un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1° Año A">1° Año A</SelectItem>
                      <SelectItem value="1° Año B">1° Año B</SelectItem>
                      <SelectItem value="2° Año A">2° Año A</SelectItem>
                      <SelectItem value="2° Año B">2° Año B</SelectItem>
                      <SelectItem value="3° Año A">3° Año A</SelectItem>
                      <SelectItem value="3° Año B">3° Año B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/usuarios')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                    {isEdit ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  isEdit ? 'Actualizar Usuario' : 'Crear Usuario'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserForm;
