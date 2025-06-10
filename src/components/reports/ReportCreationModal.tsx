
import React from 'react';
import { Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StudentEvaluationCard from './StudentEvaluationCard';

interface ReportCreationModalProps {
  isCreating: boolean;
  onClose: () => void;
  newReport: {
    fecha: string;
    asignatura: string;
    curso: string;
    estudiantes: any[];
  };
  onStudentFieldChange: (studentId: number, field: string, value: string) => void;
  onSaveReport: () => void;
}

const ReportCreationModal = ({
  isCreating,
  onClose,
  newReport,
  onStudentFieldChange,
  onSaveReport
}: ReportCreationModalProps) => {
  return (
    <Dialog open={isCreating} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Informe Pedagógico - {newReport.curso} - {newReport.asignatura}
          </DialogTitle>
          <DialogDescription>
            Complete la evaluación para cada estudiante
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {newReport.estudiantes.map((estudiante) => (
            <StudentEvaluationCard
              key={estudiante.id}
              estudiante={estudiante}
              onFieldChange={onStudentFieldChange}
            />
          ))}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSaveReport}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Informe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCreationModal;
