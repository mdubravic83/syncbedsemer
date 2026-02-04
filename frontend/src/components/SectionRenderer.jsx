import React from 'react';
import { Check, ArrowRight, Calendar, Users, Globe, Zap, RefreshCw, Shield, BarChart, Clock, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

// Icon mapping for dynamic icon rendering
const ICONS = {
  Check, ArrowRight, Calendar, Users, Globe, Zap, RefreshCw, Shield, BarChart, Clock, Quote, ChevronDown, ChevronUp
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

// Hero Section Component
export const HeroSection = ({ section, currentLang, feature, t }) => {
  const { headline, subheadline, body, button_text, button_url, image_url, background_color } = section.content || {};
  const lang = currentLang || 'en';
  
  const bgClass = background_color === 'dark' ? 'bg-[#0A1628] text-white' 
    : background_color === 'primary' ? 'bg-[#00BFB3] text-white'
    : background_color === 'light' ? 'bg-gray-100'
    : 'bg-white';

  return (
    <section className={`py-16 md:py-24 ${bgClass}`} data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {getText(subheadline, lang) && (
              <span className="inline-block text-[#00BFB3] text-xs md:text-sm font-semibold tracking-wider uppercase">
                {getText(subheadline, lang)}
              </span>
            )}
            {getText(headline, lang) && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                {getText(headline, lang)}
              </h1>
            )}
            {getText(body, lang) && (
              <p className={`text-base md:text-lg max-w-lg ${background_color === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {getText(body, lang)}
              </p>
            )}
            {getText(button_text, lang) && (
              <Button 
                className="bg-[#00BFB3] hover:bg-[#00A399] text-white font-semibold py-6 px-8 rounded-lg text-base"
                onClick={() => button_url && (window.location.href = button_url)}
              >
                {getText(button_text, lang)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
          {(image_url || feature?.image) && (
            <div className="relative">
              <div className="bg-gradient-to-br from-[#112240] to-[#0A1628] rounded-2xl p-4 shadow-2xl">
                <img 
                  src={image_url || feature?.image} 
                  alt={getText(headline, lang) || 'Hero image'}
                  className="rounded-xl w-full"
                />
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
  const { headline, body, html_content, image_url, image_position } = section.content || {};
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
                {getText(headline, lang)}
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
          <div className="w-12 h-12 bg-[#00BFB3]/10 rounded-xl flex items-center justify-center mb-4">
            <IconComponent className="h-6 w-6 text-[#00BFB3]" />
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
        <div className="w-8 h-8 bg-[#00BFB3] rounded-full flex items-center justify-center flex-shrink-0">
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
                src={image_url} 
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
                src={image_url} 
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

// Benefits Grid Component - supports columns option
export const BenefitsSection = ({ section, currentLang }) => {
  const { headline, subheadline, items = [], columns = 3 } = section.content || {};
  const lang = currentLang || 'en';

  // Determine grid columns for desktop
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  const [startIndex, setStartIndex] = React.useState(0);
  const total = items.length;
  const visibleCount = Math.min(columns || 3, total || 0) || 1;
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
            <span className="text-[#00BFB3] text-xs font-semibold tracking-wider uppercase">
              {getText(subheadline, lang)}
            </span>
          )}
          {getText(headline, lang) && (
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 text-[#0A1628]">
              {getText(headline, lang)}
            </h2>
          )}
        </div>
        <div className="relative">
          {total > visibleCount && (
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canPrev ? 'hover:bg-[#00BFB3] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
          )}

          {total > visibleCount && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canNext ? 'hover:bg-[#00BFB3] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
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

            return (
              <div
                key={item.id || index}
                className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div
                  className={`bg-[#00BFB3]/10 rounded-xl flex items-center justify-center mx-auto mb-6 overflow-hidden ${wrapperSizeClass}`}
                >
                  {hasImage ? (
                    <img
                      src={item.image_url}
                      alt={getText(item.title, lang) || 'Benefit icon'}
                      className={size === 'original' ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-contain'}
                    />
                  ) : (
                    <IconComponent className="h-8 w-8 text-[#00BFB3]" />
                  )}
                </div>
                {getText(item.title, lang) && (
                  <h3 className="text-xl font-semibold font-heading text-[#0A1628] mb-3">
                    {getText(item.title, lang)}
                  </h3>
                )}
                {getText(item.description, lang) && (
                  <p className="text-gray-600">{getText(item.description, lang)}</p>
                )}
              </div>
            );
          })}
          </div>
        </div>

        {total > visibleCount && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`px-3 py-1 text-sm rounded border ${canPrev ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">
              {startIndex + 1}–{Math.min(startIndex + visibleCount, total)} of {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`px-3 py-1 text-sm rounded border ${canNext ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// CTA Section Component
export const CTASection = ({ section, currentLang }) => {
  const { headline, body, button_text, button_url, background_color } = section.content || {};
  const lang = currentLang || 'en';
  
  const bgClass = background_color === 'dark' ? 'bg-[#0A1628]' 
    : background_color === 'primary' ? 'bg-[#00BFB3]'
    : 'bg-[#0A1628]';

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
            className="bg-[#00BFB3] hover:bg-[#00A399] text-white font-semibold py-6 px-10 rounded-lg text-lg"
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
  const { headline, items = [], columns = 3 } = section.content || {};
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
  const visibleCount = Math.min(columns || 3, total || 0) || 1;
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
    <section className="py-16 md:py-24 bg-[#F8FAFB]" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] text-center mb-12">
            {getText(headline, lang)}
          </h2>
        )}
        <div className="relative">
          {total > visibleCount && (
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canPrev ? 'hover:bg-[#00BFB3] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
          )}

          {total > visibleCount && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border shadow-md bg-white text-[#0A1628] transition-colors ${
                canNext ? 'hover:bg-[#00BFB3] hover:text-white' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          )}

          <div className={`grid ${getGridCols()} gap-8`}>
          {visibleItems.map((item, index) => (
            <div key={item.id || index} className="bg-white p-6 rounded-xl shadow-sm">
              <Quote className="h-8 w-8 text-[#00BFB3] mb-4" />
              {getText(item.quote, lang) && (
                <p className="text-gray-600 mb-4 italic">&ldquo;{getText(item.quote, lang)}&rdquo;</p>
              )}
              <div className="flex items-center gap-3">
                {item.image_url && (
                  <img src={item.image_url} alt={item.author} className="w-10 h-10 rounded-full" />
                )}
                {item.author && (
                  <span className="font-semibold text-[#0A1628]">{item.author}</span>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>

        {total > visibleCount && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={`px-3 py-1 text-sm rounded border ${canPrev ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">
              {startIndex + 1}–{Math.min(startIndex + visibleCount, total)} of {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`px-3 py-1 text-sm rounded border ${canNext ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// FAQ Section Component
export const FAQSection = ({ section, currentLang }) => {
  const { headline, items } = section.content || {};
  const [openIndex, setOpenIndex] = React.useState(null);
  const lang = currentLang || 'en';
  
  return (
    <section className="py-16 md:py-24 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] text-center mb-12">
            {getText(headline, lang)}
          </h2>
        )}
        <div className="space-y-4">
          {(items || []).map((item, index) => (
            <div key={item.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full p-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-[#0A1628]">{getText(item.question, lang)}</span>
                {openIndex === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {openIndex === index && getText(item.answer, lang) && (
                <div className="p-4 text-gray-600">
                  {getText(item.answer, lang)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Section Component
export const GallerySection = ({ section, currentLang }) => {
  const { headline, images } = section.content || {};
  const lang = currentLang || 'en';
  
  return (
    <section className="py-16 md:py-24 bg-white" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        {getText(headline, lang) && (
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#0A1628] text-center mb-12">
            {getText(headline, lang)}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(images || []).map((img, index) => (
            <div key={img.id || index} className="overflow-hidden rounded-xl">
              <img 
                src={img.image_url} 
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
  const { html_content } = section.content || {};
  const lang = currentLang || 'en';
  
  if (!getText(html_content, lang)) return null;
  
  return (
    <section className="py-16 md:py-24" data-testid={`section-${section.id}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: getText(html_content, lang) }}
        />
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
    case 'custom_html':
      return <CustomHTMLSection {...props} />;
    default:
      return <ContentSection {...props} />;
  }
};

export default SectionRenderer;
