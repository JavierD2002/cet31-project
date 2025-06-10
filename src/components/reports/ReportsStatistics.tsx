
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ReportsStatisticsProps {
  mockInformes: any[];
  mockCursos: string[];
}

const ReportsStatistics = ({ mockInformes, mockCursos }: ReportsStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{mockInformes.length}</div>
          <div className="text-sm text-gray-600">Informes Totales</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {mockInformes.filter(i => new Date(i.fecha).getMonth() === new Date().getMonth()).length}
          </div>
          <div className="text-sm text-gray-600">Este Mes</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">{mockCursos.length}</div>
          <div className="text-sm text-gray-600">Cursos Activos</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsStatistics;
