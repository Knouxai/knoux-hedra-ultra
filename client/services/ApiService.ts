// API service for handling fetch requests with proper base URL
class ApiService {
  private baseUrl: string;

  constructor() {
    // Use the current origin for the base URL
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  }

  private getFullUrl(endpoint: string): string {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  async get(endpoint: string, options: RequestInit = {}): Promise<Response> {
    try {
      return await fetch(this.getFullUrl(endpoint), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  }

  async post(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
  ): Promise<Response> {
    try {
      return await fetch(this.getFullUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  }

  async put(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
  ): Promise<Response> {
    try {
      return await fetch(this.getFullUrl(endpoint), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
    } catch (error) {
      console.error(`API PUT error for ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint: string, options: RequestInit = {}): Promise<Response> {
    try {
      return await fetch(this.getFullUrl(endpoint), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
    } catch (error) {
      console.error(`API DELETE error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Helper method for JSON responses
  async getJson<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await this.get(endpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Helper method for POST with JSON response
  async postJson<T = any>(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await this.post(endpoint, data, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
