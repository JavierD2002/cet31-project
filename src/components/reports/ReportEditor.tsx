
import React, { useState, useEffect } from 'react';
import { Save, FileText, Eye, Download, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ReportEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: any) => void;
  report?: any;
  students: any[];
  templates: any[];
  currentUserId: number;
}

const ReportEditor = ({ 
  isOpen, 
  onClose, 
  onSave, 
  report, 
  students, 
  templates,
  currentUserId
}: ReportEditorProps) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    tipo_informe: '',
    periodo: '',
    titulo: '',
    contenido: '',
    observaciones: '',
    plantilla_id: '',
    estado: 'borrador'
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        estudiante_id: report.estudiante_id?.toString() || '',
        tipo_informe: report.tipo_informe || '',
        periodo: report.periodo || '',
        titulo: report.titulo || '',
        contenido: report.contenido || '',
        observaciones: report.observaciones || '',
        plantilla_id: report.plantilla_id?.toString() || '',
        estado: report.estado || 'borrador'
      });
    } else {
      setFormData({
        estudiante_id: '',
        tipo_informe: '',
        periodo: '',
        titulo: '',
        contenido: '',
        observaciones: '',
        plantilla_id: '',
        estado: 'borrador'
      });
    }
  }, [report]);

  const handleTemplateChange = (templateId: string) => {
    setFormData(prev => ({ ...prev, plantilla_id: templateId }));
    
    if (templateId) {
      const template = templates.find(t => t.id.toString() === templateId);
      if (template) {
        setSelectedTemplate(template);
        setFormData(prev => ({
          ...prev,
          tipo_informe: template.tipo,
          titulo: template.nombre,
          contenido: template.contenido
        }));
      }
    } else {
      setSelectedTemplate(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportData = {
      ...formData,
      estudiante_id: parseInt(formData.estudiante_id),
      plantilla_id: formData.plantilla_id ? parseInt(formData.plantilla_id) : undefined,
      autor_id: currentUserId
    };

    onSave(reportData);
    onClose();
  };

  const periodos = [
    "Primer Trimestre",
    "Segundo Trimestre", 
    "Tercer Trimestre",
    "Anual"
  ];

  const tiposInforme = [
    { value: "desempeño_academico", label: "Desempeño Académico" },
    { value: "comportamiento", label: "Comportamiento" },
    { value: "integral", label: "Integral" },
    { value: "personalizado", label: "Personalizado" }
  ];

  const processContent = (content: string) => {
    const selectedStudent = students.find(s => s.id.toString() === formData.estudiante_id);
    if (!selectedStudent) return content;

    return content
      .replace(/{estudiante_nombre}/g, `${selectedStudent.apellido}, ${selectedStudent.nombre}`)
      .replace(/{curso}/g, selectedStudent.curso || 'Sin curso')
      .replace(/{periodo}/g, formData.periodo);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {report ? 'Editar Informe' : 'Nuevo Informe'}
          </DialogTitle>
          <DialogDescription>
            {report ? 'Modifica los datos del informe' : 'Completa la información para crear un nuevo informe'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estudiante">Estudiante *</Label>
              <Select 
                value={formData.estudiante_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, estudiante_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.apellido}, {student.nombre} - {student.curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plantilla">Plantilla</Label>
              <Select 
                value={formData.plantilla_id} 
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin plantilla</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Informe *</Label>
              <Select 
                value={formData.tipo_informe} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_informe: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposInforme.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodo">Período *</Label>
              <Select 
                value={formData.periodo} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, periodo: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(periodo => (
                    <SelectItem key={periodo} value={periodo}>
                      {periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="titulo">Título del Informe *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Título del informe"
              required
            />
          </div>

          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Plantilla: {selectedTemplate.nombre}</h4>
                <Badge variant="secondary">{selectedTemplate.tipo}</Badge>
              </div>
              <p className="text-sm text-blue-700">{selectedTemplate.descripcion}</p>
              {selectedTemplate.campos_requeridos && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-blue-800">Campos sugeridos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTemplate.campos_requeridos.map((campo: string) => (
                      <Badge key={campo} variant="outline" className="text-xs">
                        {campo.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="contenido">Contenido del Informe *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? 'Editar' : 'Vista Previa'}
              </Button>
            </div>
            
            {showPreview ? (
              <div className="border rounded-md p-4 bg-gray-50 min-h-[300px] whitespace-pre-wrap">
                {processContent(formData.contenido)}
              </div>
            ) : (
              <Textarea
                id="contenido"
                value={formData.contenido}
                onChange={(e) => setFormData(prev => ({ ...prev, contenido: e.target.value }))}
                placeholder="Contenido del informe..."
                className="min-h-[300px]"
                required
              />
            )}
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, estado: 'borrador' }))}
                className={formData.estado === 'borrador' ? 'bg-gray-100' : ''}
              >
                Guardar como Borrador
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, estado: 'revision' }))}
                className={formData.estado === 'revision' ? 'bg-yellow-100' : ''}
              >
                Enviar a Revisión
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, estado: 'finalizado' }))}
                className={formData.estado === 'finalizado' ? 'bg-green-100' : ''}
              >
                Finalizar
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEditor;
