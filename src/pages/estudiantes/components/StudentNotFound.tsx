
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const StudentNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>No se encontró el estudiante</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentNotFound;
