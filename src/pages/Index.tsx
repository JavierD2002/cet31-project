import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <nav className="bg-white border-b">
        <div className="container mx-auto">
          <NavigationMenu className="py-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gestión de Alumnos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <Link to="/estudiantes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Estudiantes</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Gestionar información de estudiantes</p>
                    </Link>
                    <Link to="/asistencia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Asistencia</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Control de asistencia diaria</p>
                    </Link>
                    <Link to="/calificaciones" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Calificaciones</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Registro y consulta de calificaciones</p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Gestión Académica</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <Link to="/docentes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Docentes</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Administración de información docente</p>
                    </Link>
                    <Link to="/asignaturas" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Asignaturas</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Gestión de materias y asignaturas</p>
                    </Link>
                    <Link to="/libro-de-tema" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Libro de Tema</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Gestión del libro de temas</p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Gestión Administrativa</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <Link to="/aulas" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Aulas</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Administración de espacios educativos</p>
                    </Link>
                    <Link to="/informes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Informes</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Generación de informes y estadísticas</p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

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

      <Footer />
    </div>
  );
};

export default Index;
