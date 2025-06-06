
import React, { useState } from 'react';
import { ChevronLeft, GraduationCap, Save, Filter, Calculator, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  getSubjects, 
  getGradesByCourseAndSubject, 
  saveGrade,
  type GradePeriod,
  type StudentGrades 
} from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

const Calificaciones = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<GradePeriod>('primer_trimestre');
  const [grades, setGrades] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();

  const canEditGrades = hasRole(['administrador', 'directivo', 'docente']);

  // Obtener asignaturas
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  // Obtener calificaciones cuando se selecciona curso y materia
  const { data: studentGrades = [], isLoading: loadingGrades, refetch } = useQuery({
    queryKey: ['grades', selectedCourse, selectedSubject],
    queryFn: () => getGradesByCourseAndSubject(selectedCourse, selectedSubject!),
    enabled: !!(selectedCourse && selectedSubject),
  });

  // Mutación para guardar calificaciones
  const saveGradeMutation = useMutation({
    mutationFn: ({ estudianteId, nota }: { estudianteId: number; nota: number }) =>
      saveGrade(estudianteId, selectedSubject!, selectedPeriod, nota),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades', selectedCourse, selectedSubject] });
      toast({
        title: "Calificación guardada",
        description: "La calificación se ha guardado correctamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error saving grade:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la calificación.",
        variant: "destructive",
      });
    },
  });

  // Obtener cursos únicos de las asignaturas
  const uniqueCourses = [...new Set(subjects.map(s => s.curso))].sort();

  // Filtrar asignaturas por curso seleccionado
  const courseSubjects = subjects.filter(s => s.curso === selectedCourse);

  // Manejar cambio de calificación
  const handleGradeChange = (estudianteId: number, value: string) => {
    const key = `${estudianteId}-${selectedPeriod}`;
    setGrades(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Guardar calificación individual
  const handleSaveGrade = async (estudianteId: number) => {
    const key = `${estudianteId}-${selectedPeriod}`;
    const value = grades[key];
    
    if (!value || isNaN(Number(value))) {
      toast({
        title: "Error",
        description: "Ingrese una calificación válida (número).",
        variant: "destructive",
      });
      return;
    }

    const nota = Number(value);
    if (nota < 1 || nota > 10) {
      toast({
        title: "Error",
        description: "La calificación debe estar entre 1 y 10.",
        variant: "destructive",
      });
      return;
    }

    saveGradeMutation.mutate({ estudianteId, nota });
  };

  // Guardar todas las calificaciones
  const handleSaveAllGrades = async () => {
    if (!selectedSubject) return;

    const gradesToSave = Object.entries(grades)
      .filter(([key, value]) => key.includes(selectedPeriod) && value && !isNaN(Number(value)))
      .map(([key, value]) => {
        const estudianteId = parseInt(key.split('-')[0]);
        const nota = Number(value);
        return { estudianteId, nota };
      })
      .filter(({ nota }) => nota >= 1 && nota <= 10);

    if (gradesToSave.length === 0) {
      toast({
        title: "Sin cambios",
        description: "No hay calificaciones válidas para guardar.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const { estudianteId, nota } of gradesToSave) {
        await saveGrade(estudianteId, selectedSubject, selectedPeriod, nota);
      }
      
      queryClient.invalidateQueries({ queryKey: ['grades', selectedCourse, selectedSubject] });
      setGrades({});
      
      toast({
        title: "Calificaciones guardadas",
        description: `Se guardaron ${gradesToSave.length} calificaciones correctamente.`,
      });
    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar las calificaciones.",
        variant: "destructive",
      });
    }
  };

  // Obtener la calificación actual del estudiante para el período seleccionado
  const getCurrentGrade = (student: StudentGrades) => {
    const key = `${student.estudiante_id}-${selectedPeriod}`;
    if (grades[key] !== undefined) {
      return grades[key];
    }

    switch (selectedPeriod) {
      case 'primer_trimestre':
        return student.primer_trimestre?.toString() || '';
      case 'segundo_trimestre':
        return student.segundo_trimestre?.toString() || '';
      case 'tercer_trimestre':
        return student.tercer_trimestre?.toString() || '';
      default:
        return '';
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Gestión de Calificaciones</h2>
          <Link to="/calificaciones/boletines" className="text-blue-600 hover:underline text-sm">
            <FileText className="h-4 w-4 inline mr-1" />
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
              Seleccione curso, materia y período para cargar las calificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Curso</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCourses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Materia</label>
                <Select 
                  value={selectedSubject?.toString() || ""} 
                  onValueChange={(value) => setSelectedSubject(parseInt(value))}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Período</label>
                <Select value={selectedPeriod} onValueChange={(value: GradePeriod) => setSelectedPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primer_trimestre">1° Trimestre</SelectItem>
                    <SelectItem value="segundo_trimestre">2° Trimestre</SelectItem>
                    <SelectItem value="tercer_trimestre">3° Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            {studentGrades.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Total Estudiantes</p>
                        <p className="text-xl font-bold">{studentGrades.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Promedio General</p>
                        <p className="text-xl font-bold">
                          {studentGrades.filter(s => s.promedio !== null).length > 0
                            ? (studentGrades.reduce((acc, s) => acc + (s.promedio || 0), 0) / 
                               studentGrades.filter(s => s.promedio !== null).length).toFixed(1)
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">Aprobados</Badge>
                      <div>
                        <p className="text-xl font-bold">
                          {studentGrades.filter(s => (s.promedio || 0) >= 6).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-600">Desaprobados</Badge>
                      <div>
                        <p className="text-xl font-bold">
                          {studentGrades.filter(s => s.promedio !== null && s.promedio < 6).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {selectedCourse && selectedSubject ? (
              loadingGrades ? (
                <div className="text-center py-8">Cargando calificaciones...</div>
              ) : studentGrades.length === 0 ? (
                <div className="text-center py-8">No hay estudiantes en este curso</div>
              ) : (
                <>
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
                          {canEditGrades && (
                            <TableHead className="w-32 text-center">Calificación Actual</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentGrades.map((student, index) => (
                          <TableRow key={student.estudiante_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <div className="font-medium">{student.estudiante_nombre}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={student.primer_trimestre ? 
                                  (student.primer_trimestre >= 6 ? "default" : "destructive") : 
                                  "secondary"
                                }
                              >
                                {student.primer_trimestre || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={student.segundo_trimestre ? 
                                  (student.segundo_trimestre >= 6 ? "default" : "destructive") : 
                                  "secondary"
                                }
                              >
                                {student.segundo_trimestre || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={student.tercer_trimestre ? 
                                  (student.tercer_trimestre >= 6 ? "default" : "destructive") : 
                                  "secondary"
                                }
                              >
                                {student.tercer_trimestre || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={student.promedio ? 
                                  (student.promedio >= 6 ? "default" : "destructive") : 
                                  "secondary"
                                }
                                className="font-bold"
                              >
                                {student.promedio?.toFixed(1) || "-"}
                              </Badge>
                            </TableCell>
                            {canEditGrades && (
                              <TableCell className="text-center">
                                <div className="flex items-center gap-2">
                                  <Input 
                                    className="w-16 text-center"
                                    placeholder="1-10"
                                    value={getCurrentGrade(student)}
                                    onChange={(e) => handleGradeChange(student.estudiante_id, e.target.value)}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSaveGrade(student.estudiante_id)}
                                    disabled={saveGradeMutation.isPending}
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {canEditGrades && (
                    <div className="mt-6 flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setGrades({})}
                      >
                        Limpiar Cambios
                      </Button>
                      <Button 
                        onClick={handleSaveAllGrades}
                        disabled={saveGradeMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Todas las Calificaciones
                      </Button>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                Seleccione un curso y una materia para ver las calificaciones
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calificaciones;
