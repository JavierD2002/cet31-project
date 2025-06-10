
import React from 'react';
import { Search, Download, Eye } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockAsignaturas = [
  { id: 1, nombre: "Matemática" },
  { id: 2, nombre: "Lengua" },
  { id: 3, nombre: "Historia" },
  { id: 4, nombre: "Geografía" }
];

const mockCursos = ["1° Año A", "1° Año B", "2° Año A", "2° Año B"];

interface ReportsListProps {
  filteredInformes: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  onViewReport: (informe: any) => void;
  onGeneratePDF: (informe: any) => void;
  hasRole: (roles: string | string[]) => boolean;
  user: any;
}

const ReportsList = ({
  filteredInformes,
  searchTerm,
  setSearchTerm,
  selectedCourse,
  setSelectedCourse,
  selectedSubject,
  setSelectedSubject,
  onViewReport,
  onGeneratePDF,
  hasRole,
  user
}: ReportsListProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Lista de Informes</CardTitle>
        <CardDescription>
          Visualice y gestione los informes pedagógicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar por curso, asignatura o docente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los cursos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los cursos</SelectItem>
              {mockCursos.map(curso => (
                <SelectItem key={curso} value={curso}>{curso}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todas las asignaturas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las asignaturas</SelectItem>
              {mockAsignaturas.map(asig => (
                <SelectItem key={asig.id} value={asig.nombre}>{asig.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Asignatura</TableHead>
                <TableHead>Docente</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInformes.map((informe) => (
                <TableRow key={informe.id}>
                  <TableCell>{new Date(informe.fecha).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline">{informe.curso}</Badge></TableCell>
                  <TableCell>{informe.asignatura}</TableCell>
                  <TableCell>{informe.docente_nombre}</TableCell>
                  <TableCell>{informe.estudiantes.length} estudiantes</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReport(informe)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(hasRole(['directivo', 'administrador']) || user?.id === informe.docente_id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onGeneratePDF(informe)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredInformes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron informes con los criterios de búsqueda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsList;
