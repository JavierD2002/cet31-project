
import React from 'react';
import { Plus } from 'lucide-react';
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
import { Label } from "@/components/ui/label";

const mockAsignaturas = [
  { id: 1, nombre: "Matemática" },
  { id: 2, nombre: "Lengua" },
  { id: 3, nombre: "Historia" },
  { id: 4, nombre: "Geografía" }
];

const mockCursos = ["1° Año A", "1° Año B", "2° Año A", "2° Año B"];

interface ReportCreationFormProps {
  newReport: {
    fecha: string;
    asignatura: string;
    curso: string;
    estudiantes: any[];
  };
  setNewReport: React.Dispatch<React.SetStateAction<any>>;
  onStartNewReport: () => void;
}

const ReportCreationForm = ({ newReport, setNewReport, onStartNewReport }: ReportCreationFormProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Crear Nuevo Informe Pedagógico</CardTitle>
        <CardDescription>
          Complete los datos para crear un nuevo informe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={newReport.fecha}
              onChange={(e) => setNewReport(prev => ({ ...prev, fecha: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="asignatura">Asignatura</Label>
            <Select value={newReport.asignatura} onValueChange={(value) => setNewReport(prev => ({ ...prev, asignatura: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar asignatura" />
              </SelectTrigger>
              <SelectContent>
                {mockAsignaturas.map(asig => (
                  <SelectItem key={asig.id} value={asig.nombre}>{asig.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="curso">Curso</Label>
            <Select value={newReport.curso} onValueChange={(value) => setNewReport(prev => ({ ...prev, curso: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {mockCursos.map(curso => (
                  <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={onStartNewReport} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Crear Informe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCreationForm;
