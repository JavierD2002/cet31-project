import React from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToPDF, exportToExcel } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface ExportColumn {
  header: string;
  accessor: string | ((row: any) => string);
}

interface ExportButtonsProps {
  title: string;
  columns: ExportColumn[];
  data: any[];
  filename: string;
}

const ExportButtons = ({ title, columns, data, filename }: ExportButtonsProps) => {
  const { toast } = useToast();

  const handleExport = (type: 'pdf' | 'excel') => {
    if (data.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay datos para exportar",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === 'pdf') {
        exportToPDF({ title, columns, data, filename });
      } else {
        exportToExcel({ title, columns, data, filename });
      }
      toast({
        title: "Exportación exitosa",
        description: `Archivo ${type === 'pdf' ? 'PDF' : 'Excel'} descargado correctamente`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo generar el archivo",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar a PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar a Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;
