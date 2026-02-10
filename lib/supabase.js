// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase dashboard: https://supabase.com/dashboard
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for ServiceGenie
export const supabaseHelpers = {
  // Customers
  async getCustomers() {
    const { data, error } = await supabase.from('customers').select('*').order('name')
    return { data, error }
  },

  async addCustomer(customer) {
    const { data, error } = await supabase.from('customers').insert([customer]).select()
    return { data, error }
  },

  // Providers (Stylists)
  async getProviders() {
    const { data, error } = await supabase.from('providers').select('*').order('name')
    return { data, error }
  },

  async getProviderWithStats(providerId) {
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        services(*),
        appointments(count)
      `)
      .eq('id', providerId)
      .single()
    return { data, error }
  },

  // Services
  async getServices() {
    const { data, error } = await supabase.from('services').select('*').order('name')
    return { data, error }
  },

  async getServicesByCategory() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name')
    return { data, error }
  },

  // Appointments
  async getAppointments(filters = {}) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customer:customers(*),
        provider:providers(*),
        service:services(*)
      `)
      .order('start_time', { ascending: true })

    if (filters.providerId) query = query.eq('provider_id', filters.providerId)
    if (filters.customerId) query = query.eq('customer_id', filters.customerId)
    if (filters.date) query = query.eq('date', filters.date)
    if (filters.status) query = query.eq('status', filters.status)

    const { data, error } = await query
    return { data, error }
  },

  async createAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()
    return { data, error }
  },

  async updateAppointment(id, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async cancelAppointment(id) {
    return this.updateAppointment(id, { status: 'cancelled' })
  },

  // Blocked Times
  async getBlockedSlots() {
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .order('start_time')
    return { data, error }
  },

  async createBlockedTime(blockedTime) {
    const { data, error } = await supabase
      .from('blocked_times')
      .insert([blockedTime])
      .select()
      .single()
    return { data, error }
  },

  // Locations
  async getLocations() {
    const { data, error } = await supabase.from('locations').select('*').order('name')
    return { data, error }
  },

  // Real-time subscription helper
  subscribeToAppointments(callback) {
    return supabase
      .channel('appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, callback)
      .subscribe()
  }
}
