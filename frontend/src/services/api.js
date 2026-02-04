const API_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// ==================== BLOG API ====================

export const blogApi = {
  getPosts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const query = queryParams.toString();
    return apiCall(`/blog/posts${query ? `?${query}` : ''}`);
  },
  
  getPost: async (id) => {
    return apiCall(`/blog/posts/${id}`);
  },
  
  getPostBySlug: async (slug) => {
    return apiCall(`/blog/posts/slug/${slug}`);
  },
  
  createPost: async (postData) => {
    return apiCall('/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  updatePost: async (id, postData) => {
    return apiCall(`/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },
  
  deletePost: async (id) => {
    return apiCall(`/blog/posts/${id}`, {
      method: 'DELETE',
    });
  },
  
  getCategories: async () => {
    return apiCall('/blog/categories');
  },
};

// ==================== CONTACT API ====================

export const contactApi = {
  submitMessage: async (messageData) => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  getMessages: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.read !== undefined) queryParams.append('read', params.read);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const query = queryParams.toString();
    return apiCall(`/contact/messages${query ? `?${query}` : ''}`);
  },
  
  markRead: async (id, read = true) => {
    return apiCall(`/contact/messages/${id}/read?read=${read}`, {
      method: 'PUT',
    });
  },
};

// ==================== AUTH API ====================

export const authApi = {
  login: async (username, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// ==================== NEWSLETTER API ====================

export const newsletterApi = {
  subscribe: async (email) => {
    return apiCall('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  unsubscribe: async (email) => {
    return apiCall('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  getSubscribers: async (activeOnly = true) => {
    return apiCall(`/newsletter/subscribers?active_only=${activeOnly}`);
  },
};

// ==================== CMS CONTENT API ====================

export const cmsApi = {
  // Generic key-based content (existing)
  getContent: async (contentType = null) => {
    const query = contentType ? `?content_type=${contentType}` : '';
    return apiCall(`/cms/content${query}`);
  },
  
  getContentByKey: async (key) => {
    return apiCall(`/cms/content/${key}`);
  },
  
  createContent: async (contentData) => {
    return apiCall('/cms/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  },
  
  updateContent: async (key, contentData) => {
    return apiCall(`/cms/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },
  
  deleteContent: async (key) => {
    return apiCall(`/cms/content/${key}`, {
      method: 'DELETE',
    });
  },

  // Page APIs
  getPages: async (publishedOnly = true) => {
    return apiCall(`/pages?published_only=${publishedOnly}`);
  },

  getPageBySlug: async (slug) => {
    return apiCall(`/pages/slug/${slug}`);
  },

  getPageById: async (id) => {
    return apiCall(`/pages/${id}`);
  },

  createPage: async (pageData) => {
    return apiCall('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  },

  updatePage: async (id, pageData) => {
    return apiCall(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  },

  deletePage: async (id) => {
    return apiCall(`/pages/${id}`, {
      method: 'DELETE',
    });
  },

  // Menu APIs
  getMenus: async () => {
    return apiCall('/menus');
  },

  getMenuByName: async (name) => {
    return apiCall(`/menus/${name}`);
  },

  createMenu: async (menuData) => {
    return apiCall('/menus', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  },

  updateMenu: async (name, menuData) => {
    return apiCall(`/menus/${name}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  },

  deleteMenu: async (name) => {
    return apiCall(`/menus/${name}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TESTIMONIALS API ====================

export const testimonialsApi = {
  getAll: async (activeOnly = true) => {
    return apiCall(`/testimonials?active_only=${activeOnly}`);
  },
  
  create: async (testimonialData) => {
    return apiCall('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },
  
  update: async (id, testimonialData) => {
    return apiCall(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== FAQ API ====================

export const faqApi = {
  getAll: async (category = null, activeOnly = true) => {
    const queryParams = new URLSearchParams();
    queryParams.append('active_only', activeOnly);
    if (category) queryParams.append('category', category);
    
    return apiCall(`/faqs?${queryParams.toString()}`);
  },
  
  create: async (faqData) => {
    return apiCall('/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData),
    });
  },
  
  update: async (id, faqData) => {
    return apiCall(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/faqs/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthApi = {
  check: async () => {
    return apiCall('/health');
  },
};

export default {
  auth: authApi,
  blog: blogApi,
  contact: contactApi,
  newsletter: newsletterApi,
  cms: cmsApi,
  testimonials: testimonialsApi,
  faq: faqApi,
  health: healthApi,
};
