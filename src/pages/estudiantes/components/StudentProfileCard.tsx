
import { User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StudentBasicInfo = {
  usuario: {
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  curso: string;
};

const StudentProfileCard = ({ profile }: { profile: StudentBasicInfo }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>{profile.usuario.apellido}, {profile.usuario.nombre}</CardTitle>
            <CardDescription>DNI: {profile.usuario.dni} | Curso: {profile.curso}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium">Email:</p>
            <p className="text-gray-600">{profile.usuario.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
