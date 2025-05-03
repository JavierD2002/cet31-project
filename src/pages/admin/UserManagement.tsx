
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, UserPlus, User, Edit, Trash2, Shield, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserRole } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

// Tipo para los usuarios
type UserData = {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
};

// Datos ficticios para simular usuarios
const mockUsers: UserData[] = [
  { id: 1, dni: '12345678', nombre: 'Administrador', apellido: 'Sistema', email: 'admin@escuela.edu', rol: 'administrador' },
  { id: 2, dni: '23456789', nombre: 'Ricardo', apellido: 'Gómez', email: 'ricardo.gomez@escuela.edu', rol: 'directivo' },
  { id: 3, dni: '34567890', nombre: 'Carlos', apellido: 'Pérez', email: 'carlos.perez@escuela.edu', rol: 'docente' },
  { id: 4, dni: '45678901', nombre: 'Ana', apellido: 'Rodríguez', email: 'ana.rodriguez@escuela.edu', rol: 'docente' },
  { id: 5, dni: '56789012', nombre: 'María', apellido: 'López', email: 'maria.lopez@escuela.edu', rol: 'docente' },
  { id: 6, dni: '67890123', nombre: 'Juan', apellido: 'Martínez', email: 'juan.martinez@escuela.edu', rol: 'estudiante' },
  { id: 7, dni: '78901234', nombre: 'Laura', apellido: 'García', email: 'laura.garcia@escuela.edu', rol: 'estudiante' },
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  useEffect(() => {
    // Simular carga de datos desde la API
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Filtrar usuarios según término de búsqueda y rol
    const result = users.filter(user => {
      const matchSearch = 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni.includes(searchTerm);
        
      const matchRole = roleFilter ? user.rol === roleFilter : true;
      
      return matchSearch && matchRole;
    });
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const handleDeleteUser = (userId: number) => {
    // En un sistema real, aquí se eliminaría el usuario de la base de datos
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
    });
    setUserToDelete(null);
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'administrador': return 'Administrador';
      case 'directivo': return 'Directivo';
      case 'docente': return 'Docente';
      case 'estudiante': return 'Estudiante';
      default: return role;
    }
  };

  const getBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'directivo': return 'bg-purple-100 text-purple-800';
      case 'docente': return 'bg-blue-100 text-blue-800';
      case 'estudiante': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administre todos los usuarios del sistema</CardDescription>
              </div>
              <Link to="/admin/usuarios/nuevo">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, DNI o email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    {roleFilter ? getRoleLabel(roleFilter) : "Todos los roles"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter('')}>
                    Todos los roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('administrador')}>
                    Administrador
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('directivo')}>
                    Directivo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('docente')}>
                    Docente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('estudiante')}>
                    Estudiante
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">Cargando usuarios...</div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.dni}</TableCell>
                        <TableCell className="font-medium">{`${user.apellido}, ${user.nombre}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(user.rol)}`}>
                            {getRoleLabel(user.rol)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={user.rol === 'docente' ? `/docentes/${user.id}/perfil` : user.rol === 'estudiante' ? `/estudiantes/${user.id}/perfil` : `/admin/usuarios/${user.id}`}>
                                <User className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/usuarios/${user.id}/editar`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setUserToDelete(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/usuarios/${user.id}/permisos`}>
                                <Shield className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Contador de usuarios */}
            <div className="mt-4 text-sm text-gray-500">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Diálogo de confirmación para eliminar usuario */}
      {userToDelete && (
        <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar al usuario {userToDelete.nombre} {userToDelete.apellido}?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserToDelete(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteUser(userToDelete.id)}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default UserManagement;
