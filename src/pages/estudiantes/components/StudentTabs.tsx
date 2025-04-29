
import { ReactNode } from 'react';
import { Book, Calendar } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type StudentTabsProps = {
  gradesContent: ReactNode;
  attendanceContent: ReactNode;
};

const StudentTabs = ({ gradesContent, attendanceContent }: StudentTabsProps) => {
  return (
    <Tabs defaultValue="calificaciones" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="calificaciones" className="flex items-center">
          <Book className="h-4 w-4 mr-2" />
          Calificaciones
        </TabsTrigger>
        <TabsTrigger value="asistencia" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Asistencia
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="calificaciones">
        {gradesContent}
      </TabsContent>
      
      <TabsContent value="asistencia">
        {attendanceContent}
      </TabsContent>
    </Tabs>
  );
};

export default StudentTabs;
