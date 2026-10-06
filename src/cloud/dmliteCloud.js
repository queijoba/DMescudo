import { createClient } from '@supabase/supabase-js';

const url = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
const key = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const requireClient = () => {
  if (!supabase) throw new Error('supabase_not_configured');
  return supabase;
};

export async function getSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session || null;
}

export async function signInWithGoogle() {
  const client = requireClient();
  const redirectTo = window.location.origin + window.location.pathname;
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signInWithOtp(email) {
  const client = requireClient();
  const redirectTo = window.location.origin + window.location.pathname;
  const { data, error } = await client.auth.signInWithOtp({
    email: String(email || '').trim().toLowerCase(),
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data?.subscription?.unsubscribe?.();
}

export async function getProfile() {
  const client = requireClient();
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;

  return data || {
    id: user.id,
    email: user.email || '',
    display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Mestre',
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
  };
}

export async function listGroups() {
  const client = requireClient();
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user) return [];

  const { data: groups, error } = await client
    .from('groups')
    .select('id,name,owner_id,invite_code,created_at,updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const ids = (groups || []).map(group => group.id);
  if (!ids.length) return [];

  let members = [];
  try {
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.access_token) throw new Error('not_authenticated');

    const { data: result, error: profileError } = await client.functions.invoke('pjlite-group-profiles', {
      body: { groupIds: ids },
      headers: { Authorization: 'Bearer ' + session.access_token },
    });
    if (profileError) throw profileError;
    if (result?.error) throw new Error(String(result.error));
    members = Array.isArray(result?.members) ? result.members : [];
  } catch (profileError) {
    console.warn('DM Lite: perfis do grupo indisponíveis, usando lista básica', profileError);
    const { data: basicMembers, error: membersError } = await client
      .from('group_members')
      .select('group_id,user_id,role,joined_at')
      .in('group_id', ids);
    if (membersError) throw membersError;
    members = (basicMembers || []).map(member => ({
      groupId: member.group_id,
      userId: member.user_id,
      role: member.role || 'member',
      joinedAt: member.joined_at || null,
      name: member.user_id === user.id ? 'Você' : 'Jogador',
      avatar: '',
      achievementTags: [],
    }));
  }

  return (groups || []).map(group => ({
    ...group,
    isOwner: group.owner_id === user.id,
    members: members
      .filter(member => (member.groupId || member.group_id) === group.id)
      .map(member => ({
        ...member,
        groupId: member.groupId || member.group_id,
        userId: member.userId || member.user_id,
        joinedAt: member.joinedAt || member.joined_at || null,
      })),
  }));
}

export async function listInbox() {
  const client = requireClient();
  const { data, error } = await client
    .from('sheet_shares')
    .select('id,sender_id,group_id,source_local_id,sheet_type,system,name,payload,status,sent_at,acted_at')
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markShareImported(shareId) {
  const client = requireClient();
  const { error } = await client
    .from('sheet_shares')
    .update({ status: 'imported', acted_at: new Date().toISOString() })
    .eq('id', shareId);
  if (error) throw error;
}

export async function dismissShare(shareId) {
  const client = requireClient();
  const { error } = await client
    .from('sheet_shares')
    .update({ status: 'dismissed', acted_at: new Date().toISOString() })
    .eq('id', shareId);
  if (error) throw error;
}
