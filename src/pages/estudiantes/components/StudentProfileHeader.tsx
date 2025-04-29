
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';

const StudentProfileHeader = () => {
  return (
    <>
      <Header />
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/estudiantes" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Estudiantes
          </Link>
        </div>
      </nav>
    </>
  );
};

export default StudentProfileHeader;
