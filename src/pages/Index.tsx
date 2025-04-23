
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" 
              alt="Logo CET31" 
              className="h-10 mr-3" 
            />
            <h1 className="text-2xl font-bold">Sistema de Gestión Escolar - CET31</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Estudiantes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Gestionar información de estudiantes</p>
              <Link 
                to="/estudiantes"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Control de asistencia diaria</p>
              <Link 
                to="/asistencia"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700">Informes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generación de informes y estadísticas</p>
              <Link 
                to="/informes"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700">Calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Registro y consulta de calificaciones</p>
              <Link 
                to="/calificaciones"
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Libro de Tema</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Gestión del libro de temas</p>
              <Link 
                to="/libro-de-tema"
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-cyan-50">
              <CardTitle className="text-cyan-700">Docentes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Administración de información docente</p>
              <Link 
                to="/docentes"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700">Asignaturas</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Gestión de materias y asignaturas</p>
              <Link 
                to="/asignaturas"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-rose-50">
              <CardTitle className="text-rose-700">Aulas</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Administración de espacios educativos</p>
              <Link 
                to="/aulas"
                className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 inline-block"
              >
                Acceder
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividades Recientes</CardTitle>
              <CardDescription>Historial de acciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">Hoy, 09:45</span>
                  <p>Actualización de datos de estudiante</p>
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">Ayer, 14:30</span>
                  <p>Registro de asistencia completado</p>
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">22/04/2025, 11:15</span>
                  <p>Publicación de calificaciones del 1er trimestre</p>
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">21/04/2025, 16:20</span>
                  <p>Nuevo docente registrado en el sistema</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Calendario de actividades</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>Escuela Técnica de Villa Manzano - Río Negro - Argentina</p>
          <p>Contacto: <a href="mailto:cet31vmanzano23@gmail.com" className="hover:underline">cet31vmanzano23@gmail.com</a></p>
          <p>&copy; 2025 Sistema de Gestión Escolar</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
