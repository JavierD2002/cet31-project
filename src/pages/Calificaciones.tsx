
import React, { useState } from 'react';
import { ChevronLeft, GraduationCap, Save, Filter } from 'lucide-react';
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

// Mock data for students with grades
const mockAlumnos = [
  { 
    id: 1, 
    nombre: "Acosta, María", 
    curso: "1° Año A",
    materias: {
      "Matemática": ["8", "9", ""],
      "Lengua": ["7", "8", ""],
      "Historia": ["9", "9", ""],
      "Geografía": ["8", "7", ""],
      "Física": ["7", "8", ""],
    }
  },
  { 
    id: 2, 
    nombre: "Benítez, Carlos", 
    curso: "1° Año A",
    materias: {
      "Matemática": ["6", "7", ""],
      "Lengua": ["8", "8", ""],
      "Historia": ["7", "6", ""],
      "Geografía": ["9", "8", ""],
      "Física": ["6", "7", ""],
    }
  },
  { 
    id: 3, 
    nombre: "Córdoba, Lucía", 
    curso: "1° Año A",
    materias: {
      "Matemática": ["9", "9", ""],
      "Lengua": ["10", "9", ""],
      "Historia": ["8", "9", ""],
      "Geografía": ["9", "9", ""],
      "Física": ["8", "8", ""],
    }
  },
  { 
    id: 4, 
    nombre: "Díaz, Mateo", 
    curso: "1° Año A",
    materias: {
      "Matemática": ["7", "6", ""],
      "Lengua": ["6", "7", ""],
      "Historia": ["8", "7", ""],
      "Geografía": ["7", "8", ""],
      "Física": ["6", "6", ""],
    }
  },
  { 
    id: 5, 
    nombre: "Espinoza, Valentina", 
    curso: "1° Año A",
    materias: {
      "Matemática": ["8", "8", ""],
      "Lengua": ["9", "8", ""],
      "Historia": ["10", "9", ""],
      "Geografía": ["8", "9", ""],
      "Física": ["7", "8", ""],
    }
  },
];

const Calificaciones = () => {
  const [selectedCourse, setSelectedCourse] = useState("1° Año A");
  const [selectedSubject, setSelectedSubject] = useState("Matemática");
  const [grades, setGrades] = useState<{ [key: number]: { [key: string]: string[] } }>(
    mockAlumnos.reduce((acc, alumno) => {
      acc[alumno.id] = { ...alumno.materias };
      return acc;
    }, {} as { [key: number]: { [key: string]: string[] } })
  );
  
  // Function to handle grade change
  const handleGradeChange = (studentId: number, subject: string, trimester: number, value: string) => {
    setGrades(prev => {
      const newGrades = { ...prev };
      if (!newGrades[studentId]) {
        newGrades[studentId] = {};
      }
      if (!newGrades[studentId][subject]) {
        newGrades[studentId][subject] = ["", "", ""];
      }
      
      const updatedSubjectGrades = [...newGrades[studentId][subject]];
      updatedSubjectGrades[trimester] = value;
      
      newGrades[studentId][subject] = updatedSubjectGrades;
      return newGrades;
    });
  };
  
  // Function to save grades
  const saveGrades = () => {
    // In a real application, this would save to MySQL database
    console.log("Saving grades for", selectedSubject, ":", grades);
    alert("Calificaciones guardadas correctamente");
  };
  
  // Get available subjects from the first student
  const subjects = Object.keys(mockAlumnos[0].materias);

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
          <h2 className="text-2xl font-semibold">Gestión de Calificaciones</h2>
          <Link to="/calificaciones/boletines" className="text-blue-600 hover:underline text-sm">
            Generar Boletines →
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
              Registro de Calificaciones
            </CardTitle>
            <CardDescription>
              Seleccione curso y materia para cargar las calificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Curso</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="1° Año A">1° Año A</option>
                  <option value="1° Año B">1° Año B</option>
                  <option value="2° Año A">2° Año A</option>
                  <option value="2° Año B">2° Año B</option>
                  <option value="3° Año A">3° Año A</option>
                  <option value="3° Año B">3° Año B</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Materia</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Alumno</TableHead>
                    <TableHead className="w-32 text-center">1° Trimestre</TableHead>
                    <TableHead className="w-32 text-center">2° Trimestre</TableHead>
                    <TableHead className="w-32 text-center">3° Trimestre</TableHead>
                    <TableHead className="w-32 text-center">Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlumnos
                    .filter(alumno => alumno.curso === selectedCourse)
                    .map((alumno, index) => {
                      const currentGrades = grades[alumno.id]?.[selectedSubject] || ["", "", ""];
                      const nonEmptyGrades = currentGrades.filter(g => g !== "").map(g => Number(g));
                      const average = nonEmptyGrades.length 
                        ? (nonEmptyGrades.reduce((a, b) => a + b, 0) / nonEmptyGrades.length).toFixed(1) 
                        : "-";
                        
                      return (
                        <TableRow key={alumno.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">{alumno.nombre}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              className="w-16 text-center mx-auto"
                              value={currentGrades[0]}
                              onChange={(e) => handleGradeChange(alumno.id, selectedSubject, 0, e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              className="w-16 text-center mx-auto"
                              value={currentGrades[1]}
                              onChange={(e) => handleGradeChange(alumno.id, selectedSubject, 1, e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              className="w-16 text-center mx-auto"
                              value={currentGrades[2]}
                              onChange={(e) => handleGradeChange(alumno.id, selectedSubject, 2, e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {average}
                          </TableCell>
                        </TableRow>
                      );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                onClick={saveGrades}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Calificaciones
              </button>
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

export default Calificaciones;
