import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus, Edit, Trash2, Search, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportButtons from '@/components/ExportButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type Estado = 'bueno' | 'regular' | 'dar_baja';
interface PanolItem {
  id: number;
  item: string;
  nombre: string;
  detalle: string | null;
  espacio_taller: string;
  unidad_medida: string;
  cantidad: number;
  estado: Estado;
}

const ESTADOS: Record<Estado, { label: string; cls: string }> = {
  bueno: { label: 'Bueno', cls: 'bg-green-100 text-green-800' },
  regular: { label: 'Regular', cls: 'bg-yellow-100 text-yellow-800' },
  dar_baja: { label: 'Dar baja', cls: 'bg-red-100 text-red-800' },
};
const UNIDADES: Record<string, string> = { metro: 'Metro', litro: 'Litro', kilogramo: 'Kilogramo', unidad: 'Unidad' };

const empty = { item: '', nombre: '', detalle: '', espacio_taller: '', unidad_medida: 'metro', cantidad: '0', estado: 'bueno' as Estado };

const Panol = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { hasRole } = useAuth();
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);

  const homePath = hasRole('panolero') ? '/panol' : '/';

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['panol_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('panol_items').select('*').order('item');
      if (error) throw error;
      return data as PanolItem[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        item: form.item.trim(),
        nombre: form.nombre.trim(),
        detalle: form.detalle.trim() || null,
        espacio_taller: form.espacio_taller.trim(),
        unidad_medida: form.unidad_medida,
        cantidad: Number(form.cantidad) || 0,
        estado: form.estado,
        updated_at: new Date().toISOString(),
      };
      const { error } = editId
        ? await supabase.from('panol_items').update(payload).eq('id', editId)
        : await supabase.from('panol_items').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['panol_items'] });
      toast({ title: editId ? 'Registro actualizado' : 'Registro agregado' });
      setOpen(false);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('panol_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['panol_items'] });
      toast({ title: 'Registro eliminado' });
    },
  });

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter(i =>
      (estadoFiltro === 'todos' || i.estado === estadoFiltro) &&
      [i.item, i.nombre, i.detalle ?? '', i.espacio_taller].some(v => v.toLowerCase().includes(s))
    );
  }, [items, search, estadoFiltro]);

  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (i: PanolItem) => {
    setEditId(i.id);
    setForm({ item: i.item, nombre: i.nombre, detalle: i.detalle ?? '', espacio_taller: i.espacio_taller, unidad_medida: i.unidad_medida, cantidad: String(i.cantidad), estado: i.estado });
    setOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link to={homePath}>
              <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4 mr-1" />Volver al Inicio</Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6" />Pañol</h1>
          </div>
          <div className="flex gap-2">
            <ExportButtons
              title="Inventario del Pañol"
              filename="inventario_panol"
              data={filtered}
              columns={[
                { header: 'Item', accessor: 'item' },
                { header: 'Nombre', accessor: 'nombre' },
                { header: 'Detalle', accessor: (r: PanolItem) => r.detalle ?? '' },
                { header: 'Taller', accessor: 'espacio_taller' },
                { header: 'Unidad', accessor: (r: PanolItem) => UNIDADES[r.unidad_medida] ?? r.unidad_medida },
                { header: 'Cantidad', accessor: (r: PanolItem) => String(r.cantidad) },
                { header: 'Estado', accessor: (r: PanolItem) => ESTADOS[r.estado]?.label ?? r.estado },
              ]}
            />
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Nuevo registro</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventario de herramientas e insumos</CardTitle>
            <CardDescription>Material utilizado en cada espacio de taller</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="dar_baja">Dar baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Taller</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-6">Cargando...</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-6">Sin registros</TableCell></TableRow>
                  ) : filtered.map(i => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.item}</TableCell>
                      <TableCell>{i.nombre}</TableCell>
                      <TableCell className="max-w-xs truncate">{i.detalle}</TableCell>
                      <TableCell>{i.espacio_taller}</TableCell>
                      <TableCell>{UNIDADES[i.unidad_medida] ?? i.unidad_medida}</TableCell>
                      <TableCell className="text-right">{i.cantidad}</TableCell>
                      <TableCell><Badge className={ESTADOS[i.estado]?.cls} variant="outline">{ESTADOS[i.estado]?.label}</Badge></TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(i)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => { if (confirm(`¿Eliminar "${i.nombre}"?`)) remove.mutate(i.id); }}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Editar registro' : 'Nuevo registro'}</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Item</Label><Input required value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} placeholder="HER-001" /></div>
              <div><Label>Espacio de taller</Label><Input value={form.espacio_taller} onChange={e => setForm({ ...form, espacio_taller: e.target.value })} placeholder="Electricidad" /></div>
            </div>
            <div><Label>Nombre o denominación</Label><Input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
            <div><Label>Detalle</Label><Textarea value={form.detalle} onChange={e => setForm({ ...form, detalle: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Unidad de medida</Label>
                <Select value={form.unidad_medida} onValueChange={v => setForm({ ...form, unidad_medida: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIDADES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Cantidad</Label><Input type="number" min="0" step="0.01" required value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} /></div>
              <div>
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={v => setForm({ ...form, estado: v as Estado })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bueno">Bueno</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="dar_baja">Dar baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Panol;
