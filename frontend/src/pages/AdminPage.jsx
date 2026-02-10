import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Save, X, Mail, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import api, { blogApi, contactApi, newsletterApi, testimonialsApi, cmsApi, apiCall, authApi } from '../services/api';
import { SECTION_TYPES } from '../components/AdvancedPageEditor';
import RichTextEditor from '../components/RichTextEditor';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [adminUsers, setAdminUsers] = useState([]);

  const [pages, setPages] = useState([]);

  const [editingPage, setEditingPage] = useState(null);

  const [menus, setMenus] = useState([]);
  const [activeMenuName, setActiveMenuName] = useState('header');
  const [editingMenu, setEditingMenu] = useState(null);

  const [editingPost, setEditingPost] = useState(null);
  const [isBlogModalFullScreen, setIsBlogModalFullScreen] = useState(false);
  const [emailSettings, setEmailSettings] = useState({});

  const [snippetSettings, setSnippetSettings] = useState({ global_head_html: '', global_body_html: '', rules: [] });
  const [mailchimpSettings, setMailchimpSettings] = useState({ enabled: false, server_prefix: '', audience_id: '', has_api_key: false });
  const [openAISettings, setOpenAISettings] = useState({ enabled: false, model: 'gpt-4o', has_api_key: false });



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
      } else if (activeTab === 'settings') {
        try {
          const users = await authApi.getUsers();
          setAdminUsers(users);
        } catch (err) {
          // ignore
        }
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

  const loadEmailSettings = useCallback(async () => {
    try {
      const settings = await api.admin.getEmailSettings();
      setEmailSettings(settings || {});
    } catch (err) {
      // ignore for now
    }
  }, []);
  const loadOpenAISettings = useCallback(async () => {
    try {
      const settings = await api.admin.getOpenAISettings();
      setOpenAISettings(settings || { enabled: false, model: 'gpt-4o', has_api_key: false });
    } catch (err) {
      // ignore
    }
  }, []);


  const loadMailchimpSettings = useCallback(async () => {
    try {
      const settings = await api.admin.getMailchimpSettings();
      setMailchimpSettings(settings || { enabled: false, server_prefix: '', audience_id: '', has_api_key: false });
    } catch (err) {
      // ignore
    }
  }, []);

  const loadSnippetSettings = useCallback(async () => {
    try {
      const snippets = await api.admin.getSnippetSettings();
      setSnippetSettings(snippets || { global_head_html: '', global_body_html: '', rules: [] });
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'settings') {
      loadEmailSettings();
      loadSnippetSettings();
      loadOpenAISettings();
    }
    if (activeTab === 'newsletter') {
      loadMailchimpSettings();
    }
  }, [activeTab, loadEmailSettings, loadSnippetSettings, loadMailchimpSettings]);


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
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Blog Posts ({posts.length})</h2>
                <Button onClick={() => setEditingPost({})} className="bg-[#00D9FF] hover:bg-[#00A399]">
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
                <div
                  className={`bg-white rounded-xl w-full overflow-y-auto p-6 transition-all ${
                    isBlogModalFullScreen ? 'max-w-5xl h-[95vh]' : 'max-w-2xl max-h-[90vh]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{editingPost.id ? 'Edit Post' : 'New Post'}</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setIsBlogModalFullScreen((prev) => !prev)}
                      >
                        {isBlogModalFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingPost(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <PostForm
                    post={editingPost}
                    onClose={() => {
                      setEditingPost(null);
                      loadData();
                    }}
                    onAiCreated={(newPost) => {
                      setEditingPost(newPost);
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pages">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Pages ({pages.length})</h2>
                <Button onClick={() => setEditingPage({})} className="bg-[#00D9FF] hover:bg-[#00A399]">
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

          <TabsContent value="settings">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* AI & system tools */}
              <div className="space-y-6">
                {/* Email settings */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">AI & System Settings</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Ovdje možeš provjeriti AI konfiguraciju, podesiti email notifikacije za kontakt formu
                    i pokrenuti automatske prijevode i import slika kada je site na produkcijskom serveru.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>SMTP host</Label>
                      <Input
                        value={emailSettings.smtp_host || ''}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP port</Label>
                      <Input
                        type="number"
                        value={emailSettings.smtp_port || 587}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP username</Label>
                      <Input
                        value={emailSettings.username || ''}
                        onChange={(e) => setEmailSettings({ ...emailSettings, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP password (samo za spremanje nove vrijednosti)</Label>
                      <Input
                        type="password"
                        value={emailSettings.password || ''}
                        onChange={(e) => setEmailSettings({ ...emailSettings, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>From email</Label>
                      <Input
                        value={emailSettings.from_email || ''}
                        onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>To email (gdje stižu poruke s kontakt forme)</Label>
                      <Input
                        value={emailSettings.to_email || ''}
                        onChange={(e) => setEmailSettings({ ...emailSettings, to_email: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="email-enabled"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!!emailSettings.enabled}
                        onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                      />
                      <Label htmlFor="email-enabled">Slanje email notifikacija je aktivno</Label>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const payload = { ...emailSettings };
                            if (!payload.password) {
                              delete payload.password;
                            }
                            const saved = await api.admin.updateEmailSettings(payload);
                            setEmailSettings(saved);
                            toast.success('Email postavke spremljene.');
                          } catch (err) {
                            toast.error('Neuspješno spremanje email postavki.');
                          }
                        }}
                      >
                        Spremi email postavke
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tracking & Snippets */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tracking & Snippets</h3>
                  <p className="text-sm text-gray-600">
                    Ovdje možeš zalijepiti kodove za Google Analytics, Google Ads, Meta Pixel i slično.
                    Globalni snippeti se učitavaju na svim stranicama, a pravila po URL-u samo na odabranim putanjama.
                  </p>

                  <div className="space-y-2">
                    <Label>Global HEAD snippet (ubacuje se u &lt;head&gt; na svim stranicama)</Label>
                    <textarea
                      className="w-full min-h-[120px] border rounded-md p-2 text-sm font-mono"
                      value={snippetSettings.global_head_html || ''}
                      onChange={(e) => setSnippetSettings({ ...snippetSettings, global_head_html: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Global BODY-end snippet (prije &lt;/body&gt; na svim stranicama)</Label>
                    <textarea
                      className="w-full min-h-[120px] border rounded-md p-2 text-sm font-mono"
                      value={snippetSettings.global_body_html || ''}
                      onChange={(e) => setSnippetSettings({ ...snippetSettings, global_body_html: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const payload = {
                            global_head_html: snippetSettings.global_head_html || '',
                            global_body_html: snippetSettings.global_body_html || '',
                          };
                          const saved = await api.admin.updateSnippetSettings(payload);
                          setSnippetSettings({ ...snippetSettings, ...saved });
                          toast.success('Globalni snippeti spremljeni.');
                        } catch (err) {
                          toast.error('Neuspješno spremanje globalnih snippeta.');
                        }
                      }}
                    >
                      Spremi globalne snippete
                    </Button>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-semibold">Pravila po URL-u</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newRule = {
                            id: `tmp-${Date.now()}`,
                            name: 'Novo pravilo',
                            path_pattern: '/',
                            head_html: '',
                            body_html: '',
                            active: true,
                          };
                          setSnippetSettings({
                            ...snippetSettings,
                            rules: [...(snippetSettings.rules || []), newRule],
                          });
                        }}
                      >
                        Dodaj pravilo
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(snippetSettings.rules || []).map((rule, index) => (
                        <div key={rule.id || index} className="border rounded-md p-3 space-y-2 bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Input
                              className="flex-1"
                              value={rule.name || ''}
                              onChange={(e) => {
                                const rules = [...(snippetSettings.rules || [])];
                                rules[index] = { ...rules[index], name: e.target.value };
                                setSnippetSettings({ ...snippetSettings, rules });
                              }}
                              placeholder="Naziv pravila (npr. Google Ads kampanja)"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={async () => {
                                try {
                                  if (!rule.id || String(rule.id).startsWith('tmp-')) {
                                    const rules = snippetSettings.rules.filter((_, i) => i !== index);
                                    setSnippetSettings({ ...snippetSettings, rules });
                                    return;
                                  }
                                  const saved = await api.admin.deleteSnippetRule(rule.id);
                                  setSnippetSettings(saved);
                                  toast.success('Pravilo obrisano.');
                                } catch (err) {
                                  toast.error('Neuspješno brisanje pravila.');
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-1">
                            <Label>Path pattern (npr. /blog/*, /contact)</Label>
                            <Input
                              value={rule.path_pattern || ''}
                              onChange={(e) => {
                                const rules = [...(snippetSettings.rules || [])];
                                rules[index] = { ...rules[index], path_pattern: e.target.value };
                                setSnippetSettings({ ...snippetSettings, rules });
                              }}
                            />
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={!!rule.active}
                              onChange={(e) => {
                                const rules = [...(snippetSettings.rules || [])];
                                rules[index] = { ...rules[index], active: e.target.checked };
                                setSnippetSettings({ ...snippetSettings, rules });
                              }}
                            />
                            <span className="text-xs text-gray-700">Pravilo aktivno</span>
                          </div>

                          <div className="space-y-1 mt-2">
                            <Label>HEAD snippet za ovaj pattern</Label>
                            <textarea
                              className="w-full min-h-[80px] border rounded-md p-2 text-xs font-mono"
                              value={rule.head_html || ''}
                              onChange={(e) => {
                                const rules = [...(snippetSettings.rules || [])];
                                rules[index] = { ...rules[index], head_html: e.target.value };
                                setSnippetSettings({ ...snippetSettings, rules });
                              }}
                            />
                          </div>

                          <div className="space-y-1 mt-2">
                            <Label>BODY-end snippet za ovaj pattern</Label>
                            <textarea
                              className="w-full min-h-[80px] border rounded-md p-2 text-xs font-mono"
                              value={rule.body_html || ''}
                              onChange={(e) => {
                                const rules = [...(snippetSettings.rules || [])];
                                rules[index] = { ...rules[index], body_html: e.target.value };
                                setSnippetSettings({ ...snippetSettings, rules });
                              }}
                            />
                          </div>

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  let saved;
                                  if (!rule.id || String(rule.id).startsWith('tmp-')) {
                                    const payload = { ...rule };
                                    delete payload.id;
                                    saved = await api.admin.addSnippetRule(payload);
                                  } else {
                                    const payload = { ...rule };
                                    delete payload.id;
                                    saved = await api.admin.updateSnippetRule(rule.id, payload);
                                  }
                                  setSnippetSettings(saved);
                                  toast.success('Pravilo spremljeno.');
                                } catch (err) {
                                  toast.error('Neuspješno spremanje pravila.');
                {/* OpenAI settings */}
                <div className="space-y-3 border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold">OpenAI postavke (AI sadržaj)</h3>
                  <p className="text-sm text-gray-600">
                    Ovdje možeš unijeti vlastiti OpenAI API ključ. Ključ se sprema samo na backend (u bazu),
                    nikad u frontend. Bez ovoga AI generiranje sadržaja i prijevodi neće raditi.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>OpenAI API ključ</Label>
                      <Input
                        type="password"
                        placeholder={openAISettings.has_api_key ? 'Ključ je već postavljen - unesi novi za promjenu' : 'sk-...'}
                        onChange={(e) => {
                          setOpenAISettings({ ...openAISettings, api_key_input: e.target.value });
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        Ključ se NE prikazuje iz sigurnosnih razloga. Ako želiš promijeniti ključ, samo unesi novi i spremi.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        value={openAISettings.model || 'gpt-4o'}
                        onChange={(e) => setOpenAISettings({ ...openAISettings, model: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">
                        Preporučeno: gpt-4o (ili drugi model iz tvog OpenAI računa koji podržava chat completions).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      id="openai-enabled"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!openAISettings.enabled}
                      onChange={(e) => setOpenAISettings({ ...openAISettings, enabled: e.target.checked })}
                    />
                    <Label htmlFor="openai-enabled">AI generiranje i prijevodi su aktivni</Label>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const payload = {
                            enabled: !!openAISettings.enabled,
                            model: openAISettings.model || 'gpt-4o',
                          };
                          if (openAISettings.api_key_input && openAISettings.api_key_input.trim()) {
                            payload.api_key = openAISettings.api_key_input.trim();
                          }
                          const saved = await api.admin.updateOpenAISettings(payload);
                          setOpenAISettings({ ...saved, api_key_input: '' });
                          toast.success('OpenAI postavke spremljene.');
                        } catch (err) {
                          toast.error('Neuspješno spremanje OpenAI postavki.');
                        }
                      }}
                    >
                      Spremi OpenAI postavke
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const res = await apiCall('/ai/generate', {
                            method: 'POST',
                            body: JSON.stringify({
                              prompt: 'AI health check',
                              content_type: 'blog_post',
                              languages: ['en'],
                              tone: 'professional',
                              length: 'short',
                            }),
                          });
                          if (res && res.success) {
                            toast.success('OpenAI konfiguracija je ispravna.');
                          } else {
                            toast.error('OpenAI je odgovorio, ali sadržaj nije očekivan.');
                          }
                        } catch (err) {
                          toast.error('OpenAI health check nije uspio: ' + (err.message || '')); 
                        }
                      }}
                    >
                      Testiraj OpenAI ključ
                    </Button>
                  </div>
                </div>


                                }
                              }}
                            >
                              Spremi pravilo
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI tools */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const res = await apiCall('/ai/generate', {
                          method: 'POST',
                          body: JSON.stringify({
                            prompt: 'AI health check',
                            content_type: 'blog_post',
                            languages: ['en'],
                            tone: 'professional',
                            length: 'short',
                          }),
                        });
                        if (res && res.success) {
                          toast.success('AI je aktivan (ključ je konfiguriran).');
                        } else {
                          toast.error('AI odgovor nije valjan, provjeri ključ.');
                        }
                      } catch (err) {
                        const msg = err.message || '';
                        if (msg.includes('AI API key not configured')) {
                          toast.error('AI ključ NIJE konfiguriran na serveru (EMERGENT_LLM_KEY).');
                        } else {
                          toast.error('AI health check nije uspio: ' + msg);
                        }
                      }
                    }}
                  >
                    Testiraj AI konfiguraciju
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          'Ova akcija će prevesti sav sadržaj (pagevi i blogovi) s EN na HR/DE/SL za polja koja još nisu prevedena. Nastavi?'
                        )
                      ) {
                        return;
                      }
                      try {
                        const res = await api.admin.translateAllContent();
                        toast.success(
                          `Prijevodi dovršeni. Ažurirano stranica: ${res.pages_updated}, postova: ${res.posts_updated}`
                        );
                      } catch (err) {
                        const msg = err.message || '';
                        toast.error('Automatski prijevod nije uspio: ' + msg);
                      }
                    }}
                  >
                    Prevedi sav sadržaj (EN → HR/DE/SL)
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          'Ova akcija će pokušati importati sve slike (promo grid, benefits, testimonialsi itd.) s produkcijskog marketing servera. Nastavi?'
                        )
                      ) {
                        return;
                      }
                      try {
                        const res = await api.admin.importAllImages();
                        toast.success(
                          `Import slika dovršen. Uspješno: ${res.imported || 0}, grešaka: ${res.failed || 0}`
                        );
                      } catch (err) {
                        const msg = err.message || '';
                        toast.error('Import slika nije uspio: ' + msg);
                      }
                    }}
                  >
                    Importaj sve slike s marketing CMS servera
                  </Button>

                  <p className="text-xs text-gray-500">
                    Napomena: za sve ove akcije, backend mora imati ispravno postavljen <code>EMERGENT_LLM_KEY</code>{' '}
                    i pristup produkcijskom marketing CMS serveru.
                  </p>
                </div>
              </div>

              {/* Admin users management */}
              <div className="border-t pt-6 mt-4">
                <h3 className="text-lg font-semibold mb-3">Admin users</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Samo trenutni admin (ulogirani korisnik) smije dodavati i uređivati dodatne admin korisnike.
                </p>

                <div className="space-y-3 mb-4">
                  {adminUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-500">Role: {user.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const newPass = window.prompt(
                              `Nova lozinka za ${user.username} (ostavi prazno ako ne želiš mijenjati):`,
                              ''
                            );
                            if (newPass === null) return;
                            const newRole = window.prompt(
                              `Role za ${user.username} (owner/admin, ostavi prazno za bez promjene):`,
                              user.role || 'admin'
                            );
                            try {
                              const payload = {};
                              if (newPass && newPass.trim()) payload.password = newPass.trim();
                              if (newRole && newRole.trim()) payload.role = newRole.trim();
                              await authApi.updateUser(user.id, payload);
                              const users = await authApi.getUsers();
                              setAdminUsers(users);
                              toast.success('Korisnik ažuriran.');
                            } catch (err) {
                              toast.error('Neuspješno ažuriranje korisnika.');
                            }
                          }}
                        >
                          Uredi
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!window.confirm(`Sigurno obrisati korisnika ${user.username}?`)) return;
                            try {
                              await authApi.deleteUser(user.id);
                              setAdminUsers((prev) => prev.filter((u) => u.id !== user.id));
                              toast.success('Korisnik obrisan.');
                            } catch (err) {
                              toast.error('Neuspješno brisanje korisnika.');
                            }
                          }}
                        >
                          Obriši
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-800">Dodaj novog admin korisnika</h4>
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    <Input
                      placeholder="Username"
                      className="md:w-40"
                      onBlur={async (e) => {
                        // samo bilježimo value u DOM-u, ne koristimo state za MVP
                        e.target.dataset.value = e.target.value;
                      }}
                    />
                    <Input
                      placeholder="Lozinka"
                      type="password"
                      className="md:w-40"
                      onBlur={async (e) => {
                        e.target.dataset.value = e.target.value;
                      }}
                    />
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      defaultValue="admin"
                      onBlur={(e) => {
                        e.target.dataset.value = e.target.value;
                      }}
                    >
                      <option value="owner">owner</option>
                      <option value="admin">admin</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async (e) => {
                        const container = e.currentTarget.parentElement;
                        if (!container) return;
                        const [userInput, passInput, roleSelect] =
                          container.querySelectorAll('input, select');
                        const username = userInput?.dataset.value || userInput?.value;
                        const password = passInput?.dataset.value || passInput?.value;
                        const role = roleSelect?.dataset.value || roleSelect?.value || 'admin';
                        if (!username || !password) {
                          toast.error('Username i lozinka su obavezni.');
                          return;
                        }
                        try {
                          await authApi.createUser({ username, password, role });
                          const users = await authApi.getUsers();
                          setAdminUsers(users);
                          toast.success('Novi admin korisnik dodan.');
                        } catch (err) {
                          toast.error('Neuspješno dodavanje korisnika (username možda već postoji).');
                        }
                      }}
                    >
                      Dodaj korisnika
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Newsletter subscribers ({subscribers.length})</h2>
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

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Mailchimp postavke</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ovdje možeš spojiti newsletter sa svojim Mailchimp računom. Svaka nova prijava bit će odmah
                  poslana i u Mailchimp listu.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>API key</Label>
                    <Input
                      type="password"
                      placeholder={mailchimpSettings.has_api_key ? '*************' : 'Mailchimp API key'}
                      onChange={(e) => setMailchimpSettings({ ...mailchimpSettings, api_key: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      API key se nikad ne prikazuje u cijelosti. Novi ključ će zamijeniti postojeći.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Server prefix (dc)</Label>
                    <Input
                      value={mailchimpSettings.server_prefix || ''}
                      onChange={(e) => setMailchimpSettings({ ...mailchimpSettings, server_prefix: e.target.value })}
                      placeholder="npr. us21"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Audience / List ID</Label>
                    <Input
                      value={mailchimpSettings.audience_id || ''}
                      onChange={(e) => setMailchimpSettings({ ...mailchimpSettings, audience_id: e.target.value })}
                      placeholder="Mailchimp audience ID"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="mailchimp-enabled"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!mailchimpSettings.enabled}
                      onChange={(e) => setMailchimpSettings({ ...mailchimpSettings, enabled: e.target.checked })}
                    />
                    <Label htmlFor="mailchimp-enabled">Sinkronizacija s Mailchimpom je aktivna</Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const payload = { ...mailchimpSettings };
                        // ako api_key nije unesen, ne šaljemo ga (zadržavamo postojeći)
                        if (!payload.api_key) {
                          delete payload.api_key;
                        }
                        const saved = await api.admin.updateMailchimpSettings(payload);
                        setMailchimpSettings(saved);
                        toast.success('Mailchimp postavke spremljene.');
                      } catch (err) {
                        toast.error('Neuspješno spremanje Mailchimp postavki.');
                      }
                    }}
                  >
                    Spremi Mailchimp postavke
                  </Button>
                </div>
              </div>
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
const aiLocales = ['en', 'hr', 'de', 'sl'];

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
          <div className="flex flex-wrap gap-2">
            {Object.entries(SECTION_TYPES).map(([key, type]) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextOrder = formData.sections?.length || 0;
                  const newSection = {
                    id: Math.random().toString(36).slice(2),
                    section_type: key,
                    order: nextOrder,
                    visible: true,
                    content: createInitialContentForForm(key),
                  };
                  setFormData({ ...formData, sections: [...(formData.sections || []), newSection] });
                }}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> {type.label}
              </Button>
            ))}
          </div>
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
                        const newType = e.target.value;
                        sections[index] = {
                          ...sections[index],
                          section_type: newType,
                          content: createInitialContentForForm(newType),
                        };
                        setFormData({ ...formData, sections });
                      }}
                    >
                      {Object.entries(SECTION_TYPES).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.label}
                        </option>
                      ))}
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
        <Button type="submit" className="bg-[#00D9FF]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
        </Button>
      </div>
    </form>
  );
};

const createInitialContentForForm = (sectionType) => {
  const typeConfig = SECTION_TYPES[sectionType];
  if (!typeConfig) return {};
  const content = {};
  typeConfig.fields.forEach((field) => {
    switch (field) {
      case 'headline':
      case 'headline_highlight':
      case 'subheadline':
      case 'body':
      case 'button_text':
      case 'secondary_button_text':
        content[field] = { en: '', hr: '', de: '' };
        break;
      case 'headline_highlight_color':
        content[field] = 'primary';
        break;
      case 'background_gradient':
        content[field] = false;
        break;
      case 'image_display_size':
        content[field] = 'large';
        break;
      case 'image_frame':
        content[field] = false;
        break;
      case 'image_shadow':
        content[field] = 'strong';
        break;
      case 'html_content':
        content[field] = { en: '', hr: '', de: '' };
        break;
      case 'use_raw_code':
        content[field] = false;
        break;
      case 'raw_code':
        content[field] = { en: '', hr: '', de: '' };
        break;
      case 'max_width':
        content[field] = '100%';
        break;
      case 'alignment':
        content[field] = 'center';
        break;
      case 'button_url':
      case 'secondary_button_url':
      case 'image_url':
        content[field] = '';
        break;
      case 'image_position':
        content[field] = 'right';
        break;
      case 'background_color':
        content[field] = 'white';
        break;
      case 'columns':
        content[field] = 2;
        break;
      case 'layout':
        content[field] = 'list-with-image';
        break;
      case 'items':
      case 'images':
        content[field] = [];
        break;
      default:
        content[field] = '';
    }
  });
  return content;
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
        <Button type="submit" className="bg-[#00D9FF]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save menu
        </Button>
      </div>
    </form>
  );
};

const languageTabs = [
  { key: 'en', label: 'EN' },
  { key: 'hr', label: 'HR' },
  { key: 'de', label: 'DE' },
  { key: 'sl', label: 'SL' },
];

const PostForm = ({ post, onClose, onAiCreated }) => {
  const [formData, setFormData] = useState({
    title: { en: '', hr: '', de: '', sl: '' },
    slug: '',
    excerpt: { en: '', hr: '', de: '', sl: '' },
    content: { en: '', hr: '', de: '', sl: '' },
    category: 'general',
    featured_image: '',
    status: 'draft',
    ...post,
  });
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLength, setAiLength] = useState('medium');
  const [aiLanguage, setAiLanguage] = useState('en');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiExtendOpen, setAiExtendOpen] = useState(false);
  const [aiExtendInstructions, setAiExtendInstructions] = useState('');
  const [aiExtendLoading, setAiExtendLoading] = useState(false);
  const [aiExtendError, setAiExtendError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: (formData.tags || []).map((t) => t.trim()).filter(Boolean),
      };
      if (post.id) {
        await blogApi.updatePost(post.id, payload);
      } else {
        await blogApi.createPost(payload);
      }
      toast.success('Saved!');
      onClose();
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      setAiError('Unesite temu za AI generiranje.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const preferredLanguageLabel = aiLanguage.toUpperCase();
      const topicPrompt = `Topic: ${aiTopic}\nPreferred tone: ${aiTone}\nDesired length: ${aiLength}\nPrimary language: ${preferredLanguageLabel} (but generate all EN, HR, DE, SL variations).`;

      const response = await apiCall('/ai/generate-blog-post', {
        method: 'POST',
        body: JSON.stringify({ topic: topicPrompt }),
      });

      if (!response?.success || !response.blog_post) {
        throw new Error('AI nije vratio valjan blog post.');
      }

      const newPost = response.blog_post;
      toast.success('AI blog post je generiran.');
      // Popuni formu generiranim sadržajem
      setFormData((prev) => ({
        ...prev,
        ...newPost,
      }));
      if (onAiCreated) {
        onAiCreated(newPost);
      }
    } catch (error) {
      console.error(error);
      setAiError(error.message || 'Greška pri AI generiranju.');
      toast.error('AI generiranje nije uspjelo.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleExtendWithAI = async () => {
    const currentContent = formData.content?.[activeLang] || '';
    if (!currentContent.trim()) {
      setAiExtendError('Nema postojećeg sadržaja za nadogradnju (EN).');
      return;
    }
    setAiExtendError('');
    setAiExtendLoading(true);
    try {
      const extra = aiExtendInstructions?.trim()
        ? `\n\nAdditional instructions: ${aiExtendInstructions.trim()}`
        : '';
      const prompt = `Existing blog content (EN):\n${currentContent.slice(0, 2000)}\n\nContinue this article with additional paragraphs, same style and tone, without repeating what is already written.${extra}`;
      const res = await apiCall('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          content_type: 'blog_post',
          languages: ['en'],
          tone: aiTone,
          length: aiLength,
        }),
      });
      const content = res?.content || {};
      const enData = content.en || {};
      const generatedHtml = enData.content || enData.raw || '';
      if (!generatedHtml) {
        setAiExtendError('AI nije vratio dodatni sadržaj.');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          en: `${prev.content?.en || ''}\n\n${generatedHtml}`,
        },
      }));
      toast.success('Dodatni AI sadržaj je dodan na kraj članka (EN).');
      setAiExtendOpen(false);
      setAiExtendInstructions('');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('AI API key not configured')) {
        setAiExtendError('AI ključ nije konfiguriran na serveru (EMERGENT_LLM_KEY).');
      } else {
        setAiExtendError('AI nadogradnja sadržaja nije uspjela: ' + msg);
      }
    } finally {
      setAiExtendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-3 bg-gray-50 space-y-3" data-testid="ai-blog-generator">
        <p className="text-sm font-medium">AI generiranje blog posta</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Tema / naslov članka</Label>
            <Input
              data-testid="ai-blog-topic-input"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="npr. Kako povećati direktne rezervacije"
            />
          </div>
          <div>
            <Label>Glavni jezik</Label>
            <select
              data-testid="ai-blog-language-select"
              className="w-full p-2 border rounded-md text-sm"
              value={aiLanguage}
              onChange={(e) => setAiLanguage(e.target.value)}
            >
              {aiLocales.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Duljina</Label>
            <div className="flex items-center gap-3" data-testid="ai-blog-length-radio">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="ai-length"
                  value="short"
                  checked={aiLength === 'short'}
                  onChange={(e) => setAiLength(e.target.value)}
                />
                Kratko
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="ai-length"
                  value="medium"
                  checked={aiLength === 'medium'}
                  onChange={(e) => setAiLength(e.target.value)}
                />
                Srednje
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="ai-length"
                  value="long"
                  checked={aiLength === 'long'}
                  onChange={(e) => setAiLength(e.target.value)}
                />
                Dugo
              </label>
            </div>
          </div>
          <div>
            <Label>Ton</Label>
            <select
              data-testid="ai-blog-tone-select"
              className="w-full p-2 border rounded-md text-sm"
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
            >
              <option value="professional">Profesionalan</option>
              <option value="casual">Prijateljski</option>
              <option value="formal">Formalan</option>
            </select>
          </div>
        </div>
        {aiError && (
          <p data-testid="ai-blog-generate-error" className="text-sm text-red-600">
            {aiError}
          </p>
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            data-testid="ai-blog-generate-button"
            className="bg-[#00D9FF] hover:bg-[#00A399]"
            onClick={handleGenerateWithAI}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generiram...
              </>
            ) : (
              'Generiraj s AI'
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          AI translate će ispuniti prazne jezike (HR/DE/SL) na temelju EN sadržaja.
        </p>
        {post.id && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                const res = await blogApi.translatePost(post.id, 'en', ['hr', 'de', 'sl']);
                if (res && res.success && res.blog_post) {
                  setFormData((prev) => ({
                    ...prev,
                    ...res.blog_post,
                  }));
                  toast.success('AI prijevod blog posta je dovršen.');
                  if (onAiCreated) {
                    onAiCreated(res.blog_post);
                  }
                } else {
                  toast.error('AI prijevod nije uspio (nevaljan odgovor).');
                }
              } catch (err) {
                const msg = err.message || '';
                if (msg.includes('AI API key not configured')) {
                  toast.error('AI ključ nije konfiguriran na serveru (EMERGENT_LLM_KEY).');
                } else {
                  toast.error('AI prijevod blog posta nije uspio: ' + msg);
                }
              }
            }}
          >
            AI translate na HR/DE/SL
          </Button>
        )}
      </div>

      {/* Create more with AI - opens modal for instructions */}
      {activeLang === 'en' && (
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setAiExtendOpen(true);
              setAiExtendInstructions('');
              setAiExtendError('');
            }}
          >
            Create more with AI (EN)
          </Button>
        </div>
      )}

      {aiExtendOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Create more with AI (EN)</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setAiExtendOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Napiši kratke upute što želiš da AI doda u postojeći članak (npr. dodatni primjeri, usporedbe, zaključak...).
            </p>
            <Textarea
              rows={4}
              className="text-sm"
              placeholder="npr. Dodaj primjer iz prakse za apartmane na moru, fokus na direct booking i povećanje prihoda."
              value={aiExtendInstructions}
              onChange={(e) => setAiExtendInstructions(e.target.value)}
            />
            {aiExtendError && (
              <p className="text-sm text-red-600">{aiExtendError}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAiExtendOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-[#00D9FF] hover:bg-[#00A399]"
                disabled={aiExtendLoading}
                onClick={handleExtendWithAI}
              >
                {aiExtendLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generiram...
                  </>
                ) : (
                  'Generate more content'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
        </div>
        <div>
          <Label>Category</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="npr. general, channel-manager, website"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label>Tags (comma-separated)</Label>
        <Input
          value={(formData.tags || []).join(', ')}
          onChange={(e) => {
            const tags = e.target.value
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);
            setFormData({ ...formData, tags });
          }}
          placeholder="npr. channel-manager, pms, revenue-management"
        />
      </div>

      {/* Language Tabs for title/excerpt/content */}
      <div>
        <Label>Languages</Label>
        <div className="flex gap-2 mt-1 mb-2">
          {languageTabs.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => setActiveLang(lang.key)}
              className={`px-3 py-1 text-xs rounded-full border ${
                activeLang === lang.key
                  ? 'bg-[#00D9FF] text-white border-[#00D9FF]'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>{`Title (${activeLang.toUpperCase()})`}</Label>
        <Input
          value={formData.title?.[activeLang] || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, [activeLang]: e.target.value },
            })
          }
          required={activeLang === 'en'}
        />
      </div>

      <div>
        <Label>{`Excerpt (${activeLang.toUpperCase()})`}</Label>
        <Textarea
          value={formData.excerpt?.[activeLang] || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              excerpt: { ...formData.excerpt, [activeLang]: e.target.value },
            })
          }
          rows={2}
        />
      </div>

      <div>
        <Label>{`Content (${activeLang.toUpperCase()})`}</Label>
        <RichTextEditor
          content={formData.content?.[activeLang] || ''}
          onChange={(html) =>
            setFormData({
              ...formData,
              content: { ...formData.content, [activeLang]: html },
            })
          }
          minHeight="220px"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <Label>Featured Image URL</Label>
          <Input
            value={formData.featured_image || ''}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Upload Featured Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/media/upload`, {
                  method: 'POST',
                  body: formDataUpload,
                });
                if (!res.ok) {
                  toast.error('Upload slike nije uspio');
                  return;
                }
                const data = await res.json();
                if (data.url) {
                  setFormData((prev) => ({ ...prev, featured_image: data.url }));
                  toast.success('Featured image je postavljen');
                }
              } catch (err) {
                console.error('Featured image upload error', err);
                toast.error('Greška pri uploadu slike');
              }
            }}
            className="text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#00D9FF]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
        </Button>
      </div>
    </form>
  );
};

export default AdminPage;