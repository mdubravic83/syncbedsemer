import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsApi } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Phone, Mail, Loader2, Settings } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { newsletterApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HeaderFooterEditor } from '../components/HeaderFooterEditor';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isCmsAdmin, setIsCmsAdmin } = useAuth();
  const [footerMenu, setFooterMenu] = useState(null);
  const [cmsLoginOpen, setCmsLoginOpen] = useState(false);
  const [cmsUsername, setCmsUsername] = useState('');
  const [cmsPassword, setCmsPassword] = useState('');
  const [cmsLoggingIn, setCmsLoggingIn] = useState(false);
  const [showFooterEditor, setShowFooterEditor] = useState(false);

  useEffect(() => {
    const loadFooterMenu = async () => {
      try {
        const menu = await cmsApi.getMenuByName('footer');
        setFooterMenu(menu);
      } catch (e) {
        setFooterMenu(null);
      }
    };
    loadFooterMenu();
  }, []);

  const footerLinks = footerMenu?.items?.filter(item => item.visible !== false).map(item => ({
    path: item.url,
    label: item.label?.[i18n.language] || item.label?.en || item.url,
  })) || [
    { path: '/terms', label: t('footer.termsAndConditions') },
    { path: '/privacy', label: t('footer.privacyPolicy') },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyLinks = [
    { path: '/features/channel-manager', label: t('nav.features') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/about', label: t('nav.aboutUs') },
    { path: '/blog', label: t('nav.blog') },
  ];

  const helpLinks = [
    { path: '/contact', label: t('nav.contact') },
    { path: '/api', label: t('footer.api') },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-[#0A1628] text-white" data-testid="footer">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link to="/" className="inline-block" data-testid="footer-logo">
              <span className="text-2xl font-extrabold font-heading">
                <span className="text-white">sync</span>
                <span className="text-[#00BFB3]">beds</span>
              </span>
            </Link>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#00BFB3]" />
                <span>Klaićeva 14, 10 000 Zagreb<br />Croatia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#00BFB3]" />
                <span>+385 97 612 8621</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#00BFB3]" />
                <span>info@my-rents.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" data-testid="footer-company-heading">
              {t('footer.company')}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-[#00BFB3] transition-colors"
                    data-testid={`footer-link-${link.path.slice(1).replace('/', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" data-testid="footer-help-heading">
              {t('footer.help')}
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-[#00BFB3] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" data-testid="footer-newsletter-heading">
              {t('footer.newsletter')}
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2" data-testid="newsletter-form">
              <Input
                type="email"
                placeholder={t('footer.enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#00BFB3]"
                data-testid="newsletter-email-input"
                required
              />
              <Button 
                type="submit" 
                className="bg-transparent hover:bg-transparent text-[#00BFB3] hover:text-[#00BFB3]/80 font-semibold px-4"
                data-testid="newsletter-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('footer.signUp')}
              </Button>
            </form>

            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#00BFB3] transition-colors"
                  aria-label={social.label}
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400" data-testid="footer-copyright">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center space-x-6">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-gray-400 hover:text-[#00BFB3] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                if (isCmsAdmin) {
                  setIsCmsAdmin(false);
                  toast.success('CMS admin odjavljen');
                  return;
                }
                setCmsLoginOpen((prev) => !prev);
              }}
              className="text-sm text-gray-500 hover:text-[#00BFB3] underline-offset-4 hover:underline"
            >
              {isCmsAdmin ? 'CMS admin' : 'CMS login'}
            </button>
            {isCmsAdmin && (
              <button
                type="button"
                onClick={() => setShowFooterEditor(true)}
                className="text-sm text-gray-500 hover:text-[#00BFB3] flex items-center gap-1"
                title="Edit Footer"
              >
                <Settings className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {cmsLoginOpen && !isCmsAdmin && (
          <div className="mt-4 w-full md:w-auto md:self-end bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-300 mb-2">CMS admin login</p>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={cmsUsername}
                  onChange={(e) => setCmsUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={cmsPassword}
                  onChange={(e) => setCmsPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-[#00BFB3] hover:bg-[#00A399] text-white px-4"
              disabled={cmsLoggingIn}
              onClick={async () => {
                if (!cmsUsername || !cmsPassword) return;
                setCmsLoggingIn(true);
                try {
                  await authApi.login(cmsUsername, cmsPassword);
                  setIsCmsAdmin(true);
                  setCmsLoginOpen(false);
                  setCmsUsername('');
                  setCmsPassword('');
                  toast.success('CMS admin prijavljen');
                } catch (err) {
                  toast.error('Neispravan CMS login');
                } finally {
                  setCmsLoggingIn(false);
                }
              }}
            >
              {cmsLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </Button>
          </div>
        )}

        {showFooterEditor && (
          <HeaderFooterEditor 
            type="footer" 
            onClose={() => {
              setShowFooterEditor(false);
              cmsApi.getMenuByName('footer').then(setFooterMenu).catch(() => {});
            }} 
          />
        )}
      </div>
    </footer>
  );
};

export default Footer;
