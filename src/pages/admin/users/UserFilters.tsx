
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from '@/types/supabase';

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: UserRole | '';
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (role: UserRole | '') => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
}) => {
  const getRoleLabel = (role: UserRole | '') => {
    switch(role) {
      case 'administrador': return 'Administrador';
      case 'directivo': return 'Directivo';
      case 'docente': return 'Docente';
      case 'estudiante': return 'Estudiante';
      default: return "Todos los roles";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nombre, DNI o email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            {getRoleLabel(roleFilter)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onRoleFilterChange('')}>
            Todos los roles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleFilterChange('administrador')}>
            Administrador
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleFilterChange('directivo')}>
            Directivo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleFilterChange('docente')}>
            Docente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleFilterChange('estudiante')}>
            Estudiante
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserFilters;
