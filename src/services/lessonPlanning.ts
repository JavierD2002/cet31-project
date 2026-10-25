import { supabase } from '@/integrations/supabase/client';

export interface LessonPlan { contenido: string; actividad: string; recursos: string; evaluacion: string }
export async function generateLessonPlan(input: { asignatura_id: number; curso: string; tema: string }, signal: AbortSignal): Promise<LessonPlan> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error('Inicia sesión para generar una planificación.');
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson-plan`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${data.session.access_token}` },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || 'No se pudo generar la planificación.');
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No se recibió la planificación.');
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === 'error') throw new Error(event.error);
        if (event.type === 'complete') return event.plan;
      }
      if (chunk.done) break;
    }
    throw new Error('La generación terminó sin una planificación completa.');
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}