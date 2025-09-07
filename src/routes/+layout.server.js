export const load = async ({ locals: { safeGetSession, supabase }, cookies }) => {
    const { session } = await safeGetSession()
    const { data: { user } } = await supabase.auth.getUser();


    return {
        session,
        user,
        cookies: cookies.getAll(),
    }
}