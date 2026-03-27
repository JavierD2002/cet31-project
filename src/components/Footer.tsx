import { useSchoolConfig } from '@/hooks/useSchoolConfig';

const Footer = () => {
  const { config, loading } = useSchoolConfig();

  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>{loading ? '...' : config.nombre_escuela}</p>
        <p>Contacto: <a href={`mailto:${config.email_contacto}`} className="hover:underline">{config.email_contacto}</a></p>
        <p>{config.texto_copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
