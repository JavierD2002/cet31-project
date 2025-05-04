
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import DeleteUserDialog from './DeleteUserDialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
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
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleOpenDeleteDialog = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
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
            <UserFilters 
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              onSearchChange={setSearchTerm}
              onRoleFilterChange={setRoleFilter}
            />

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
                  <UserTable 
                    users={filteredUsers} 
                    loading={loading}
                    onDeleteUser={handleOpenDeleteDialog}
                  />
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

      <DeleteUserDialog 
        user={userToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleDeleteUser}
      />

      <Footer />
    </div>
  );
};

export default UserManagement;
