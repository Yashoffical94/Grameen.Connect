import { supabase } from '../lib/supabase';

const unwrap = (data, error) => {
  if (error) throw error;
  return { data: { data } };
};

const list = (table, query = {}) => {
  let request = supabase.from(table).select(query.select || '*');
  if (query.filters) Object.entries(query.filters).forEach(([key, value]) => { request = request.eq(key, value); });
  if (query.order) request = request.order(query.order.column, { ascending: query.order.ascending ?? false });
  if (query.limit) request = request.limit(query.limit);
  return request.then(({ data, error }) => unwrap(data, error));
};

export const authAPI = {
  register: async ({ email, password, fullName = '', role = 'labour', ...metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, role, ...metadata },
      },
    });
    if (error) throw error;
    return { data: { user: data.user, session: data.session } };
  },
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data: { user: data.user, session: data.session } };
  },
  logout: async () => unwrap(null, (await supabase.auth.signOut()).error),
  getMe: async () => { const { data, error } = await supabase.auth.getUser(); return unwrap(data.user, error); },
};

export const usersAPI = {
  getWorkers: (params = {}) => list('profiles', { filters: { role: 'labour', ...(params.location ? { location: params.location } : {}) }, order: { column: 'rating' } }),
  getUserProfile: async (id) => { const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single(); return unwrap(data, error); },
  getMyProfile: async () => { const { data: { user }, error: authError } = await supabase.auth.getUser(); if (authError) throw authError; const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single(); return unwrap(data, error); },
  updateProfile: async (profile) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('profiles').update({ ...profile, updated_at: new Date().toISOString() }).eq('id', user.id).select().single(); return unwrap(data, error); },
};

export const jobsAPI = {
  getJobs: (params = {}) => list('jobs', { filters: { status: params.status || 'open', ...(params.category ? { category: params.category } : {}), ...(params.location ? { location: params.location } : {}) }, order: { column: 'created_at' } }),
  getJob: async (id) => { const { data, error } = await supabase.from('jobs').select('*, profiles:contractor_id(*)').eq('id', id).single(); return unwrap(data, error); },
  getMyJobs: async () => { const { data: { user } } = await supabase.auth.getUser(); return list('jobs', { filters: { contractor_id: user.id }, order: { column: 'created_at' } }); },
  createJob: async (job) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('jobs').insert({ ...job, contractor_id: user.id }).select().single(); return unwrap(data, error); },
  updateJob: async (id, job) => { const { data, error } = await supabase.from('jobs').update({ ...job, updated_at: new Date().toISOString() }).eq('id', id).select().single(); return unwrap(data, error); },
  updateJobStatus: (id, status) => jobsAPI.updateJob(id, { status }),
  deleteJob: async (id) => unwrap(null, (await supabase.from('jobs').delete().eq('id', id)).error),
};

export const applicationsAPI = {
  apply: async (application) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('applications').insert({ ...application, labour_id: user.id }).select().single(); return unwrap(data, error); },
  getMyApplications: async () => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('applications').select('*, jobs(*)').eq('labour_id', user.id).order('created_at', { ascending: false }); return unwrap(data, error); },
  getIncomingApplications: async () => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('applications').select('*, jobs!inner(*)').eq('jobs.contractor_id', user.id).order('created_at', { ascending: false }); return unwrap(data, error); },
  updateApplication: async (id, status) => { const { data, error } = await supabase.from('applications').update({ status }).eq('id', id).select().single(); return unwrap(data, error); },
  deleteApplication: async (id) => unwrap(null, (await supabase.from('applications').delete().eq('id', id)).error),
};

export const messagesAPI = {
  getMessages: async (userId) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`).order('created_at'); return unwrap(data, error); },
  sendMessage: async (receiverId, body) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('messages').insert({ sender_id: user.id, receiver_id: receiverId, body }).select().single(); return unwrap(data, error); },
};

export const reviewsAPI = {
  createReview: async (review) => { const { data: { user } } = await supabase.auth.getUser(); const { data, error } = await supabase.from('reviews').insert({ ...review, reviewer_id: user.id }).select().single(); return unwrap(data, error); },
  getUserReviews: (userId) => list('reviews', { filters: { reviewee_id: userId }, order: { column: 'created_at' } }),
};

export const notificationsAPI = {
  getNotifications: async () => { const { data: { user } } = await supabase.auth.getUser(); return list('notifications', { filters: { user_id: user.id }, order: { column: 'created_at' } }); },
  markNotificationRead: async (id) => unwrap(null, (await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)).error),
};

export default supabase;
