// One-shot account provisioning: creates or updates an auth account for every
// active school assignment and sets the initial password. Protected by the
// PROVISION_KEY secret (header x-provision-key), not by user roles, because it
// is the bootstrap path used before any role exists.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-provision-key",
};

const DEFAULT_PASSWORD = "1234abcd";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Método no permitido" }, { status: 405, headers: corsHeaders });
  }

  const provisionKey = Deno.env.get("PROVISION_KEY");
  if (!provisionKey || req.headers.get("x-provision-key") !== provisionKey) {
    return Response.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: assignments, error: assignError } = await admin
    .from("account_assignments")
    .select("usuario_id, email, role")
    .eq("active", true);
  if (assignError) {
    return Response.json({ error: assignError.message }, { status: 500, headers: corsHeaders });
  }

  const { data: schoolUsers, error: usersError } = await admin
    .from("usuarios")
    .select("id, nombre, apellido");
  if (usersError) {
    return Response.json({ error: usersError.message }, { status: 500, headers: corsHeaders });
  }
  const schoolById = new Map((schoolUsers ?? []).map((u) => [u.id, u]));

  // Map existing auth accounts by email.
  const existingByEmail = new Map<string, string>();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
    for (const u of data.users) {
      if (u.email) existingByEmail.set(u.email.toLowerCase().trim(), u.id);
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  const results: Array<{ email: string; action: string; detail?: string }> = [];

  for (const assignment of assignments ?? []) {
    const email = assignment.email.toLowerCase().trim();
    const school = schoolById.get(assignment.usuario_id);
    let authId = existingByEmail.get(email);
    let action = "actualizado";

    try {
      if (authId) {
        const { error } = await admin.auth.admin.updateUserById(authId, {
          password: DEFAULT_PASSWORD,
          email_confirm: true,
        });
        if (error) throw error;
      } else {
        const { data, error } = await admin.auth.admin.createUser({
          email,
          password: DEFAULT_PASSWORD,
          email_confirm: true,
          user_metadata: { nombre: school?.nombre ?? "", apellido: school?.apellido ?? "" },
        });
        if (error) throw error;
        authId = data.user.id;
        action = "creado";
      }

      // Ensure profile and role linkage even when the auth trigger did not fire
      // (e.g. the account already existed before the assignment was created).
      const { error: profileError } = await admin.from("profiles").upsert({
        id: authId,
        usuario_id: assignment.usuario_id,
        nombre: school?.nombre ?? "",
        apellido: school?.apellido ?? "",
      });
      if (profileError) throw profileError;

      const { error: roleError } = await admin
        .from("user_roles")
        .upsert({ user_id: authId, role: assignment.role }, { onConflict: "user_id" });
      if (roleError) throw roleError;

      results.push({ email, action });
    } catch (e) {
      results.push({ email, action: "error", detail: e instanceof Error ? e.message : String(e) });
    }
  }

  return Response.json(
    { password: DEFAULT_PASSWORD, total: results.length, results },
    { headers: corsHeaders },
  );
});
