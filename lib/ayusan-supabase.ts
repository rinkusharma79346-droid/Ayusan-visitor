"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let singleton: SupabaseClient | null = null;

/** Only the publishable key is allowed in browser-side code. */
export function getOwnerSupabase(config: {supabaseUrl?: string;supabaseKey?: string}): SupabaseClient | null {
  const url = config.supabaseUrl;
  const key = config.supabaseKey;
  if (!url || !key) return null;
  if (!singleton) {
    singleton = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return singleton;
}

export type VisitSlot = {
  id: string;
  visit_date: string;
  label: string;
  start_time: string;
  end_time: string;
  capacity?: number;
  slot_type: "day" | "night" | "both";
  available_seats: number;
};

export type RegistrationRecord = {
  id: string;
  reference_code: string;
  full_name: string | null;
  phone_e164: string | null;
  date_of_birth: string | null;
  extras: string | null;
  whatsapp_opt_in: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  slot_id: string;
  visit_slots: VisitSlot | null;
};

export type WhatsAppRecord = {
  request_id: string;
  status: string;
  attempts: number;
  updated_at: string;
};

export type StaffProfile = {
  user_id: string;
  role: "owner" | "staff";
  can_approve: boolean;
  active: boolean;
};
