
import React, { useState } from 'react';
import { 
  CalendarIcon, 
  BookIcon, 
  SearchIcon, 
  PlusCircleIcon,
  FilterIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos de ejemplo
const temasDictadosEjemplo = [
  { 
    id: 1, 
    fecha: '2025-04-15', 
    curso: '3° Año A', 
    materia: 'Matemática', 
    docente: 'López, María', 
    tema: 'Ecuaciones de segundo grado', 
    actividad: 'Resolución de ejercicios prácticos',
    observaciones: 'Se tomó evaluación diagnóstica'
  },
  { 
    id: 2, 
    fecha: '2025-04-14', 
    curso: '2° Año B', 
    materia: 'Historia', 
    docente: 'Rodríguez, Juan', 
    tema: 'Revolución Industrial', 
    actividad: 'Análisis de fuentes históricas',
    observaciones: ''
  },
  { 
    id: 3, 
    fecha: '2025-04-14', 
    curso: '1° Año C', 
    materia: 'Biología', 
    docente: 'González, Ana', 
    tema: 'La célula', 
    actividad: 'Observación de preparados en microscopio',
    observaciones: 'Faltó material para algunos grupos'
  },
  { 
    id: 4, 
    fecha: '2025-04-13', 
    curso: '3° Año A', 
    materia: 'Matemática', 
    docente: 'López, María', 
    tema: 'Polinomios', 
    actividad: 'Introducción teórica y ejercicios',
    observaciones: ''
  },
  { 
    id: 5, 
    fecha: '2025-04-12', 
    curso: '5° Año A', 
    materia: 'Física', 
    docente: 'Martínez, Carlos', 
    tema: 'Leyes de Newton', 
    actividad: 'Experimentos demostrativos',
    observaciones: 'Se utilizó el laboratorio'
  },
];

const LibroDeTema = () => {
  const [temasDictados, setTemasDictados] = useState(temasDictadosEjemplo);
  const [filtro, setFiltro] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  
  // Filtrar temas según la búsqueda y curso seleccionado
  const temasFiltrados = temasDictados.filter(tema => {
    const coincideBusqueda = tema.tema.toLowerCase().includes(filtro.toLowerCase()) || 
                           tema.docente.toLowerCase().includes(filtro.toLowerCase()) ||
                           tema.materia.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideCurso = cursoSeleccionado ? tema.curso === cursoSeleccionado : true;
    
    return coincideBusqueda && coincideCurso;
  });
  
  // Lista de cursos únicos para el filtro
  const cursos = [...new Set(temasDictados.map(tema => tema.curso))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <BookIcon className="mr-2" />
            Libro de Tema
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Usuario: Docente</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold">Registro de temas dictados</h2>
          </div>
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Nuevo registro
          </Button>
        </div>
        
        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Buscar y filtrar</CardTitle>
            <CardDescription>Encuentra registros específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por tema, docente o materia..." 
                  className="pl-9"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                <Select value={cursoSeleccionado} onValueChange={setCursoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los cursos</SelectItem>
                    {cursos.map(curso => (
                      <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabla de temas dictados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookIcon className="mr-2 h-5 w-5 text-purple-600" />
              Temas dictados
            </CardTitle>
            <CardDescription>
              Total de registros: {temasFiltrados.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {temasFiltrados.length > 0 ? (
                    temasFiltrados.map((tema) => (
                      <TableRow key={tema.id} className="hover:bg-purple-50">
                        <TableCell>{new Date(tema.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>{tema.curso}</TableCell>
                        <TableCell>{tema.materia}</TableCell>
                        <TableCell>{tema.docente}</TableCell>
                        <TableCell>{tema.tema}</TableCell>
                        <TableCell>{tema.actividad}</TableCell>
                        <TableCell>{tema.observaciones || "—"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No se encontraron registros que coincidan con la búsqueda
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Sistema de Gestión Escolar - Escuela Técnica de Río Negro</p>
        </div>
      </footer>
    </div>
  );
};

export default LibroDeTema;
