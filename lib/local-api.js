// ServiceGenie API Client - Local Setup
// This replaces the Supabase client with our local API

const API_BASE_URL = 'http://localhost:3001';

// Local API client to replace Supabase
export const localApiClient = {
  // Helper function to make requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  },

  // Customer methods
  async getCustomers() {
    return this.request('/api/customers');
  },

  async addCustomer(customer) {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customer)
    });
  },

  // Provider methods
  async getProviders() {
    return this.request('/api/providers');
  },

  async getProviderWithStats(providerId) {
    const providers = await this.getProviders();
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return null;

    // Add basic stats (this would be expanded in a real implementation)
    return {
      ...provider,
      services: await this.getServices(),
      appointments: [] // Would be populated with actual count
    };
  },

  // Service methods
  async getServices() {
    return this.request('/api/services');
  },

  async getServicesByCategory() {
    const services = await this.getServices();
    const categories = {};
    services.forEach(service => {
      if (!categories[service.category]) {
        categories[service.category] = [];
      }
      categories[service.category].push(service);
    });
    return categories;
  },

  // Appointment methods
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.date) params.append('date', filters.date);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/appointments?${queryString}` : '/api/appointments';
    
    return this.request(endpoint);
  },

  async createAppointment(appointment) {
    return this.request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment)
    });
  },

  async cancelAppointment(id) {
    return this.request(`/api/appointments/${id}`, {
      method: 'DELETE'
    });
  },

  // Blocked times methods
  async getBlockedTimes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.date) params.append('date', filters.date);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/blocked-times?${queryString}` : '/api/blocked-times';
    
    return this.request(endpoint);
  },

  async createBlockedTime(blockedTime) {
    return this.request('/api/blocked-times', {
      method: 'POST',
      body: JSON.stringify(blockedTime)
    });
  },

  async deleteBlockedTime(id) {
    return this.request(`/api/blocked-times/${id}`, {
      method: 'DELETE'
    });
  },

  // Health check
  async health() {
    return this.request('/health');
  }
};

// Compatibility layer for existing Supabase code
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => ({
        single: () => localApiClient.request(`/api/${table}?${column}=${value}`),
        then: (resolve) => {
          localApiClient.request(`/api/${table}`).then(data => {
            const filteredData = data.filter(item => item[column] === value);
            resolve({ data: filteredData, error: null });
          }).catch(error => {
            resolve({ data: null, error });
          });
        }
      }),
      order: (column, options = {}) => ({
        limit: (count) => ({
          then: (resolve) => {
            localApiClient.request(`/api/${table}`).then(data => {
              const sortedData = data.sort((a, b) => {
                if (options.ascending === false) {
                  return b[column] > a[column] ? 1 : -1;
                }
                return a[column] > b[column] ? 1 : -1;
              });
              resolve({ data: sortedData.slice(0, count), error: null });
            }).catch(error => {
              resolve({ data: null, error });
            });
          }
        }),
        then: (resolve) => {
          localApiClient.request(`/api/${table}`).then(data => {
            resolve({ data, error: null });
          }).catch(error => {
            resolve({ data: null, error });
          });
        }
      }),
      then: (resolve) => {
        const methodName = `get${table.charAt(0).toUpperCase() + table.slice(1)}`;
        const method = localApiClient[methodName] || localApiClient.request.bind(null, `/api/${table}`);
        method().then(data => {
          resolve({ data, error: null });
        }).catch(error => {
          resolve({ data: null, error });
        });
      }
    }),
    insert: (records) => ({
      select: () => ({
        single: () => {
          const isArray = Array.isArray(records);
          const record = isArray ? records[0] : records;
          const methodName = `add${table.charAt(0).toUpperCase() + table.slice(1).slice(0, -1)}`; // Remove 's' if plural
          const method = localApiClient[methodName] || localApiClient.request.bind(null, `/api/${table}`, {
            method: 'POST',
            body: JSON.stringify(record)
          });
          return method().then(data => ({ data, error: null })).catch(error => ({ data: null, error }));
        }
      })
    }),
    delete: () => ({
      eq: (column, value) => ({
        then: (resolve) => {
          localApiClient.request(`/api/${table}/${value}`, { method: 'DELETE' })
            .then(() => resolve({ data: null, error: null }))
            .catch(error => resolve({ data: null, error }));
        }
      })
    })
  })
};

// Export the local API client as default
export default localApiClient;