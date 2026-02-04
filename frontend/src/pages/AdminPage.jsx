import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Save, X, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { blogApi, contactApi, newsletterApi, testimonialsApi, cmsApi } from '../services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);

  const [menus, setMenus] = useState([]);
  const [activeMenuName, setActiveMenuName] = useState('header');
  const [editingMenu, setEditingMenu] = useState(null);

  const [editingPost, setEditingPost] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'blog') {
        const data = await blogApi.getPosts({ limit: 100 });
        setPosts(data);
      } else if (activeTab === 'messages') {
        const data = await contactApi.getMessages({ limit: 100 });
        setMessages(data);
      } else if (activeTab === 'newsletter') {
        const data = await newsletterApi.getSubscribers(false);
        setSubscribers(data.subscribers || []);
      } else if (activeTab === 'testimonials') {
        const data = await testimonialsApi.getAll(false);
        setTestimonials(data);
      } else if (activeTab === 'pages') {
        const data = await cmsApi.getPages(false);
        setPages(data);
      } else if (activeTab === 'menus') {
        const allMenus = await cmsApi.getMenus();
        setMenus(allMenus);
        const current = allMenus.find((m) => m.name === activeMenuName) || null;
        setEditingMenu(current);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeMenuName]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await blogApi.deletePost(id);
      toast.success('Deleted');
      loadData();
    } catch (e) {
      toast.error('Failed');
    }
  };

  const handleMarkRead = async (id, read) => {
    try {
      await contactApi.markRead(id, read);
      loadData();
    } catch (e) {
      toast.error('Failed');
    }
  };

  return (
    <div data-testid="admin-page" className="min-h-screen bg-gray-50">
      <div className="bg-[#0A1628] text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold font-heading">CMS Admin Panel</h1>
          <p className="text-gray-300 mt-2">Manage your website content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex flex-wrap gap-2">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Blog Posts ({posts.length})</h2>
                <Button onClick={() => setEditingPost({})} className="bg-[#00BFB3] hover:bg-[#00A399]">
                  <Plus className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{post.title?.en || 'Untitled'}</h3>
                        <p className="text-sm text-gray-500">{post.category} • {post.status}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {editingPost && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{editingPost.id ? 'Edit Post' : 'New Post'}</h2>
                    <Button size="sm" variant="ghost" onClick={() => setEditingPost(null)}><X className="h-4 w-4" /></Button>
                  </div>
                  <PostForm post={editingPost} onClose={() => { setEditingPost(null); loadData(); }} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pages">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Pages ({pages.length})</h2>
                <Button onClick={() => setEditingPage({})} className="bg-[#00BFB3] hover:bg-[#00A399]">
                  <Plus className="h-4 w-4 mr-2" /> New Page
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{page.title?.en || page.title?.hr || page.slug}</h3>
                        <p className="text-sm text-gray-500">/{page.slug} · {page.published ? 'Published' : 'Draft'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingPage(page)}><Edit2 className="h-4 w-4" /></Button>
                        {!page.is_system_page && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                            onClick={async () => {
                              if (!window.confirm('Delete this page?')) return;
                              try {
                                await cmsApi.deletePage(page.id);
                                toast.success('Deleted');
                                loadData();
                              } catch (e) {
                                toast.error('Failed to delete');
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {editingPage && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{editingPage.id ? 'Edit Page' : 'New Page'}</h2>
                    <Button size="sm" variant="ghost" onClick={() => setEditingPage(null)}><X className="h-4 w-4" /></Button>
                  </div>
                  <PageForm
                    page={editingPage}
                    onClose={() => {
                      setEditingPage(null);
                      loadData();
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="menus">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Menus</h2>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Menu:</Label>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={activeMenuName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setActiveMenuName(name);
                      const current = menus.find((m) => m.name === name) || null;
                      setEditingMenu(current);
                    }}
                  >
                    <option value="header">Header (desktop)</option>
                    <option value="mobile">Mobile</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div>
                  <MenuForm
                    menu={editingMenu || { name: activeMenuName, items: [] }}
                    onSave={async (name, payload) => {
                      try {
                        const exists = menus.some((m) => m.name === name);
                        if (exists) {
                          const updated = await cmsApi.updateMenu(name, payload);
                          setMenus((prev) => prev.map((m) => (m.name === name ? updated : m)));
                        } else {
                          const created = await cmsApi.createMenu({ name, items: payload.items });
                          setMenus((prev) => [...prev, created]);
                        }
                        toast.success('Menu saved');
                      } catch (e) {
                        toast.error('Failed to save menu');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Messages ({messages.length})</h2>
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-4 border rounded-lg ${msg.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{msg.subject}</h3>
                          <p className="text-sm text-gray-600">{msg.full_name} • {msg.email}</p>
                          <p className="text-sm mt-2">{msg.message}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleMarkRead(msg.id, !msg.read)}>
                          {msg.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="newsletter">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Subscribers ({subscribers.length})</h2>
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{sub.email}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${sub.active ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>
                        {sub.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Testimonials ({testimonials.length})</h2>
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-sm text-gray-500">{t.company} • {t.location}</p>
                      <p className="text-sm mt-2 italic">&ldquo;{t.text?.en}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const locales = ['en', 'hr', 'de'];

const PageForm = ({ page, onClose }) => {
  const [formData, setFormData] = useState({
    slug: '',
    title: { en: '', hr: '', de: '' },
    meta_description: { en: '', hr: '', de: '' },
    sections: [],
    published: true,
    ...page,
  });
  const [saving, setSaving] = useState(false);

  const handleChangeTitle = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      title: {
        ...(prev.title || {}),
        [lang]: value,
      },
    }));
  };

  const handleChangeMeta = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      meta_description: {
        ...(prev.meta_description || {}),
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        slug: formData.slug,
        title: formData.title,
        meta_description: formData.meta_description,
        sections: formData.sections || [],
        published: formData.published,
      };

      if (page.id) {
        await cmsApi.updatePage(page.id, payload);
      } else {
        await cmsApi.createPage(payload);
      }
      toast.success('Page saved');
      onClose();
    } catch (e) {
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!page.id && (
        <div>
          <Label>Slug</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {locales.map((lang) => (
          <div key={lang}>
            <Label>Title ({lang.toUpperCase()})</Label>
            <Input
              value={formData.title?.[lang] || ''}
              onChange={(e) => handleChangeTitle(lang, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {locales.map((lang) => (
          <div key={lang}>
            <Label>Meta description ({lang.toUpperCase()})</Label>
            <Textarea
              rows={2}
              value={formData.meta_description?.[lang] || ''}
              onChange={(e) => handleChangeMeta(lang, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="published"
          type="checkbox"
          checked={!!formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="published">Published</Label>
      </div>

      {/* Section editor: upravljanje sekcijama i sadržajem po jezicima */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Sections</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const nextOrder = (formData.sections?.length || 0);
              const newSection = {
                id: Math.random().toString(36).slice(2),
                section_type: 'content',
                order: nextOrder,
                visible: true,
                content: {
                  headline: { en: '', hr: '', de: '' },
                  body: { en: '', hr: '', de: '' },
                },
              };
              setFormData({ ...formData, sections: [...(formData.sections || []), newSection] });
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add section
          </Button>
        </div>

        {(formData.sections || []).length === 0 && (
          <p className="text-xs text-gray-500">No sections yet. Add your first section to start building page content.</p>
        )}

        <div className="space-y-4">
          {(formData.sections || []).map((section, index) => (
            <div key={section.id || index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <Label>Type</Label>
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={section.section_type || 'content'}
                      onChange={(e) => {
                        const sections = [...(formData.sections || [])];
                        sections[index] = { ...sections[index], section_type: e.target.value };
                        setFormData({ ...formData, sections });
                      }}
                    >
                      <option value="content">Content</option>
                      <option value="hero">Hero</option>
                      <option value="feature-blocks">Feature blocks</option>
                    </select>
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      className="w-20"
                      value={section.order ?? index}
                      onChange={(e) => {
                        const sections = [...(formData.sections || [])];
                        sections[index] = { ...sections[index], order: Number(e.target.value) };
                        setFormData({ ...formData, sections });
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-6">
                    <input
                      type="checkbox"
                      id={`section-visible-${index}`}
                      className="h-4 w-4"
                      checked={section.visible !== false}
                      onChange={(e) => {
                        const sections = [...(formData.sections || [])];
                        sections[index] = { ...sections[index], visible: e.target.checked };
                        setFormData({ ...formData, sections });
                      }}
                    />
                    <Label htmlFor={`section-visible-${index}`}>Visible</Label>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500"
                  size="sm"
                  onClick={() => {
                    const sections = (formData.sections || []).filter((_, i) => i !== index);
                    setFormData({ ...formData, sections });
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {locales.map((lang) => (
                  <div key={lang}>
                    <Label>Headline ({lang.toUpperCase()})</Label>
                    <Input
                      value={section.content?.headline?.[lang] || ''}
                      onChange={(e) => {
                        const sections = [...(formData.sections || [])];
                        const content = {
                          ...(sections[index].content || {}),
                          headline: {
                            ...(sections[index].content?.headline || {}),
                            [lang]: e.target.value,
                          },
                          body: sections[index].content?.body || { en: '', hr: '', de: '' },
                        };
                        sections[index] = { ...sections[index], content };
                        setFormData({ ...formData, sections });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {locales.map((lang) => (
                  <div key={lang}>
                    <Label>Body ({lang.toUpperCase()})</Label>
                    <Textarea
                      rows={3}
                      value={section.content?.body?.[lang] || ''}
                      onChange={(e) => {
                        const sections = [...(formData.sections || [])];
                        const content = {
                          ...(sections[index].content || {}),
                          headline: sections[index].content?.headline || { en: '', hr: '', de: '' },
                          body: {
                            ...(sections[index].content?.body || {}),
                            [lang]: e.target.value,
                          },
                        };
                        sections[index] = { ...sections[index], content };
                        setFormData({ ...formData, sections });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-[#00BFB3]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
        </Button>
      </div>
    </form>
  );
};

const emptyMenuItem = {
  id: undefined,
  label: { en: '', hr: '', de: '' },
  url: '/',
  target: '_self',
  order: 0,
  visible: true,
  parent_id: null,
};

const MenuForm = ({ menu, onSave }) => {
  const [items, setItems] = useState(menu.items || []);
  const [saving, setSaving] = useState(false);

  const updateItem = (index, changes) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyMenuItem, order: prev.length }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(menu.name, { items });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              {locales.map((lang) => (
                <div key={lang}>
                  <Label>Label ({lang.toUpperCase()})</Label>
                  <Input
                    value={item.label?.[lang] || ''}
                    onChange={(e) =>
                      updateItem(index, {
                        label: {
                          ...(item.label || {}),
                          [lang]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div>
                <Label>URL</Label>
                <Input
                  value={item.url}
                  onChange={(e) => updateItem(index, { url: e.target.value })}
                />
              </div>
              <div>
                <Label>Target</Label>
                <select
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  value={item.target}
                  onChange={(e) => updateItem(index, { target: e.target.value })}
                >
                  <option value="_self">Same tab</option>
                  <option value="_blank">New tab</option>
                </select>
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={item.order ?? 0}
                  onChange={(e) => updateItem(index, { order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id={`visible-${index}`}
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => updateItem(index, { visible: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor={`visible-${index}`}>Visible</Label>
              </div>
              <Button type="button" variant="outline" className="text-red-500" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> Add item
        </Button>
        <Button type="submit" className="bg-[#00BFB3]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save menu
        </Button>
      </div>
    </form>
  );
};

const PostForm = ({ post, onClose }) => {
  const [formData, setFormData] = useState({
    title: { en: '', hr: '', de: '' },
    slug: '',
    excerpt: { en: '', hr: '', de: '' },
    content: { en: '', hr: '', de: '' },
    category: 'general',
    featured_image: '',
    status: 'draft',
    ...post,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (post.id) {
        await blogApi.updatePost(post.id, formData);
      } else {
        await blogApi.createPost(formData);
      }
      toast.success('Saved!');
      onClose();
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
        </div>
        <div>
          <Label>Category</Label>
          <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
        </div>
      </div>
      <div>
        <Label>Title (EN)</Label>
        <Input value={formData.title?.en || ''} onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})} required />
      </div>
      <div>
        <Label>Excerpt (EN)</Label>
        <Textarea value={formData.excerpt?.en || ''} onChange={(e) => setFormData({...formData, excerpt: {...formData.excerpt, en: e.target.value}})} rows={2} />
      </div>
      <div>
        <Label>Content (EN)</Label>
        <Textarea value={formData.content?.en || ''} onChange={(e) => setFormData({...formData, content: {...formData.content, en: e.target.value}})} rows={6} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Image URL</Label>
          <Input value={formData.featured_image || ''} onChange={(e) => setFormData({...formData, featured_image: e.target.value})} />
        </div>
        <div>
          <Label>Status</Label>
          <select className="w-full p-2 border rounded-md" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-[#00BFB3]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
        </Button>
      </div>
    </form>
  );
};

export default AdminPage;