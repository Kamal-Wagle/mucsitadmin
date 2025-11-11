const API_BASE_URL = "https://mucsitbackend.onrender.com/api"

export interface ApiResponse<T> {
  data: T
  count?: number
  error?: string
}

function getToken(): string | null {
  return localStorage.getItem("token")
}

async function apiCall<T>(endpoint: string, method = "GET", body?: any, requiresAuth = true): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (requiresAuth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }

  return response.json()
}

export const apiService = {
  // Generic CRUD operations
  getAll: async <T,>(resource: string) => {
    const data = await apiCall<any>(`/${resource}`, "GET", undefined, false)
    return Array.isArray(data) ? data : data[resource] || data.data ||data.oldQuestions || []
  },
  // Paginated listing that returns the raw response (including count/total/page/totalPages)
  getPaginated: async <T,>(resource: string, params?: Record<string, any>, requiresAuth = false) => {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
        ).toString()
      : ""
    const endpoint = queryString ? `/${resource}?${queryString}` : `/${resource}`
    return apiCall<any>(endpoint, "GET", undefined, requiresAuth)
  },

  getById: async <T,>(resource: string, id: string) => {
    return apiCall<T>(`/${resource}/${id}`, "GET")
  },

  // Paginated search that returns the full payload (count/total/page/totalPages and results)
  searchPaginated: async <T,>(resource: string, params: Record<string, any>, requiresAuth = false) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString()
    const endpoint = `/${resource}/search?${queryString}`
    return apiCall<any>(endpoint, "GET", undefined, requiresAuth)
  },

  search: async <T,>(resource: string, params: Record<string, any>) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString()
    const data = await apiCall<any>(`/${resource}/search?${queryString}`, "GET", undefined, false)
    return Array.isArray(data) ? data : data[resource] || data.data || []
  },

  create: async <T,>(resource: string, body: any) => {
    return apiCall<T>(`/${resource}`, "POST", body)
  },

  update: async <T,>(resource: string, id: string, body: any) => {
    return apiCall<T>(`/${resource}/${id}`, "PUT", body)
  },

  delete: async (resource: string, id: string) => {
    return apiCall<void>(`/${resource}/${id}`, "DELETE")
  },
}
