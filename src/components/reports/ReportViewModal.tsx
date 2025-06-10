
import React from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ReportViewModalProps {
  editingReport: any;
  onClose: () => void;
  onGeneratePDF: (informe: any) => void;
}

const ReportViewModal = ({ editingReport, onClose, onGeneratePDF }: ReportViewModalProps) => {
  return (
    <Dialog open={!!editingReport} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Ver Informe - {editingReport?.curso} - {editingReport?.asignatura}
          </DialogTitle>
          <DialogDescription>
            Fecha: {editingReport && new Date(editingReport.fecha).toLocaleDateString()} | 
            Docente: {editingReport?.docente_nombre}
          </DialogDescription>
        </DialogHeader>

        {editingReport && (
          <div className="space-y-6">
            {editingReport.estudiantes.map((estudiante: any) => (
              <Card key={estudiante.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{estudiante.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Apropiación/Construcción de Saberes</Label>
                      <Badge variant={estudiante.apropiacion === 'Lograda' ? 'default' : 'secondary'}>
                        {estudiante.apropiacion}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label>Participación</Label>
                      <Badge variant={
                        estudiante.participacion === 'Sostenida' ? 'default' : 
                        estudiante.participacion === 'Intermitente' ? 'secondary' : 'destructive'
                      }>
                        {estudiante.participacion}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label>Comunicación/Vinculación</Label>
                      <Badge variant={
                        estudiante.comunicacion === 'Sostenida' ? 'default' : 
                        estudiante.comunicacion === 'Intermitente' ? 'secondary' : 'destructive'
                      }>
                        {estudiante.comunicacion}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Observaciones</Label>
                    <div className="p-3 bg-gray-50 rounded-md min-h-[60px]">
                      {estudiante.observaciones || "Sin observaciones"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Button onClick={() => onGeneratePDF(editingReport)}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewModal;
