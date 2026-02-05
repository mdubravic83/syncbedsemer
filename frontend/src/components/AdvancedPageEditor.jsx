import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { cmsApi } from '../services/api';
import { toast } from 'sonner';
import { RichTextEditor } from './RichTextEditor';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Available section types with their schemas
const SECTION_TYPES = {
  hero: {
    label: 'Hero Section',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'subheadline', 'body', 'button_text', 'button_url', 'image_url', 'background_color', 'background_gradient']
  },
  hero_2: {
    label: 'Hero Section (Image Below)',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'subheadline', 'body', 'button_text', 'button_url', 'secondary_button_text', 'secondary_button_url', 'image_url', 'background_color']
  },
  hero_3: {
    label: 'Hero Section (Video & Overlap)',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'subheadline', 'body', 'button_text', 'button_url', 'secondary_button_text', 'secondary_button_url', 'image_url', 'background_color', 'background_gradient']
  },
  content: {
    label: 'Content Block',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'body', 'html_content', 'image_url', 'image_position']
  },
  features_list: {
    label: 'Features List',
    fields: ['headline', 'subheadline', 'items', 'image_url', 'columns', 'layout']
  },
  benefits: {
    label: 'Benefits Grid',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'subheadline', 'items', 'columns', 'carousel_direction', 'transition_enabled']
  },
  cta: {
    label: 'Call to Action',
    fields: ['headline', 'body', 'button_text', 'button_url', 'background_color']
  },
  gallery: {
    label: 'Image Gallery',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'images', 'columns']
  },
  promo_grid: {
    label: 'Promo Grid',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'subheadline', 'columns', 'items']
  },
  testimonials: {
    label: 'Testimonials',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'items', 'columns', 'carousel_direction', 'transition_enabled']
  },
  faq: {
    label: 'FAQ Section',
    fields: ['headline', 'headline_highlight', 'headline_highlight_color', 'items']
  },
  custom_html: {
    label: 'Custom HTML',
    fields: ['html_content']
  }
};

const HIGHLIGHT_COLOR_OPTIONS = [
  { value: 'primary', label: 'Primary (turquoise)', hex: '#00BFB3' },
  { value: 'primary-dark', label: 'Primary Dark', hex: '#00A0D3' },
  { value: 'primary-100', label: 'Primary 100', hex: '#00D8FF' },
  { value: 'grey-100', label: 'Grey 100', hex: '#25252E' },
  { value: 'info', label: 'Information', hex: '#297AF4' },
];


