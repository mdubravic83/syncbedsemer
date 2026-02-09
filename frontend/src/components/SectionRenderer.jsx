import React from 'react';
import { Check, ArrowRight, Calendar, Users, Globe, Zap, RefreshCw, Shield, BarChart, Clock, Quote, ChevronDown, ChevronUp, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';

// API URL for images
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Helper to get full image URL
const getImageUrl = (url) => {
  if (!url) return null;
  // If URL starts with /api/, prepend the backend URL
  if (url.startsWith('/api/')) {
    return `${API_URL}${url}`;
  }
  return url;
};

// Icon mapping for dynamic icon rendering
const ICONS = {
  Check, ArrowRight, Calendar, Users, Globe, Zap, RefreshCw, Shield, BarChart, Clock, Quote, ChevronDown, ChevronUp, ChevronRight, Play
};

const getIcon = (iconName) => {
  return ICONS[iconName] || Check;
};

// Helper to get text with language fallback
const getText = (obj, lang) => {
  if (!obj) return null;
  // Try exact match first, then try base language (e.g., 'en' from 'en-GB'), then fallback to 'en'
  return obj[lang] || obj[lang?.split('-')[0]] || obj.en || obj.hr || Object.values(obj)[0];
};

const HIGHLIGHT_COLORS = {
  primary: '#00BAD3',
  'primary-dark': '#00A0D3',
  'primary-100': '#00D8FF',
  'grey-100': '#25252E',
  info: '#297AF4',
};

// Helper to render highlighted headline with optional color
const renderHighlightedHeadline = (headline, highlight, colorKey = 'primary') => {
  if (!headline) return null;
  if (!highlight) return headline;

  const color = HIGHLIGHT_COLORS[colorKey] || HIGHLIGHT_COLORS.primary;

  const parts = headline.split(highlight);
  if (parts.length === 1) return headline;
  
  return (
    <>
      {parts[0]}
      <span className="font-semibold" style={{ color }}>
        {highlight}
      </span>
      {parts[1]}
    </>
  );
};

// Hero Section Component
export const HeroSection = ({ section, currentLang, feature, t }) => {
  const {
    headline,
    headline_highlight,
    headline_highlight_color,
    subheadline,
    body,
    button_text,
    button_url,
    secondary_button_text,
    secondary_button_url,
    image_url,
    background_color,
    background_gradient,
    image_display_size = 'large',
    image_frame = false,
    image_shadow = 'strong',
  } = section.content || {};
  const lang = currentLang || 'en';
  
  const baseBg = background_color === 'dark' ? 'from-[#0A1628] text-white' 
    : background_color === 'primary' ? 'from-[#00D9FF] text-white'
    : background_color === 'light' ? 'from-gray-100'
    : 'from-white';

  const bgClass = background_gradient
    ? `bg-gradient-to-b ${baseBg} to-white`
    : baseBg.replace('from-', 'bg-');

  const imageWidthClass = image_display_size === 'small'
    ? 'max-w-sm'
    : image_display_size === 'medium'
      ? 'max-w-md'
      : image_display_size === 'full'
        ? 'w-full'
        : 'max-w-lg';

  const shadowClass = image_shadow === 'none'
    ? 'shadow-none'
    : image_shadow === 'soft'
      ? 'shadow-xl'
      : 'shadow-2xl';

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {getText(subheadline, lang) && (
              <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">
                {getText(subheadline, lang)}
              </span>
            )}
            {getText(headline, lang) && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                {renderHighlightedHeadline(
                  getText(headline, lang),
                  getText(headline_highlight, lang),
                  section.content?.headline_highlight_color || 'primary'
                )}
              </h1>
            )}
            {getText(body, lang) && (
              <p className={`text-base md:text-lg max-w-lg ${background_color === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {getText(body, lang)}
              </p>
            )}
            {(getText(button_text, lang) || getText(secondary_button_text, lang)) && (
              <div className="flex flex-wrap items-center gap-4">
                {getText(button_text, lang) && (
                  <Button 
                    className="bg-[#00D9FF] hover:bg-[#00A399] text-white font-semibold py-6 px-8 rounded-lg text-base"
                    onClick={() => button_url && (window.location.href = button_url)}
                  >
                    {getText(button_text, lang)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                {getText(secondary_button_text, lang) && (
                  <button
                    type="button"
                    onClick={() => secondary_button_url && (window.location.href = secondary_button_url)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] hover:text-[#00D9FF]"
                  >
                    <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                      <Play className="h-4 w-4" />
                    </div>
                    <span>{getText(secondary_button_text, lang)}</span>
                  </button>
                )}
              </div>
            )}
          </div>
          {(image_url || feature?.image) && (
            <div className={`relative flex justify-end ${imageWidthClass}`}>
              <div
                className={`relative ${image_frame ? 'bg-white rounded-3xl p-3' : ''} ${shadowClass} overflow-hidden`}
              >
                <img 
                  src={getImageUrl(image_url) || feature?.image} 
                  alt={getText(headline, lang) || 'Hero image'}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Hero 2 Section Component - image below content, centered (used e.g. for feature pages)
export const Hero2Section = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, subheadline, body, button_text, button_url, secondary_button_text, secondary_button_url, image_url, background_color, background_gradient } = section.content || {};
  const lang = currentLang || 'en';

  const baseBg = background_color === 'dark' ? 'from-[#0A1628] text-white' 
    : background_color === 'primary' ? 'from-[#00D9FF] text-white'
    : background_color === 'light' ? 'from-gray-100'
    : 'from-white';

  const bgClass = background_gradient
    ? `bg-gradient-to-b ${baseBg} to-white`
    : baseBg.replace('from-', 'bg-');

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {getText(subheadline, lang) && (
            <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">
              {getText(subheadline, lang)}
            </span>
          )}
          {getText(headline, lang) && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
              {renderHighlightedHeadline(
                getText(headline, lang),
                getText(headline_highlight, lang),
                headline_highlight_color || 'primary'
              )}
            </h1>
          )}
          {getText(body, lang) && (
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${background_color === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {getText(body, lang)}
            </p>
          )}
          {(getText(button_text, lang) || getText(secondary_button_text, lang)) && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {getText(button_text, lang) && (
                <Button
                  className="bg-[#00D9FF] hover:bg-[#00A399] text-white font-semibold py-6 px-10 rounded-lg text-base"
                  onClick={() => button_url && (window.location.href = button_url)}
                >
                  {getText(button_text, lang)}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              {getText(secondary_button_text, lang) && (
                <button
                  type="button"
                  onClick={() => secondary_button_url && (window.location.href = secondary_button_url)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628] hover:text-[#00D9FF]"
                >
                  <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                    <Play className="h-4 w-4" />
                  </div>
                  <span>{getText(secondary_button_text, lang)}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {image_url && (
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="relative">
              {/* slika prelazi iz tamnog dijela u bijeli ispod */}
              <img
                src={getImageUrl(image_url)}
                alt={getText(headline, lang) || 'Hero image'}
                className="w-full h-auto rounded-2xl shadow-2xl object-cover translate-y-6 md:translate-y-10"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Hero 3 Section Component - layout inspired by Figma (overlap & video button)
export const Hero3Section = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, subheadline, body, button_text, button_url, secondary_button_text, secondary_button_url, image_url, background_color, background_gradient } = section.content || {};
  const lang = currentLang || 'en';

  const baseBg = background_color === 'dark' ? 'from-[#0A1628] text-white' 
    : background_color === 'primary' ? 'from-[#00D9FF] text-white'
    : background_color === 'light' ? 'from-gray-100'
    : 'from-white';

  const bgClass = background_gradient
    ? `bg-gradient-to-b ${baseBg} to-white`
    : baseBg.replace('from-', 'bg-');

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="space-y-6">
            {getText(subheadline, lang) && (
              <span className="inline-block text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase">
                {getText(subheadline, lang)}
              </span>
            )}
            {getText(headline, lang) && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                {renderHighlightedHeadline(
                  getText(headline, lang),
                  getText(headline_highlight, lang),
                  headline_highlight_color || 'primary'
                )}
              </h1>
            )}
            {getText(body, lang) && (
              <p className={`text-base md:text-lg max-w-lg ${background_color === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {getText(body, lang)}
              </p>
            )}
            {(getText(button_text, lang) || getText(secondary_button_text, lang)) && (
              <div className="flex flex-wrap items-center gap-4">
                {getText(button_text, lang) && (
                  <Button
                    className="bg-[#00D9FF] hover:bg-[#00A399] text-white font-semibold py-6 px-8 rounded-lg text-base"
                    onClick={() => button_url && (window.location.href = button_url)}
                  >
                    {getText(button_text, lang)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                {getText(secondary_button_text, lang) && (
                  <button
                    type="button"
                    onClick={() => secondary_button_url && (window.location.href = secondary_button_url)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
                  >
                    <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      <Play className="h-4 w-4" />
                    </div>
                    <span>{getText(secondary_button_text, lang)}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: image card overlapping dark & light */}
          {(image_url) && (
            <div className="relative flex justify-end">
              <div className="relative w-full max-w-xl">
                <div className="relative rounded-3xl shadow-[0_40px_80px_rgba(15,23,42,0.55)] overflow-hidden">
                  <img
                    src={getImageUrl(image_url)}
                    alt={getText(headline, lang) || 'Hero image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* soft reflection */}
                <div className="mt-6 h-10 bg-gradient-to-b from-black/20 to-transparent rounded-3xl blur-[2px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


// Content Block Component
export const ContentSection = ({ section, currentLang, feature }) => {
  const { headline, headline_highlight, headline_highlight_color, body, html_content, image_url, image_position } = section.content || {};
  const isImageLeft = image_position === 'left';
  const lang = currentLang || 'en';
  
  return (
    <section className="py-16 md:py-24 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isImageLeft ? '' : 'lg:grid-flow-dense'}`}>
          {(image_url || feature?.howItWorksImage) && (
            <div className={isImageLeft ? '' : 'lg:col-start-2'}>
              <img 
                src={image_url || feature?.howItWorksImage} 
                alt={getText(headline, lang) || 'Content image'}
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          )}
          <div className={isImageLeft ? '' : 'lg:col-start-1 lg:row-start-1'}>
            {getText(headline, lang) && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-6">
                {renderHighlightedHeadline(
                  getText(headline, lang),
                  getText(headline_highlight, lang),
                  section.content?.headline_highlight_color || 'primary'
                )}
              </h2>
            )}
            {getText(html_content, lang) ? (
              <div 
                className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-lg"
                dangerouslySetInnerHTML={{ __html: getText(html_content, lang) }}
              />
            ) : getText(body, lang) && (
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {getText(body, lang)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Features List Component - supports columns and layout options
export const FeaturesListSection = ({ section, currentLang }) => {
  const { headline, subheadline, items, image_url, columns = 2, layout = 'list-with-image' } = section.content || {};
  const lang = currentLang || 'en';
  
  // Determine grid columns based on columns setting
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Render feature item based on layout
  const renderFeatureItem = (item, index) => {
    const IconComponent = getIcon(item.icon);
    
    if (layout === 'cards') {
      return (
        <div key={item.id || index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center mb-4">
            <IconComponent className="h-6 w-6 text-[#00D9FF]" />
          </div>
          {getText(item.title, lang) && (
            <h3 className="text-lg font-semibold text-[#0A1628] mb-2">
              {getText(item.title, lang)}
            </h3>
          )}
          {getText(item.description, lang) && (
            <p className="text-gray-600 text-sm">{getText(item.description, lang)}</p>
          )}
        </div>
      );
    }
    
    // Default list style
    return (
      <div key={item.id || index} className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-[#00D9FF] rounded-full flex items-center justify-center flex-shrink-0">
          <IconComponent className="h-5 w-5 text-white" />
        </div>
        <div>
          {getText(item.title, lang) && (
            <h3 className="text-lg font-semibold text-[#0A1628] mb-1">
              {getText(item.title, lang)}
            </h3>
          )}
          {getText(item.description, lang) && (
            <p className="text-gray-600 text-sm">{getText(item.description, lang)}</p>
          )}
        </div>
      </div>
    );
  };

  // Layout: Grid only (no side image)
  if (layout === 'grid' || layout === 'cards') {
    return (
      <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid={`section-${section.id}`}>
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            {getText(headline, lang) && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-4">
                {getText(headline, lang)}
              </h2>
            )}
            {getText(subheadline, lang) && (
              <p className="text-gray-600 max-w-2xl mx-auto">{getText(subheadline, lang)}</p>
            )}
          </div>
          
          {/* Featured Image (top) */}
          {image_url && (
            <div className="mb-12 max-w-4xl mx-auto">
              <img 
                src={getImageUrl(image_url)} 
                alt={getText(headline, lang) || 'Features'}
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          )}
          
          {/* Items Grid */}
          <div className={`grid ${getGridCols()} gap-6`}>
            {(items || []).map((item, index) => renderFeatureItem(item, index))}
          </div>
        </div>
      </section>
    );
  }

  // Layout: List only (single column, no image)
  if (layout === 'list-only') {
    return (
      <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid={`section-${section.id}`}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {getText(headline, lang) && (
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-8">
              {getText(headline, lang)}
            </h2>
          )}
          {getText(subheadline, lang) && (
            <p className="text-gray-600 mb-8">{getText(subheadline, lang)}</p>
          )}
          <div className="space-y-6">
            {(items || []).map((item, index) => renderFeatureItem(item, index))}
          </div>
        </div>
      </section>
    );
  }

  // Default layout: List with Image (side by side)
  return (
    <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={image_url ? 'grid lg:grid-cols-2 gap-12 items-start' : ''}>
          <div>
            {getText(headline, lang) && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-8">
                {getText(headline, lang)}
              </h2>
            )}
            {getText(subheadline, lang) && (
              <p className="text-gray-600 mb-8">{getText(subheadline, lang)}</p>
            )}
            <div className={`grid ${getGridCols()} gap-6`}>
              {(items || []).map((item, index) => renderFeatureItem(item, index))}
            </div>
          </div>
          {image_url && (
            <div className="mt-8 lg:mt-0">
              <img 
                src={getImageUrl(image_url)} 
                alt={getText(headline, lang) || 'Features'}
                className="rounded-xl shadow-lg w-full sticky top-24"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Promo Grid Section - headline, subheadline, image and columns of items
export const PromoGridSection = ({ section, currentLang }) => {
  const { headline, subheadline, headline_highlight, headline_highlight_color, items = [], columns = 3, image_url, scroll_direction = 'none', image_background_enabled = true, card_border_enabled = true, card_shadow_enabled = true } = section.content || {};
  const lang = currentLang || 'en';

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5: return 'grid-cols-2 md:grid-cols-5';
      case 6: return 'grid-cols-2 md:grid-cols-6';
      case 7: return 'grid-cols-3 md:grid-cols-7';
      case 8: return 'grid-cols-3 md:grid-cols-8';
      case 9: return 'grid-cols-3 md:grid-cols-9';
      case 10: return 'grid-cols-4 md:grid-cols-10';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const direction = scroll_direction; // 'none' | 'left' | 'right'
  const hasImages = items.some((item) => item.image_url);
  const shouldAutoScroll = direction !== 'none' && items.length > 4 && hasImages;

  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (!shouldAutoScroll) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const next = direction === 'left' ? prev - 1 : prev + 1;
        return next;
      });
    }, 40); // brzina skrolanja

    return () => clearInterval(interval);
  }, [shouldAutoScroll, direction]);

  const getTransformStyle = () => {
    if (!shouldAutoScroll) return {};
    const widthPerItem = 260; // px, približno širina kartice
    const totalWidth = widthPerItem * items.length;
    const maxOffset = -totalWidth;
    let current = offset;

    if (direction === 'left' && current <= maxOffset) {
      current = 0;
      setOffset(0);
    }
    if (direction === 'right' && current >= totalWidth) {
      current = 0;
      setOffset(0);
    }

    return {
      transform: `translateX(${current}px)`,
    };
  };

  const renderItems = () => {
    if (!shouldAutoScroll) {
      return (
        <div className={`grid ${getGridCols()} gap-8`}>
          {items.map((item, index) => renderPromoItem(item, index))}
        </div>
      );
    }

    // Za auto-scroll, koristimo flex traku sa dupliranim itemima radi beskonačne petlje
    const loopItems = [...items, ...items];

    return (
      <div className="overflow-hidden">
        <div className="flex gap-6" style={getTransformStyle()}>
          {loopItems.map((item, index) => (
            <div key={item.id || index} className="min-w-[240px] max-w-xs flex-shrink-0">
              {renderPromoItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPromoItem = (item, index) => {
    const IconComponent = getIcon(item.icon);
    const hasImage = !!item.image_url;

    const size = item.image_size || 'icon';
    const sizeClasses = {
      icon: 'w-16 h-16',
      small: 'w-20 h-20',
      medium: 'w-28 h-28',
      large: 'w-40 h-40',
      original: 'w-auto h-auto',
    };
    const wrapperSizeClass = sizeClasses[size] || sizeClasses.icon;

    const cardBase = 'bg-white p-6 rounded-xl text-left transition-all duration-300';
    const cardBorder = card_border_enabled ? ' border border-gray-100' : ' border border-transparent';
    const cardShadow = card_shadow_enabled ? ' hover:shadow-md' : '';

    const wrapperBg = image_background_enabled ? 'bg-[#00BAD3]/10' : 'bg-transparent';

    return (
      <div
        key={item.id || index}
        className={`${cardBase}${cardBorder}${cardShadow}`}
      >
        {hasImage ? (
          <div className={`mb-4 rounded-xl overflow-hidden flex items-center justify-center mx-auto ${wrapperBg} ${wrapperSizeClass}`}>
            <img
              src={getImageUrl(item.image_url)}
              alt={getText(item.title, lang) || 'Promo icon'}
              className={size === 'original' ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-contain'}
            />
          </div>
        ) : (
          item.icon && (
            <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center mx-auto ${wrapperBg}`}>
              <IconComponent className="h-6 w-6 text-[#00BAD3]" />
            </div>
          )
        )}

        {getText(item.title, lang) && (
          <h3 className="text-lg font-semibold text-[#0A1628] mb-2">
            {getText(item.title, lang)}
          </h3>
        )}
        {getText(item.description, lang) && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {getText(item.description, lang)}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="pt-10 md:pt-16 pb-4 md:pb-6 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-6">
          {getText(subheadline, lang) && (
            <span className="text-[#00D9FF] text-xs font-semibold tracking-wider uppercase block mb-2">
              {getText(subheadline, lang)}
            </span>
          )}
          {getText(headline, lang) && (
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] mb-3">
              {renderHighlightedHeadline(
                getText(headline, lang),
                getText(headline_highlight, lang),
                section.content?.headline_highlight_color || 'primary'
              )}
            </h2>
          )}
          {getText(section.content?.description, lang) && (
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              {getText(section.content.description, lang)}
            </p>
          )}
        </div>

        {image_url && (
          <div className="mb-10 flex justify-center">
            <img
              src={getImageUrl(image_url)}
              alt={getText(headline, lang) || 'Promo image'}
              className="rounded-xl shadow-lg max-w-full h-auto"
            />
          </div>
        )}

        {renderItems()}
      </div>
    </section>
  );
};

// Benefits Grid Component - supports columns option
export const BenefitsSection = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, subheadline, items = [], columns = 3, image_background_enabled = true, card_border_enabled = true, card_shadow_enabled = true } = section.content || {};
  const lang = currentLang || 'en';

  // Determine grid columns for desktop
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-2 md:grid-cols-4';
      case 5: return 'grid-cols-2 md:grid-cols-5';
      case 6: return 'grid-cols-2 md:grid-cols-6';
      case 7: return 'grid-cols-3 md:grid-cols-7';
      case 8: return 'grid-cols-3 md:grid-cols-8';
      case 9: return 'grid-cols-3 md:grid-cols-9';
      case 10: return 'grid-cols-4 md:grid-cols-10';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  const [startIndex, setStartIndex] = React.useState(0);
  const total = items.length;

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseCount = columns || 3;
  const visibleCount = Math.min(isMobile ? 1 : baseCount, total || 0) || 1;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < total;

  const goPrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const goNext = () => {
    if (!canNext) return;
    setStartIndex((prev) => Math.min(prev + visibleCount, total - visibleCount));
  };
  
  return (
    <section className="py-16 md:py-24 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          {getText(subheadline, lang) && (
            <span className="text-[#00D9FF] text-xs font-semibold tracking-wider uppercase">
              {getText(subheadline, lang)}
            </span>
          )}
          {getText(headline, lang) && (
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 text-[#0A1628]">
              {renderHighlightedHeadline(
                getText(headline, lang),
                getText(headline_highlight, lang),
                section.content?.headline_highlight_color || 'primary'
              )}
            </h2>
          )}
        </div>
        <div className="relative">
          {total > visibleCount && (
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`flex items-center justify-center absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canPrev ? 'hover:bg-[#00D9FF] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-6 w-6 rotate-90" />
            </button>
          )}

          {total > visibleCount && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`flex items-center justify-center absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canNext ? 'hover:bg-[#00D9FF] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-6 w-6 -rotate-90" />
            </button>
          )}

          <div className={`grid ${getGridCols()} gap-8`}>
            {visibleItems.map((item, index) => {
              const IconComponent = getIcon(item.icon);
              const hasImage = !!item.image_url;
              const size = item.image_size || 'icon';

              const sizeClasses = {
                icon: 'w-16 h-16',
                small: 'w-20 h-20',
                medium: 'w-28 h-28',
                large: 'w-40 h-40',
                original: 'w-auto h-auto',
              };

              const wrapperSizeClass = sizeClasses[size] || sizeClasses.icon;

              const cardBase = 'bg-white p-8 rounded-xl text-center transition-all duration-300';
              const cardBorder = card_border_enabled ? ' border border-gray-100' : ' border border-transparent';
              const cardShadow = card_shadow_enabled ? ' hover:shadow-lg' : '';
              const wrapperBg = image_background_enabled ? 'bg-[#00BAD3]/10' : 'bg-transparent';

              return (
                <div
                  key={item.id || index}
                  className={`${cardBase}${cardBorder}${cardShadow}`}
                >
                  <div
                    className={`${wrapperBg} rounded-xl flex items-center justify-center mx-auto mb-6 overflow-hidden ${wrapperSizeClass}`}
                  >
                    {hasImage ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={getText(item.title, lang) || 'Benefit icon'}
                        className={size === 'original' ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-contain'}
                      />
                    ) : (
                      <IconComponent className="h-8 w-8 text-[#00BAD3]" />
                    )}
                  </div>
                  {getText(item.title, lang) && (
                    <h3 className="text-xl font-semibold font-heading text-[#0A1628] mb-3">
                      {getText(item.title, lang)}
                    </h3>
                  )}
                  {getText(item.description, lang) && (
                    <p className="text-gray-600 mb-3">{getText(item.description, lang)}</p>
                  )}
                  {item.link_url && (
                    <a
                      href={item.link_url}
                      className="text-[#00D9FF] text-sm font-medium hover:underline"
                    >
                      {getText(item.link_label, lang) || 'Learn more'}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination status removed as per design */}
      </div>
    </section>
  );
};

// CTA Section Component
export const CTASection = ({ section, currentLang }) => {
  const { headline, body, button_text, button_url, background_color, background_gradient } = section.content || {};
  const lang = currentLang || 'en';
  
  const baseBg = background_color === 'dark' ? 'from-[#0A1628]' 
    : background_color === 'primary' ? 'from-[#00D9FF]'
    : 'from-[#0A1628]';

  const bgClass = background_gradient
    ? `bg-gradient-to-b ${baseBg} to-white`
    : baseBg.replace('from-', 'bg-');

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">
            {getText(headline, lang)}
          </h2>
        )}
        {getText(body, lang) && (
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {getText(body, lang)}
          </p>
        )}
        {getText(button_text, lang) && (
          <Button 
            className="bg-[#00D9FF] hover:bg-[#00A399] text-white font-semibold py-6 px-10 rounded-lg text-lg"
            onClick={() => button_url && (window.location.href = button_url)}
          >
            {getText(button_text, lang)}
          </Button>
        )}
      </div>
    </section>
  );
};

// Testimonials Section Component
export const TestimonialsSection = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, subheadline, items = [], columns = 3, carousel_direction = 'right', transition_enabled = true, auto_scroll_enabled = false, image_background_enabled = true, card_border_enabled = true, card_shadow_enabled = true } = section.content || {};
  const lang = currentLang || 'en';

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const [startIndex, setStartIndex] = React.useState(0);
  const total = items.length;

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Auto scroll for testimonials
  React.useEffect(() => {
    if (!auto_scroll_enabled || total <= (isMobile ? 1 : columns)) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const visibleCount = isMobile ? 1 : columns;
        const next = carousel_direction === 'left' ? prev - visibleCount : prev + visibleCount;
        if (next < 0) return Math.max(total - visibleCount, 0);
        if (next >= total) return 0;
        return next;
      });
    }, 5000); // svakih 5s

    return () => clearInterval(interval);
  }, [auto_scroll_enabled, total, columns, isMobile, carousel_direction]);

  const baseCount = columns || 3;
  const visibleCount = Math.min(isMobile ? 1 : baseCount, total || 0) || 1;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < total;

  const goPrev = () => {
    if (!canPrev) return;
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const goNext = () => {
    if (!canNext) return;
    setStartIndex((prev) => Math.min(prev + visibleCount, total - visibleCount));
  };
  
  // Define card styling variables
  const cardBase = 'bg-white p-6 rounded-xl text-left transition-all duration-300';
  const cardBorder = card_border_enabled ? ' border border-gray-100' : ' border border-transparent';
  const cardShadow = card_shadow_enabled ? ' hover:shadow-md' : '';
  const wrapperBg = image_background_enabled ? 'bg-[#00BAD3]/10' : 'bg-transparent';

  // Function to get item size classes
  const getItemSizeClasses = (item) => {
    const size = item.image_size || 'icon';
    const sizeClasses = {
      icon: 'w-12 h-12',
      small: 'w-16 h-16',
      medium: 'w-20 h-20',
      large: 'w-24 h-24',
      original: 'w-auto h-auto',
    };
    return sizeClasses[size] || sizeClasses.icon;
  };
  return (
    <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] text-center mb-12">
            {renderHighlightedHeadline(
              getText(headline, lang),
              getText(headline_highlight, lang),
              section.content?.headline_highlight_color || 'primary'
            )}
          </h2>
        )}
        <div className="relative">
          {total > visibleCount && (
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`flex items-center justify-center absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canPrev ? 'hover:bg-[#00D9FF] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-6 w-6 rotate-90" />
            </button>
          )}

          {total > visibleCount && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`flex items-center justify-center absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canNext ? 'hover:bg-[#00D9FF] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-6 w-6 -rotate-90" />
            </button>
          )}

          <div className={`grid ${getGridCols()} gap-8`}>
            {visibleItems.map((item, index) => (
              <div
                key={item.id || index}
                className={`${cardBase}${cardBorder}${cardShadow}`}
              >
                <Quote className="h-8 w-8 text-[#00D9FF] mb-4" />
                {getText(item.quote, lang) && (
                  <p className="text-gray-600 mb-4 italic">&ldquo;{getText(item.quote, lang)}&rdquo;</p>
                )}
                <div className="flex items-center gap-3">
                  {item.image_url && (
                    <div className={`flex items-center justify-center rounded-full overflow-hidden ${wrapperBg} ${getItemSizeClasses(item)}`}>
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {item.author && (
                    <span className="font-semibold text-[#0A1628]">{item.author}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination status removed as per design */}
      </div>
    </section>
  );
};

// FAQ Section Component
export const FAQSection = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, body, button_text, button_url = '/contact', items = [] } = section.content || {};
  const lang = currentLang || 'en';

  const [openIndex, setOpenIndex] = React.useState(null);

  const ctaLabel = getText(button_text, lang) || 'Contact us';
  const introText = getText(body, lang) || "Can't find an answer to your question? Feel free to contact us, we'll help you asap.";

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#050816] via-[#020617] to-[#020617]" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] gap-10 md:gap-16 items-start">
          {/* Left column - intro + CTA */}
          <div className="space-y-4 max-w-md">
            {getText(headline, lang) && (
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
                {renderHighlightedHeadline(
                  getText(headline, lang),
                  getText(headline_highlight, lang),
                  headline_highlight_color || 'primary'
                )}
              </h2>
            )}
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {introText}
            </p>
            <Button
              type="button"
              className="mt-4 inline-flex items-center rounded-full bg-[#00D9FF] hover:bg-[#00BAD3] text-slate-900 font-semibold px-5 py-2.5 text-sm shadow-lg shadow-cyan-500/30"
              asChild
            >
              <a href={button_url}>{ctaLabel}</a>
            </Button>
          </div>

          {/* Right column - accordion */}
          <div className="space-y-3">
            {(items || []).map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id || index}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full px-5 py-4 text-left flex justify-between items-center"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className={`text-sm md:text-base font-medium transition-colors ${
                      isOpen ? 'text-[#00D9FF]' : 'text-white'
                    }`}>
                      {getText(item.question, lang)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#00D9FF]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-300" />
                    )}
                  </button>
                  {isOpen && getText(item.answer, lang) && (
                    <div className="px-5 pb-5 pt-0 text-sm text-gray-200 border-t border-white/10">
                      {getText(item.answer, lang)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Gallery Section Component
export const GallerySection = ({ section, currentLang }) => {
  const { headline, headline_highlight, headline_highlight_color, images } = section.content || {};
  const lang = currentLang || 'en';
  
  return (
    <section className="py-16 md:py-24 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] text-center mb-12">
            {renderHighlightedHeadline(
              getText(headline, lang),
              getText(headline_highlight, lang),
              section.content?.headline_highlight_color || 'primary'
            )}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(images || []).map((img, index) => (
            <div key={img.id || index} className="overflow-hidden rounded-xl">
              <img 
                src={getImageUrl(img.image_url)} 
                alt={getText(img.title, lang) || `Image ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Custom HTML Section Component
export const CustomHTMLSection = ({ section, currentLang }) => {
  const { html_content, use_raw_code, raw_code, max_width, alignment } = section.content || {};
  const lang = currentLang || 'en';
  
  // Decide which content to render: raw_code (if use_raw_code is true) or html_content
  const contentToRender = use_raw_code 
    ? getText(raw_code, lang) 
    : getText(html_content, lang);
  
  if (!contentToRender) return null;

  // Determine alignment class
  const alignmentClass = {
    'left': 'mr-auto',
    'center': 'mx-auto',
    'right': 'ml-auto'
  }[alignment || 'center'];
  
  return (
    <section className="py-16 md:py-24" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div 
          className={`${use_raw_code ? "w-full" : "prose prose-lg max-w-none"} ${alignmentClass}`}
          style={{ maxWidth: max_width || '100%' }}
          dangerouslySetInnerHTML={{ __html: contentToRender }}
        />
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = ({ section, currentLang }) => {
  const { content } = section;
  const lang = currentLang || 'en';
  
  const {
    headline,
    headline_highlight,
    headline_highlight_color = 'primary',
    subheadline,
    tabs = [],
    plans = [],
    background_color = 'white'
  } = content || {};

  const [activeTab, setActiveTab] = React.useState(0);
  
  const bgClass = background_color === 'dark' 
    ? 'bg-[#1a1a2e] text-white' 
    : background_color === 'primary'
    ? 'bg-[#00D9FF] text-white'
    : 'bg-white text-gray-900';

  // Get plans for active tab
  const currentPlans = tabs.length > 0 && tabs[activeTab]?.plans 
    ? tabs[activeTab].plans 
    : plans;

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {getText(subheadline, lang) && (
            <span className="text-[#00D9FF] text-xs md:text-sm font-semibold tracking-wider uppercase block mb-4">
              {getText(subheadline, lang)}
            </span>
          )}
          {getText(headline, lang) && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {renderHighlightedHeadline(getText(headline, lang), getText(headline_highlight, lang), headline_highlight_color)}
            </h2>
          )}
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === idx 
                      ? 'bg-[#00D9FF] text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {getText(tab.label, lang)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className={`grid gap-6 ${
          currentPlans.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          currentPlans.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
          currentPlans.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {currentPlans.map((plan, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 ${
                plan.featured 
                  ? 'bg-[#1a1a2e] text-white ring-2 ring-[#00D9FF]' 
                  : 'bg-white text-gray-900 shadow-lg'
              }`}
            >
              {/* Plan Icon/Image */}
              {plan.icon && (
                <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center mb-4">
                  {React.createElement(getIcon(plan.icon), { className: 'w-6 h-6 text-[#00D9FF]' })}
                </div>
              )}
              
              {/* Plan Name */}
              <h3 className="text-xl font-bold mb-2">{getText(plan.name, lang)}</h3>
              
              {/* Plan Description */}
              {getText(plan.description, lang) && (
                <p className={`text-sm mb-4 ${plan.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getText(plan.description, lang)}
                </p>
              )}
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.currency || '€'}{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.featured ? 'text-gray-300' : 'text-gray-500'}`}>
                    /{getText(plan.period, lang) || 'month'}
                  </span>
                )}
                {plan.unit && (
                  <span className={`text-sm block ${plan.featured ? 'text-gray-300' : 'text-gray-500'}`}>
                    {getText(plan.unit, lang)}
                  </span>
                )}
              </div>
              
              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${plan.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getText(feature, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              
              {/* CTA Button */}
              {plan.button_text && (
                <Button 
                  className={`w-full ${
                    plan.featured 
                      ? 'bg-[#00D9FF] hover:bg-[#00a89d] text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  asChild
                >
                  <a href={plan.button_url || '/contact'}>
                    {getText(plan.button_text, lang)}
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Section Renderer Component
export const SectionRenderer = ({ section, currentLang, feature, t }) => {
  if (section.visible === false) return null;
  
  const props = { section, currentLang, feature, t };
  
  switch (section.section_type) {
    case 'hero':
      return <HeroSection {...props} />;
    case 'hero_2':
      return <Hero2Section {...props} />;
    case 'hero_3':
      return <Hero3Section {...props} />;
    case 'content':
      return <ContentSection {...props} />;
    case 'features_list':
      return <FeaturesListSection {...props} />;
    case 'benefits':
      return <BenefitsSection {...props} />;
    case 'cta':
      return <CTASection {...props} />;
    case 'testimonials':
      return <TestimonialsSection {...props} />;
    case 'faq':
      return <FAQSection {...props} />;
    case 'gallery':
      return <GallerySection {...props} />;
    case 'promo_grid':
      return <PromoGridSection {...props} />;
    case 'custom_html':
      return <CustomHTMLSection {...props} />;
    case 'pricing':
      return <PricingSection {...props} />;
    default:
      return <ContentSection {...props} />;
  }
};

export default SectionRenderer;
