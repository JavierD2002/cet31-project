
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Trash2, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRole } from '@/types/supabase';

type UserData = {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
};

interface UserTableProps {
  users: UserData[];
  loading: boolean;
  onDeleteUser: (user: UserData) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDeleteUser }) => {
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

  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">Cargando usuarios...</div>
        </TableCell>
      </TableRow>
    );
  }

  if (users.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
          No se encontraron usuarios
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {users.map((user) => (
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
                onClick={() => onDeleteUser(user)}
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
      ))}
    </>
  );
};

export default UserTable;