const LanguageTabs = ({ currentLang, onChange }) => {
  const languages = ['en', 'hr', 'de'];
  return (
    <div className="flex gap-1 mb-2">
      {languages.map(lang => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-2 py-1 text-xs font-medium rounded ${
            currentLang === lang 
              ? 'bg-[#00BFB3] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const MultiLangInput = ({ label, value, onChange, currentLang, type = 'input', placeholder = '' }) => {
  const InputComponent = type === 'textarea' ? Textarea : Input;
  
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <InputComponent
        value={value?.[currentLang] || ''}
        onChange={(e) => onChange({ ...value, [currentLang]: e.target.value })}
        placeholder={placeholder}
        className="text-sm"
        rows={type === 'textarea' ? 3 : undefined}
      />
    </div>
  );
};

const ImageField = ({ label, value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error('Image upload failed', err);
      // TODO: hook into toast if available
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload..."
            className="text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs"
            data-testid="image-upload-input"
          />
          {isUploading && (
            <span className="text-xs text-gray-500">Uploading...</span>
          )}
        </div>
      </div>
      {value && (
        <img src={value} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
      )}
    </div>
  );
};

const ItemsEditor = ({ items = [], onChange, itemFields = ['title', 'description', 'icon'] }) => {
  const [currentLang, setCurrentLang] = useState('en');
  
  const addItem = () => {
    const newItem = { id: Date.now().toString() };
    itemFields.forEach(field => {
      if (field === 'icon') {
        newItem[field] = 'Check';
      } else if (['title', 'description', 'quote', 'question', 'answer'].includes(field)) {
        newItem[field] = { en: '', hr: '', de: '' };
      } else {
        newItem[field] = '';
      }
    });
    onChange([...items, newItem]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-medium text-gray-600">Items ({items.length})</Label>
        <LanguageTabs currentLang={currentLang} onChange={setCurrentLang} />
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {items.map((item, index) => (
          <div key={item.id || index} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
              <div className="flex gap-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {itemFields.includes('title') && (
              <Input
                value={item.title?.[currentLang] || ''}
                onChange={(e) => updateItem(index, 'title', { ...item.title, [currentLang]: e.target.value })}
                placeholder="Title"
                className="text-sm"
              />
            )}
            {itemFields.includes('description') && (
              <Textarea
                value={item.description?.[currentLang] || ''}
                onChange={(e) => updateItem(index, 'description', { ...item.description, [currentLang]: e.target.value })}
                placeholder="Description"
                rows={2}
                className="text-sm"
              />
            )}
            {itemFields.includes('icon') && (
              <select
                value={item.icon || 'Check'}
                onChange={(e) => updateItem(index, 'icon', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value="Check">✓ Check</option>
                <option value="Globe">🌐 Globe</option>
                <option value="Users">👥 Users</option>
                <option value="Zap">⚡ Zap</option>
                <option value="Shield">🛡 Shield</option>
                <option value="BarChart">📊 BarChart</option>
                <option value="RefreshCw">🔄 RefreshCw</option>
                <option value="Clock">🕐 Clock</option>
                <option value="Calendar">📅 Calendar</option>
                <option value="ArrowRight">→ Arrow</option>
              </select>
            )}
            {itemFields.includes('image_url') && (
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">Item Image</Label>
                <div className="flex flex-col gap-1">
                  <Input
                    value={item.image_url || ''}
                    onChange={(e) => updateItem(index, 'image_url', e.target.value)}
                    placeholder="Image URL or upload..."
                    className="text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/media/upload`, {
                          method: 'POST',
                          body: formData,
                        });
                        if (!response.ok) throw new Error('Upload failed');
                        const data = await response.json();
                        if (data.url) {
                          updateItem(index, 'image_url', data.url);
                        }
                      } catch (err) {
                        console.error('Item image upload failed', err);
                      }
                    }}
                  />
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt="Item preview"
                      className="w-full h-20 object-cover rounded-md mt-1"
                    />
                  )}
                </div>
              </div>
            )}

            {itemFields.includes('image_size') && (
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">Image size</Label>
                <select
                  value={item.image_size || 'icon'}
                  onChange={(e) => updateItem(index, 'image_size', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md p-2"
                >
                  <option value="icon">Icon (small square)</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="original">Original (auto)</option>
                </select>
              </div>
            )}
            {itemFields.includes('quote') && (
              <Textarea
                value={item.quote?.[currentLang] || ''}
                onChange={(e) => updateItem(index, 'quote', { ...item.quote, [currentLang]: e.target.value })}
                placeholder="Quote text"
                rows={2}
                className="text-sm"
              />
            )}
            {itemFields.includes('author') && (
              <Input
                value={item.author || ''}
                onChange={(e) => updateItem(index, 'author', e.target.value)}
                placeholder="Author name"
                className="text-sm"
              />
            )}
            {itemFields.includes('question') && (
              <Input
                value={item.question?.[currentLang] || ''}
                onChange={(e) => updateItem(index, 'question', { ...item.question, [currentLang]: e.target.value })}
                placeholder="Question"
                className="text-sm"
              />
            )}
            {itemFields.includes('answer') && (
              <Textarea
                value={item.answer?.[currentLang] || ''}
                onChange={(e) => updateItem(index, 'answer', { ...item.answer, [currentLang]: e.target.value })}
                placeholder="Answer"
                rows={2}
                className="text-sm"
              />
            )}
          </div>
        ))}
      </div>
      
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="h-3 w-3 mr-1" /> Add Item
      </Button>
    </div>
  );
};

