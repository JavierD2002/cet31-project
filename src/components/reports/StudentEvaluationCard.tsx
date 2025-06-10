
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StudentEvaluationCardProps {
  estudiante: {
    id: number;
    nombre: string;
    apropiacion: string;
    participacion: string;
    comunicacion: string;
    observaciones: string;
  };
  onFieldChange: (studentId: number, field: string, value: string) => void;
}

const StudentEvaluationCard = ({ estudiante, onFieldChange }: StudentEvaluationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{estudiante.nombre}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>1. Apropiación/Construcción de Saberes/Contenidos</Label>
            <Select 
              value={estudiante.apropiacion} 
              onValueChange={(value) => onFieldChange(estudiante.id, 'apropiacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Lograda">Lograda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>2. Participación</Label>
            <Select 
              value={estudiante.participacion} 
              onValueChange={(value) => onFieldChange(estudiante.id, 'participacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sostenida">Sostenida</SelectItem>
                <SelectItem value="Intermitente">Intermitente</SelectItem>
                <SelectItem value="Nula">Nula</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>3. Comunicación/Vinculación</Label>
            <Select 
              value={estudiante.comunicacion} 
              onValueChange={(value) => onFieldChange(estudiante.id, 'comunicacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sostenida">Sostenida</SelectItem>
                <SelectItem value="Intermitente">Intermitente</SelectItem>
                <SelectItem value="Nula">Nula</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label>4. Observaciones</Label>
          <Textarea
            value={estudiante.observaciones}
            onChange={(e) => onFieldChange(estudiante.id, 'observaciones', e.target.value)}
            placeholder="Escriba observaciones detalladas sobre el estudiante..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentEvaluationCard;
