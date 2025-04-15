
import React, { useState } from 'react';
import { Search, FileText, Plus, ChevronLeft, Download, Eye } from 'lucide-react';
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
import { Link } from 'react-router-dom';

// Mock data for reports
const mockInformes = [
  { 
    id: 1, 
    alumno: "Acosta, María", 
    curso: "1° Año A", 
    fecha: "15/03/2025", 
    periodo: "Primer Trimestre", 
    tipo: "Desempeño académico",
    autor: "Prof. García, Susana"
  },
  { 
    id: 2, 
    alumno: "Benítez, Carlos", 
    curso: "1° Año A", 
    fecha: "20/03/2025", 
    periodo: "Primer Trimestre", 
    tipo: "Comportamiento",
    autor: "Prof. Rodríguez, Manuel"
  },
  { 
    id: 3, 
    alumno: "Córdoba, Lucía", 
    curso: "1° Año A", 
    fecha: "22/03/2025", 
    periodo: "Primer Trimestre", 
    tipo: "Desempeño académico",
    autor: "Prof. García, Susana"
  },
  { 
    id: 4, 
    alumno: "Díaz, Mateo", 
    curso: "1° Año A", 
    fecha: "25/03/2025", 
    periodo: "Primer Trimestre", 
    tipo: "Integral",
    autor: "Prof. Morales, Ana"
  },
  { 
    id: 5, 
    alumno: "Espinoza, Valentina", 
    curso: "1° Año A", 
    fecha: "01/04/2025", 
    periodo: "Primer Trimestre", 
    tipo: "Comportamiento",
    autor: "Prof. Rodríguez, Manuel"
  },
];

const Informes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter reports based on search term
  const filteredInformes = mockInformes.filter(informe => 
    informe.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    informe.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    informe.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Informes Pedagógicos</h2>
          <Link 
            to="/informes/nuevo" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Informe
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestión de Informes</CardTitle>
            <CardDescription>
              Visualice, edite y cree nuevos informes pedagógicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar por alumno, curso o tipo de informe..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="border rounded-md px-3 py-2 w-48">
                <option value="">Todos los períodos</option>
                <option value="Primer Trimestre">Primer Trimestre</option>
                <option value="Segundo Trimestre">Segundo Trimestre</option>
                <option value="Tercer Trimestre">Tercer Trimestre</option>
              </select>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInformes.map((informe) => (
                    <TableRow key={informe.id}>
                      <TableCell className="font-medium">{informe.alumno}</TableCell>
                      <TableCell>{informe.curso}</TableCell>
                      <TableCell>{informe.fecha}</TableCell>
                      <TableCell>{informe.periodo}</TableCell>
                      <TableCell>{informe.tipo}</TableCell>
                      <TableCell>{informe.autor}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 rounded-md hover:bg-gray-100" title="Ver informe">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-gray-100" title="Descargar informe">
                            <Download className="h-4 w-4 text-green-600" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-gray-100" title="Editar informe">
                            <FileText className="h-4 w-4 text-yellow-600" />
                          </button>
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
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Mostrando {filteredInformes.length} de {mockInformes.length} informes
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Anterior</button>
                <button className="px-3 py-1 border rounded-md bg-blue-50 text-blue-600">1</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Siguiente</button>
              </div>
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

export default Informes;
