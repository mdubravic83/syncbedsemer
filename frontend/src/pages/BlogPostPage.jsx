import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Facebook, Twitter, Linkedin, Link2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { blogApi } from '../services/api';

const BlogPostPage = () => {
  const { t, i18n } = useTranslation();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lang = i18n.language;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogApi.getPostBySlug(postId);
      setPost(data);
    } catch (err) {
      try {
        const data = await blogApi.getPost(postId);
        setPost(data);
      } catch (err2) {
        setError('Post not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const getContent = (obj) => {
    if (!obj) return '';
    return obj[lang] || obj.en || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFB3]" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">Post not found</p>
        <Button asChild variant="outline"><Link to="/blog">Back to Blog</Link></Button>
      </div>
    );
  }

  const postTitle = getContent(post.title);
  const postExcerpt = getContent(post.excerpt);
  const postContent = getContent(post.content);
  const postImage = post.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop';
  const postDate = new Date(post.created_at).toLocaleDateString();

  return (
    <div data-testid="blog-post-page">
      <section className="bg-[#0A1628] text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/blog" className="hover:text-[#00BFB3]">Blog</Link>
            <span>&gt;</span>
            <span className="text-[#00BFB3]">{post.category}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 lg:sticky lg:top-24">
              <span className="text-[#00BFB3] text-xs font-semibold uppercase">{post.category}</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-[#0A1628] leading-tight">{postTitle}</h1>
              <p className="text-gray-600 text-lg">{postExcerpt}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{postDate}</span>
              </div>
              <div className="pt-6">
                <p className="text-sm text-gray-500 mb-4">{t('blog.sharePost')}</p>
                <div className="flex items-center space-x-4">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#00BFB3] hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#00BFB3] hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#00BFB3] hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#00BFB3] hover:text-white transition-colors">
                    <Link2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <img src={postImage} alt={postTitle} className="w-full rounded-xl shadow-lg" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[#0A1628] prose-a:text-[#00BFB3]" dangerouslySetInnerHTML={{ __html: postContent }} />
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Button asChild variant="outline"><Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
