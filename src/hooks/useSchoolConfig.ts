import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SchoolConfig = {
  nombre_escuela: string;
  email_contacto: string;
  texto_copyright: string;
};

const defaultConfig: SchoolConfig = {
  nombre_escuela: 'Escuela Técnica de Villa Manzano - Río Negro - Argentina',
  email_contacto: 'cet31vmanzano23@gmail.com',
  texto_copyright: '© 2025 Sistema de Gestión Escolar',
};

export const useSchoolConfig = () => {
  const [config, setConfig] = useState<SchoolConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('configuracion_escuela')
        .select('nombre_escuela, email_contacto, texto_copyright')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setConfig(data);
      }
    } catch (e) {
      console.error('Error fetching school config:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: SchoolConfig) => {
    const { error } = await (supabase as any)
      .from('configuracion_escuela')
      .update({
        ...newConfig,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) throw error;
    setConfig(newConfig);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading, updateConfig, refetch: fetchConfig };
};
