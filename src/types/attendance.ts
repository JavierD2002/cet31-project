
export interface Teacher {
  id: number;
  nombre: string;
}

export interface Subject {
  id: number;
  nombre: string;
  profesorId: number;
  cursos: string[];
}

export interface Student {
  id: number;
  nombre: string;
  curso: string;
}

export interface AttendanceStatus {
  status: 'presente' | 'ausente' | 'tardanza' | 'retirado';
  timestamp?: Date;
  observacion?: string;
}
