import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, History, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportButtons from '@/components/ExportButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Row = {
  id: number; created_at: string; email: string | null; usuario_nombre: string | null; rol: string | null;
  accion: string; modulo: string; registro_id: string | null; detalle: Record<string, any> | null;
};

const ACCIONES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  inicio_sesion: { label: 'Inicio de sesión', variant: 'outline' },
  alta: { label: 'Alta', variant: 'default' },
  modificacion: { label: 'Modificación', variant: 'secondary' },
  baja: { label: 'Baja', variant: 'destructive' },
};

const fmt = (v: any) => (v === null || v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v));
const describe = (r: Row) => {
  if (r.accion === 'inicio_sesion' || !r.detalle) return '';
  if (r.accion === 'modificacion')
    return Object.entries(r.detalle).map(([k, v]: any) => `${k}: ${fmt(v?.antes)} → ${fmt(v?.despues)}`).join('; ');
  const d = r.detalle;
  return [d.nombre, d.apellido, d.tema, d.titulo, d.item, d.curso].filter(Boolean).join(' · ') || `Registro #${r.registro_id ?? ''}`;
};
const when = (s: string) => new Date(s).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'medium' });

const Auditoria = () => {
  const [search, setSearch] = useState('');
  const [accion, setAccion] = useState('todas');
  const [modulo, setModulo] = useState('todos');

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ['registro_actividad'],
    queryFn: async () => {
      const { data, error } = await supabase.from('registro_actividad').select('*')
        .order('created_at', { ascending: false }).limit(1000);
      if (error) throw error;
      return data as Row[];
    },
  });

  const modulos = useMemo(() => Array.from(new Set(rows.map((r) => r.modulo))).sort(), [rows]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      (accion === 'todas' || r.accion === accion) &&
      (modulo === 'todos' || r.modulo === modulo) &&
      (!q || `${r.usuario_nombre ?? ''} ${r.email ?? ''} ${describe(r)}`.toLowerCase().includes(q)));
  }, [rows, search, accion, modulo]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-4">
        <Button variant="outline" asChild><Link to="/"><ChevronLeft className="h-4 w-4 mr-1" />Volver al Inicio</Link></Button>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Registro de Actividad</CardTitle>
              <CardDescription>Inicios de sesión y cambios realizados en cada módulo (últimos 1000 movimientos).</CardDescription>
            </div>
            <ExportButtons title="Registro de Actividad" filename="registro_actividad" data={filtered} columns={[
              { header: 'Fecha y hora', accessor: (r: Row) => when(r.created_at) },
              { header: 'Usuario', accessor: (r: Row) => r.usuario_nombre || r.email || 'Sistema' },
              { header: 'Rol', accessor: (r: Row) => r.rol || '' },
              { header: 'Acción', accessor: (r: Row) => ACCIONES[r.accion]?.label || r.accion },
              { header: 'Módulo', accessor: 'modulo' },
              { header: 'Detalle', accessor: (r: Row) => describe(r) },
            ]} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Buscar por usuario o detalle..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={accion} onValueChange={setAccion}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las acciones</SelectItem>
                  {Object.entries(ACCIONES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={modulo} onValueChange={setModulo}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los módulos</SelectItem>
                  {modulos.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {error ? <p className="text-destructive">No se pudo cargar el registro.</p> : isLoading ? <p className="text-muted-foreground">Cargando...</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Fecha y hora</TableHead><TableHead>Usuario</TableHead><TableHead>Acción</TableHead>
                    <TableHead>Módulo</TableHead><TableHead>Qué se modificó</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin movimientos registrados</TableCell></TableRow>
                    ) : filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="whitespace-nowrap">{when(r.created_at)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{r.usuario_nombre || r.email || 'Sistema'}</div>
                          <div className="text-xs text-muted-foreground">{[r.rol, r.email].filter(Boolean).join(' · ')}</div>
                        </TableCell>
                        <TableCell><Badge variant={ACCIONES[r.accion]?.variant || 'outline'}>{ACCIONES[r.accion]?.label || r.accion}</Badge></TableCell>
                        <TableCell>{r.modulo}</TableCell>
                        <TableCell className="text-sm max-w-md break-words">{describe(r)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auditoria;
