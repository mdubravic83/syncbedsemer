import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { blogApi } from '../services/api';

const categories = [
  { key: 'all', label: 'All Posts' },
  { key: 'general', label: 'General News' },
  { key: 'channel-manager', label: 'Channel Manager' },
  { key: 'pms', label: 'PMS' },
  { key: 'website', label: 'Website' },
  { key: 'business', label: 'Business Media' },
];

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 9;
  const lang = i18n.language;

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        status: 'published',
        limit: 100,
      };
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await blogApi.getPosts(params);
      setPosts(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const getLocalizedContent = (content, field) => {
    if (!content) return '';
    return content[lang] || content.en || '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div data-testid="blog-page">
      {/* Hero Section */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20" data-testid="blog-hero">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">
                BLOG
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                Tips, Insights & Trends in Industry
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-lg">
                Stay informed with expert advice, industry news, and smart rental strategies to optimize your business and boost bookings.
              </p>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop" 
                alt="Blog"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-100" data-testid="blog-filters">
        <div className="container mx-auto px-4 md:px-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('blog.enterKeyword')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="blog-search-input"
              />
            </div>
            <Button 
              type="submit"
              className="bg-[#00D9FF] hover:bg-[#00A399] text-white"
              data-testid="blog-search-button"
            >
              {t('blog.search')}
            </Button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-[#00D9FF] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                data-testid={`category-${cat.key}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 bg-[#F8FAFB]" data-testid="blog-posts-grid">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#00D9FF]" />
              <span className="ml-3 text-gray-600">Loading posts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Error loading posts: {error}</p>
              <Button onClick={fetchPosts} variant="outline">Try Again</Button>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No posts found</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                    data-testid={`blog-card-${post.id}`}
                  >
                    <div className="overflow-hidden">
                      <img 
                        src={post.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop'} 
                        alt={getLocalizedContent(post.title)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[#00D9FF] text-xs font-semibold uppercase">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-semibold font-heading text-[#0A1628] mt-2 mb-2 group-hover:text-[#00D9FF] transition-colors line-clamp-2">
                        {getLocalizedContent(post.title)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {getLocalizedContent(post.excerpt)}
                      </p>
                      <span className="text-[#00D9FF] text-sm font-medium inline-flex items-center">
                        {t('blog.readMore')}
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12" data-testid="blog-pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-[#00D9FF] hover:bg-[#00A399]' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
