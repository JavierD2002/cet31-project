
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Calendar, User, Book } from 'lucide-react';

const DocenteDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.nombre}</h1>
          <p className="text-gray-600">Panel de docente - Gestiona tus cursos y estudiantes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Visualiza y actualiza tu información personal</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/docentes/${user?.id}/perfil`}>
                  <User className="h-4 w-4 mr-2" />
                  Ver perfil
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">Control de Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Registrar y gestionar la asistencia de los estudiantes</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/asistencia">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gestionar asistencia
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700">Calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Cargar y gestionar calificaciones</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/calificaciones">
                  <FileText className="h-4 w-4 mr-2" />
                  Gestionar calificaciones
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700">Informes Pedagógicos</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generar informes y reportes pedagógicos</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/informes">
                  <FileText className="h-4 w-4 mr-2" />
                  Crear informes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Libro de Tema</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Gestionar el libro de temas de tus cursos</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/libro-de-tema">
                  <Book className="h-4 w-4 mr-2" />
                  Libro de tema
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocenteDashboard;