// Helper to create initial content for a section type
const createInitialContent = (sectionType) => {
  const typeConfig = SECTION_TYPES[sectionType];
  if (!typeConfig) return {};
  
  const content = {};
  
  typeConfig.fields.forEach(field => {
    switch(field) {
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
      case 'html_content':
        content[field] = { en: '', hr: '', de: '' };
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

// Sortable Section Item for Drag and Drop
const SortableSectionItem = ({ section, index, onChange, onRemove, totalSections, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {React.cloneElement(children, { dragListeners: listeners })}
    </div>
  );
};

const SectionEditor = ({ section, index, onChange, onRemove, onMove, totalSections, dragListeners }) => {
  const [expanded, setExpanded] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const sectionType = SECTION_TYPES[section.section_type] || SECTION_TYPES.content;
  
  const updateContent = (field, value) => {
    const newContent = {
      ...(section.content || {}),
      [field]: value
    };
    onChange({
      ...section,
      content: newContent
    });
  };

  // Handle section type change - reinitialize content
  const handleTypeChange = (newType) => {
    const newContent = createInitialContent(newType);
    // Preserve existing values if they exist in new type
    const typeConfig = SECTION_TYPES[newType];
    if (typeConfig && section.content) {
      typeConfig.fields.forEach(field => {
        if (section.content[field] !== undefined) {
          newContent[field] = section.content[field];
        }
      });
    }
    onChange({
      ...section,
      section_type: newType,
      content: newContent
    });
  };

  const getItemFields = () => {
    switch (section.section_type) {
      case 'testimonials':
        return ['quote', 'author', 'image_url'];
      case 'faq':
        return ['question', 'answer'];
      case 'benefits':
        // U benefits gridu želimo i ikonu i opcionalnu custom sliku + kontrolu veličine slike
        return ['title', 'description', 'icon', 'image_url', 'image_size'];
      case 'promo_grid':
        // U promo gridu želimo imati mogućnost custom ikona/slika (npr. logotipi "Trusted by")
        return ['title', 'description', 'icon', 'image_url', 'image_size'];
      default:
        return ['title', 'description', 'icon'];
    }
  };


  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div {...dragListeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <span className="text-sm font-medium">{sectionType.label}</span>
          <span className="text-xs text-gray-500">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); onChange({ ...section, visible: !section.visible }); }}
            className="h-7 w-7 p-0"
          >
            {section.visible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Section Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Section Type Selector */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600">Section Type</Label>
            <select
              value={section.section_type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md p-2"
            >
              {Object.entries(SECTION_TYPES).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Language Tabs for multi-lang fields */}
          <LanguageTabs currentLang={currentLang} onChange={setCurrentLang} />

          {/* Dynamic Fields based on section type */}
          {sectionType.fields.includes('headline') && (
            <MultiLangInput
              label="Headline"
              value={section.content?.headline}
              onChange={(v) => updateContent('headline', v)}
              currentLang={currentLang}
              placeholder="Enter headline..."
            />
          )}

          {sectionType.fields.includes('headline_highlight') && (
            <MultiLangInput
              label="Headline Highlighted Words"
              value={section.content?.headline_highlight}
              onChange={(v) => updateContent('headline_highlight', v)}
              currentLang={currentLang}
              placeholder="Words to highlight (optional)"
            />
          )}

          {sectionType.fields.includes('headline_highlight_color') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Highlight color</Label>
              <select
                value={section.content?.headline_highlight_color || 'primary'}
                onChange={(e) => updateContent('headline_highlight_color', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                {HIGHLIGHT_COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.hex})
                  </option>
                ))}
              </select>
            </div>
          )}

          {sectionType.fields.includes('subheadline') && (
            <MultiLangInput
              label="Subheadline"
              value={section.content?.subheadline}
              onChange={(v) => updateContent('subheadline', v)}
              currentLang={currentLang}
              placeholder="Enter subheadline..."
            />
          )}

          {sectionType.fields.includes('body') && (
            <MultiLangInput
              label="Body Text"
              value={section.content?.body}
              onChange={(v) => updateContent('body', v)}
              currentLang={currentLang}
              type="textarea"
              placeholder="Enter body text..."
            />
          )}

          {sectionType.fields.includes('button_text') && (
            <MultiLangInput
              label="Primary Button Text"
              value={section.content?.button_text}
              onChange={(v) => updateContent('button_text', v)}
              currentLang={currentLang}
              placeholder="Enter primary button text..."
            />
          )}

          {sectionType.fields.includes('button_url') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Primary Button URL</Label>
              <Input
                value={section.content?.button_url || ''}
                onChange={(e) => updateContent('button_url', e.target.value)}
                placeholder="/contact or full URL"
                className="text-sm"
              />
            </div>
          )}

          {sectionType.fields.includes('secondary_button_text') && (
            <MultiLangInput
              label="Secondary Button Text (e.g. Watch video)"
              value={section.content?.secondary_button_text}
              onChange={(v) => updateContent('secondary_button_text', v)}
              currentLang={currentLang}
              placeholder="Enter secondary button text..."
            />
          )}

          {sectionType.fields.includes('secondary_button_url') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Secondary Button URL</Label>
              <Input
                value={section.content?.secondary_button_url || ''}
                onChange={(e) => updateContent('secondary_button_url', e.target.value)}
                placeholder="Video URL or page path"
                className="text-sm"
              />
            </div>
          )}

          {sectionType.fields.includes('html_content') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">HTML Content ({currentLang.toUpperCase()})</Label>
              <RichTextEditor
                content={section.content?.html_content?.[currentLang] || ''}
                onChange={(html) => updateContent('html_content', { 
                  ...section.content?.html_content, 
                  [currentLang]: html 
                })}
                placeholder="Enter rich content..."
                minHeight="200px"
              />
            </div>
          )}

          {sectionType.fields.includes('button_text') && (
            <MultiLangInput
              label="Button Text"
              value={section.content?.button_text}
              onChange={(v) => updateContent('button_text', v)}
              currentLang={currentLang}
              placeholder="Button label..."
            />
          )}

          {sectionType.fields.includes('button_url') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Button URL</Label>
              <Input
                value={section.content?.button_url || ''}
                onChange={(e) => updateContent('button_url', e.target.value)}
                placeholder="/contact or https://..."
                className="text-sm"
              />
            </div>
          )}

          {sectionType.fields.includes('image_url') && (
            <ImageField
              label="Featured Image"
              value={section.content?.image_url}
              onChange={(v) => updateContent('image_url', v)}
            />
          )}

          {sectionType.fields.includes('image_position') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Image Position</Label>
              <select
                value={section.content?.image_position || 'right'}
                onChange={(e) => updateContent('image_position', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="background">Background</option>
              </select>
            </div>
          )}

          {sectionType.fields.includes('background_color') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Background</Label>
              <select
                value={section.content?.background_color || 'white'}
                onChange={(e) => updateContent('background_color', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value="white">White</option>
                <option value="light">Light Gray</option>
                <option value="dark">Dark (Navy)</option>
                <option value="primary">Primary (Teal)</option>
              </select>
            </div>
          )}

          {sectionType.fields.includes('background_gradient') && (
            <div className="flex items-center gap-2">
              <input
                id={`bg-gradient-${section.id}`}
                type="checkbox"
                checked={Boolean(section.content?.background_gradient)}
                onChange={(e) => updateContent('background_gradient', e.target.checked)}
              />
              <Label
                htmlFor={`bg-gradient-${section.id}`}
                className="text-xs font-medium text-gray-600 cursor-pointer"
              >
                Use vertical gradient to white below
              </Label>
            </div>
          )}

          {/* Columns selector for features_list, benefits, testimonials, gallery */}
          {sectionType.fields.includes('columns') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Number of Columns (desktop)</Label>
              <select
                value={section.content?.columns || 2}
                onChange={(e) => updateContent('columns', parseInt(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          )}

          {/* Carousel settings for benefits & testimonials */}
          {sectionType.fields.includes('carousel_direction') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Carousel Direction</Label>
              <select
                value={section.content?.carousel_direction || 'right'}
                onChange={(e) => updateContent('carousel_direction', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value="right">Right (Next moves content left)</option>
                <option value="left">Left (Next moves content right)</option>
              </select>
            </div>
          )}

          {sectionType.fields.includes('transition_enabled') && (
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-600">Enable slide transition</Label>
              <input
                type="checkbox"
                checked={section.content?.transition_enabled ?? true}
                onChange={(e) => updateContent('transition_enabled', e.target.checked)}
              />
            </div>
          )}

          {/* Layout selector for features_list */}
          {sectionType.fields.includes('layout') && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">Layout Style</Label>
              <select
                value={section.content?.layout || 'list-with-image'}
                onChange={(e) => updateContent('layout', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md p-2"
              >
                <option value="list-with-image">List with Image (side by side)</option>
                <option value="grid">Grid Only (no side image)</option>
                <option value="list-only">List Only (single column)</option>
                <option value="cards">Feature Cards</option>
              </select>
            </div>
          )}

          {sectionType.fields.includes('items') && (
            <ItemsEditor
              items={section.content?.items || []}
              onChange={(items) => updateContent('items', items)}
              itemFields={getItemFields()}
            />
          )}

          {sectionType.fields.includes('images') && (
            <ItemsEditor
              items={section.content?.images || []}
              onChange={(images) => updateContent('images', images)}
              itemFields={['image_url', 'title']}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const AdvancedPageEditor = ({ page, onClose, onSaved, activeSectionId }) => {
  const { i18n } = useTranslation();
  const [editedPage, setEditedPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (page) {
      // Deep clone and ensure sections is an array with proper IDs
      const clonedPage = JSON.parse(JSON.stringify(page));
      if (!Array.isArray(clonedPage.sections)) {
        clonedPage.sections = [];
      }
      // Ensure all sections have IDs
      clonedPage.sections = clonedPage.sections.map((s, i) => ({
        ...s,
        id: s.id || `section-${Date.now()}-${i}`
      }));
      setEditedPage(clonedPage);
    }
  }, [page]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setEditedPage(prev => {
        if (!prev) return prev;
        const oldIndex = prev.sections.findIndex(s => s.id === active.id);
        const newIndex = prev.sections.findIndex(s => s.id === over.id);
        
        const newSections = arrayMove(prev.sections, oldIndex, newIndex);
        // Update order values
        newSections.forEach((s, i) => s.order = i);
        
        return { ...prev, sections: newSections };
      });
    }
  };

  const handleSave = async () => {
    if (!editedPage) return;
    setSaving(true);
    try {
      // Ensure all sections have proper structure before saving
      const sectionsToSave = (editedPage.sections || []).map((section, idx) => ({
        id: section.id || Date.now().toString() + idx,
        section_type: section.section_type || 'content',
        order: section.order ?? idx,
        visible: section.visible !== false,
        content: section.content || {}
      }));
      
      console.log('Saving sections:', sectionsToSave);
      
      const updated = await cmsApi.updatePage(editedPage.id, {
        title: editedPage.title,
        meta_description: editedPage.meta_description,
        sections: sectionsToSave
      });
      toast.success('Page saved successfully!');
      onSaved?.(updated);
    } catch (error) {
      toast.error('Failed to save page');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (index, updatedSection) => {
    setEditedPage(prev => {
      if (!prev) return prev;
      const newSections = [...(prev.sections || [])];
      newSections[index] = updatedSection;
      return { ...prev, sections: newSections };
    });
  };

  const removeSection = (index) => {
    setEditedPage(prev => {
      if (!prev) return prev;
      const newSections = (prev.sections || []).filter((_, i) => i !== index);
      // Reorder
      newSections.forEach((s, i) => s.order = i);
      return { ...prev, sections: newSections };
    });
  };

  const moveSection = (index, direction) => {
    setEditedPage(prev => {
      if (!prev) return prev;
      const newSections = [...(prev.sections || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newSections.length) return prev;
      
      // Swap
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      // Update order
      newSections.forEach((s, i) => s.order = i);
      return { ...prev, sections: newSections };
    });
  };

  const addSection = (type = 'content') => {
    setEditedPage(prev => {
      if (!prev) return prev;
      const newSection = {
        id: `section-${Date.now()}`,
        section_type: type,
        order: (prev.sections?.length || 0),
        visible: true,
        content: createInitialContent(type)
      };
      return { 
        ...prev, 
        sections: [...(prev.sections || []), newSection] 
      };
    });
  };

  if (!editedPage) return null;

  const sortedSections = [...(editedPage.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold">Page Editor</h2>
          <p className="text-xs text-gray-500">/{editedPage.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00BFB3] hover:bg-[#00A399]"
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Meta */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700">Page Settings</h3>
          <LanguageTabs currentLang={currentLang} onChange={setCurrentLang} />
          
          <MultiLangInput
            label="Page Title"
            value={editedPage.title}
            onChange={(v) => setEditedPage({ ...editedPage, title: v })}
            currentLang={currentLang}
            placeholder="Page title..."
          />
          
          <MultiLangInput
            label="Meta Description (SEO)"
            value={editedPage.meta_description}
            onChange={(v) => setEditedPage({ ...editedPage, meta_description: v })}
            currentLang={currentLang}
            type="textarea"
            placeholder="Description for search engines..."
          />
        </div>

        {/* Sections with Drag and Drop */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Sections ({editedPage.sections?.length || 0})
            </h3>
            <span className="text-xs text-gray-500">Drag to reorder</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map((section, index) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  totalSections={sortedSections.length}
                  onChange={(updated) => {
                    const actualIndex = editedPage.sections.findIndex(s => s.id === section.id);
                    updateSection(actualIndex, updated);
                  }}
                  onRemove={() => {
                    const actualIndex = editedPage.sections.findIndex(s => s.id === section.id);
                    removeSection(actualIndex);
                  }}
                >
                  <SectionEditor
                    section={section}
                    index={index}
                    totalSections={sortedSections.length}
                    onChange={(updated) => {
                      const actualIndex = editedPage.sections.findIndex(s => s.id === section.id);
                      updateSection(actualIndex, updated);
                    }}
                    onRemove={() => {
                      const actualIndex = editedPage.sections.findIndex(s => s.id === section.id);
                      removeSection(actualIndex);
                    }}
                    onMove={(dir) => {
                      const actualIndex = editedPage.sections.findIndex(s => s.id === section.id);
                      moveSection(actualIndex, dir);
                    }}
                  />
                </SortableSectionItem>
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Section */}
          <div className="pt-2">
            <Label className="text-xs font-medium text-gray-600 mb-2 block">Add New Section</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SECTION_TYPES).map(([key, type]) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSection(key)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPageEditor;
