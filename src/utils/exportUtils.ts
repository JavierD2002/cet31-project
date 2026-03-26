import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportColumn {
  header: string;
  accessor: string | ((row: any) => string);
}

interface ExportOptions {
  title: string;
  columns: ExportColumn[];
  data: any[];
  filename: string;
}

const getValue = (row: any, accessor: string | ((row: any) => string)): string => {
  if (typeof accessor === 'function') return accessor(row);
  return String(row[accessor] ?? '');
};

export const exportToPDF = ({ title, columns, data, filename }: ExportOptions) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-AR')}`, 14, 28);
  doc.text(`Total de registros: ${data.length}`, 14, 34);

  autoTable(doc, {
    startY: 40,
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => getValue(row, c.accessor))),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportToExcel = ({ title, columns, data, filename }: ExportOptions) => {
  const wsData = [
    [title],
    [`Fecha de exportación: ${new Date().toLocaleDateString('es-AR')}`],
    [],
    columns.map(c => c.header),
    ...data.map(row => columns.map(c => getValue(row, c.accessor))),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws['!cols'] = columns.map(() => ({ wch: 20 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
