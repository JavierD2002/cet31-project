# Architecture rules
- Use the generated Supabase client everywhere so all requests share the validated Cloud session.
- Resolve identity through Cloud Auth and authorization through protected user_roles; usuarios.rol is legacy display data, never an authorization source.
- Link profiles to existing school usuarios only through administrator-controlled account assignments, never by matching a self-reported email.
- Enforce school responsibilities in database RLS using security-definer helpers with a fixed search_path; route restrictions are secondary UI safeguards.
- Generate lesson plans only through an authenticated Cloud function that checks active school roles and subject assignments; keep AI prompts and credentials server-side and review drafts in the existing topic form before saving.