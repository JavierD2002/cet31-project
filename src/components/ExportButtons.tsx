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
import { useLocation } from 'react-router-dom';
import { useReportPermissions } from '@/hooks/useReportPermissions';
import { reportForPath, type ReportType } from '@/lib/reportPermissions';
import { supabase } from '@/integrations/supabase/client';

interface ExportColumn {
  header: string;
  accessor: string | ((row: any) => string);
}

interface ExportButtonsProps {
  title: string;
  columns: ExportColumn[];
  data: any[];
  filename: string;
  reportType?: ReportType;
}

const ExportButtons = ({ title, columns, data, filename, reportType }: ExportButtonsProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const { canConsult } = useReportPermissions();
  const type = reportType ?? reportForPath(location.pathname);

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (data.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay datos para exportar",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type) {
        const { error } = await supabase.rpc('assert_report_access', { p_report_type: type });
        if (error) throw error;
      }
      if (format === 'pdf') {
        exportToPDF({ title, columns, data, filename });
      } else {
        exportToExcel({ title, columns, data, filename });
      }
      toast({
        title: "Exportación exitosa",
        description: `Archivo ${format === 'pdf' ? 'PDF' : 'Excel'} descargado correctamente`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo generar el archivo",
        variant: "destructive",
      });
    }
  };

  if (type && !canConsult(type)) return null;

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
