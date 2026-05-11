'use client';

import { supabase } from '@/lib/supabase';

/**
 * PropIntel Data Service
 * Unified interface for data operations with Supabase + LocalStorage fallback.
 * When Supabase is available, it's the single source of truth.
 * Otherwise, localStorage keeps the app functional.
 */

const STORAGE_KEYS = {
  PROPERTIES: 'propintel_properties',
  BUYERS: 'propintel_buyers',
  VISITS: 'propintel_visits',
  SAVED: 'propintel_saved',
  NOTIFICATIONS: 'propintel_notifications'
};

const isSupabaseReady = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && 
         !url.includes('placeholder') && 
         !key.includes('placeholder') &&
         !url.includes('your-project-id') &&
         !key.includes('your-anon-public-key');
};

const getLocal = (key: string): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveLocal = (key: string, data: any): any => {
  if (typeof window === 'undefined') return data;
  try {
    const existing = getLocal(key);
    const newItem = { ...data, id: Date.now(), created_at: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify([newItem, ...existing]));
    return newItem;
  } catch { return data; }
};

export const dataService = {
  // ─── PROPERTIES ───────────────────────────────────────────────────────────

  async saveProperty(property: any) {
    // ALWAYS save locally first for instant UI updates
    const localSaved = saveLocal(STORAGE_KEYS.PROPERTIES, property);

    if (isSupabaseReady()) {
      try {
        const { error } = await supabase
          .from('properties')
          .insert([{ ...property, id: localSaved.id, created_at: localSaved.created_at }]);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase write failed:', err);
      }
    }
    return localSaved;
  },

  async getProperties(filters?: { area?: string; maxBudget?: number; type?: string }): Promise<any[]> {
    let properties: any[] = [];
    let localProps = getLocal(STORAGE_KEYS.PROPERTIES);

    if (isSupabaseReady()) {
      try {
        let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
        if (filters?.area) query = query.ilike('location', `%${filters.area}%`);
        if (filters?.type) query = query.ilike('property_type', `%${filters.type}%`);
        const { data, error } = await query;
        if (!error && data) {
          properties = [...data];
        }
      } catch { /* fall through */ }
    }

    // Merge local properties that don't exist in Supabase (based on ID)
    const existingIds = new Set(properties.map(p => p.id));
    const newLocal = localProps.filter(p => !existingIds.has(p.id));
    properties = [...newLocal, ...properties];

    // Client-side budget filter (works for both Supabase and local)
    if (filters?.maxBudget && filters.maxBudget > 0) {
      properties = properties.filter(p => {
        const priceNum = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
        return priceNum <= filters.maxBudget!;
      });
    }
    if (filters?.area && !isSupabaseReady()) {
      properties = properties.filter(p =>
        p.location?.toLowerCase().includes(filters.area!.toLowerCase())
      );
    }
    if (filters?.type && !isSupabaseReady()) {
      properties = properties.filter(p =>
        p.property_type?.toLowerCase().includes(filters.type!.toLowerCase()) ||
        p.title?.toLowerCase().includes(filters.type!.toLowerCase())
      );
    }

    return properties;
  },

  // ─── BUYER PROFILES ────────────────────────────────────────────────────────

  async saveBuyerProfile(profile: any) {
    const localSaved = saveLocal(STORAGE_KEYS.BUYERS, profile);

    if (isSupabaseReady()) {
      try {
        const { error } = await supabase
          .from('buyer_profiles')
          .insert([{ ...profile, id: localSaved.id, created_at: localSaved.created_at }]);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase write failed:', err);
      }
    }
    return localSaved;
  },

  async getBuyerLeads(): Promise<any[]> {
    let leads: any[] = [];
    let localLeads = getLocal(STORAGE_KEYS.BUYERS);

    if (isSupabaseReady()) {
      try {
        const { data, error } = await supabase
          .from('buyer_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) leads = [...data];
      } catch { /* fall through */ }
    }
    
    const existingIds = new Set(leads.map(l => l.id));
    const newLocal = localLeads.filter(l => !existingIds.has(l.id));
    return [...newLocal, ...leads];
  },

  // ─── VISITS ────────────────────────────────────────────────────────
  
  async saveVisit(visit: any) {
    const localSaved = saveLocal(STORAGE_KEYS.VISITS, { ...visit, status: 'pending' });
    if (isSupabaseReady()) {
      try {
        await supabase.from('visits').insert([{ ...visit, id: localSaved.id, status: 'pending', created_at: localSaved.created_at }]);
      } catch (err) {
        console.warn('Supabase write failed:', err);
      }
    }
    return localSaved;
  },

  async getVisits(): Promise<any[]> {
    let visits: any[] = [];
    let localVisits = getLocal(STORAGE_KEYS.VISITS);

    if (isSupabaseReady()) {
      try {
        const { data, error } = await supabase.from('visits').select('*').order('created_at', { ascending: false });
        if (!error && data) visits = [...data];
      } catch { /* fall through */ }
    }
    
    const existingIds = new Set(visits.map(v => v.id));
    const newLocal = localVisits.filter(v => !existingIds.has(v.id));
    return [...newLocal, ...visits];
  },

  async updateVisitStatus(id: number, status: string, time?: string) {
    let localVisits = getLocal(STORAGE_KEYS.VISITS);
    const updatedVisits = localVisits.map(v => v.id === id ? { ...v, status, ...(time && { time }) } : v);
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(updatedVisits));

    if (isSupabaseReady()) {
      try {
        const updateData: any = { status };
        if (time) updateData.time = time;
        await supabase.from('visits').update(updateData).eq('id', id);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }
  },

  // ─── SAVED PROPERTIES ──────────────────────────────────────────────────
  
  async toggleSavedProperty(property: any) {
    let saved = getLocal(STORAGE_KEYS.SAVED);
    const exists = saved.find(p => p.id === property.id);
    if (exists) {
      saved = saved.filter(p => p.id !== property.id);
    } else {
      saved = [property, ...saved];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(saved));
    // NOTE: In a real app with auth, we would sync this to a 'saved_properties' table in Supabase.
  },

  async getSavedProperties(): Promise<any[]> {
    return getLocal(STORAGE_KEYS.SAVED);
  },

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────

  async getNotifications(): Promise<any[]> {
    return getLocal(STORAGE_KEYS.NOTIFICATIONS);
  },

  async saveNotification(notification: any) {
    return saveLocal(STORAGE_KEYS.NOTIFICATIONS, notification);
  }
};
