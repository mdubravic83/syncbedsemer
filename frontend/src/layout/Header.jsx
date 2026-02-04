import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cmsApi } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, LogIn, Globe, Edit2, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { HeaderFooterEditor } from '../components/HeaderFooterEditor';

const languages = [
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [headerMenu, setHeaderMenu] = useState(null);
  const [showHeaderEditor, setShowHeaderEditor] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isCmsAdmin } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('edit') === '1';
  const isCmsEditableRoute = location.pathname.startsWith('/features');

  const toggleEditMode = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === '1') {
      params.delete('edit');
    } else {
      params.set('edit', '1');
    }
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace: true });
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[1];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  useEffect(() => {
    const loadHeaderMenu = async () => {
      try {
        const menu = await cmsApi.getMenuByName('header');
        setHeaderMenu(menu);
      } catch (e) {
        // ako API padne, koristimo fallback hardkodirani meni
        setHeaderMenu(null);
      }
    };
    loadHeaderMenu();
  }, []);

  // Feature links from CMS or fallback
  const featureLinksFromMenu = headerMenu?.items?.filter(item => item.visible !== false && item.url?.startsWith('/features')).map(item => ({
    path: item.url,
    label: item.label?.[i18n.language] || item.label?.en || item.url,
  })) || [];
  
  const featureLinks = featureLinksFromMenu.length > 0 ? featureLinksFromMenu : [
    { path: '/features/channel-manager', label: t('features.channelManager.title') },
    { path: '/features/evisitor', label: t('features.eVisitor.title') },
    { path: '/features/website', label: t('features.website.title') },
    { path: '/features/smart-apartment', label: t('features.smartApartment.title') },
  ];

  // Process menu items - separate dropdowns (with children) from regular links
  const processedMenuItems = (headerMenu?.items || [])
    .filter(item => item.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(item => ({
      id: item.id,
      label: item.label?.[i18n.language] || item.label?.en || '',
      url: item.url,
      hasDropdown: item.children && item.children.length > 0,
      children: (item.children || [])
        .filter(c => c.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(child => ({
          path: child.url,
          label: child.label?.[i18n.language] || child.label?.en || child.url,
        }))
    }));

  // Nav links derived from CMS for mobile & fallback if CMS is empty
  const navLinksFromMenu = processedMenuItems
    .filter(item => !item.hasDropdown)
    .map(item => ({
      path: item.url,
      label: item.label,
    }));
  
  // Dropdown menus from CMS (items with children)
  const dropdownMenus = processedMenuItems.filter(item => item.hasDropdown);
  
  const navLinks = navLinksFromMenu.length > 0 ? navLinksFromMenu : [
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/about', label: t('nav.aboutUs') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const hasCmsMenu = processedMenuItems.length > 0;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" data-testid="header">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <span className="text-2xl font-extrabold font-heading">
              <span className="text-[#0A1628]">sync</span>
              <span className="text-[#00BFB3]">beds</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" data-testid="desktop-nav">
            {hasCmsMenu ? (
              // Render CMS-driven menu items in exact order (mixed links + dropdowns)
              processedMenuItems.map((item, index) => (
                item.hasDropdown ? (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[#00BFB3] ${
                          item.children.some(c => location.pathname === c.path) ? 'text-[#00BFB3]' : 'text-gray-700'
                        }`}
                        data-testid={`dropdown-${item.id}`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align={index === processedMenuItems.length - 1 ? "end" : "start"}
                      className="w-56"
                    >
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.path} asChild>
                          <Link 
                            to={child.path} 
                            className="w-full cursor-pointer"
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={`text-sm font-medium transition-colors hover:text-[#00BFB3] ${
                      isActive(item.url) ? 'text-[#00BFB3]' : 'text-gray-700'
                    }`}
                    data-testid={`nav-link-${(item.url || '').slice(1)}`}
                  >
                    {item.label}
                  </Link>
                )
              ))
            ) : (
              <>
                {/* Fallback static Features dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center space-x-1 text-sm font-medium transition-colors text-gray-700 hover:text-[#00BFB3]"
                      data-testid="dropdown-features-fallback"
                    >
                      <span>{t('nav.features')}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {featureLinks.map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link 
                          to={link.path} 
                          className="w-full cursor-pointer"
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-[#00BFB3] ${
                      isActive(link.path) ? 'text-[#00BFB3]' : 'text-gray-700'
                    }`}
                    data-testid={`nav-link-${link.path.slice(1)}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Right Side - Language & Login */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="language-switcher">
                  <span className="text-lg">{currentLang.flag}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => changeLanguage(lang.code)}
                    className="cursor-pointer"
                    data-testid={`lang-${lang.code}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Header Editor Button for Admin */}
            {isCmsAdmin && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs flex items-center space-x-1"
                onClick={() => setShowHeaderEditor(true)}
                title="Edit Header Navigation"
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}

            {isCmsEditableRoute && isCmsAdmin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex items-center space-x-1"
                onClick={toggleEditMode}
              >
                <Edit2 className="h-3 w-3" />
                <span>{isEditMode ? 'Exit edit' : 'Edit'}</span>
              </Button>
            )}

            {/* Login Button */}
            <Button 
              className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white"
              data-testid="login-button"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t('nav.login')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in" data-testid="mobile-nav">
            <nav className="flex flex-col space-y-4">
              {/* Features Section (mobile) */}
              {hasCmsMenu ? (
                // Build from CMS items: dropdown parents become section headers, children become links
                <>
                  {dropdownMenus.map((menu) => (
                    <div key={menu.id} className="space-y-2">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {menu.label}
                      </span>
                      {menu.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block pl-4 py-2 text-sm text-gray-700 hover:text-[#00BFB3]"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {t('nav.features')}
                  </span>
                  {featureLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block pl-4 py-2 text-sm text-gray-700 hover:text-[#00BFB3]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 text-sm font-medium ${
                    isActive(link.path) ? 'text-[#00BFB3]' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Language Switcher Mobile */}
              <div className="flex items-center space-x-2 py-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <div className="flex space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-2 py-1 text-sm rounded ${
                        i18n.language === lang.code 
                          ? 'bg-[#00BFB3] text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Button Mobile */}
              <Button 
                className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white mt-4"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('nav.login')}
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Header Editor Panel */}
      {showHeaderEditor && (
        <HeaderFooterEditor 
          type="header" 
          onClose={() => {
            setShowHeaderEditor(false);
            // Reload menu after closing
            cmsApi.getMenuByName('header').then(setHeaderMenu).catch(() => {});
          }} 
        />
      )}
    </header>
  );
};

export default Header;
