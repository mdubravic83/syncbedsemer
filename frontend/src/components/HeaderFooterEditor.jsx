import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cmsApi } from '../services/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Submenu Item Editor (child item)
const SubmenuItemEditor = ({ item, index, onUpdate, onRemove, onMove, totalItems, currentLang }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
      <GripVertical className="h-3 w-3 text-gray-400 flex-shrink-0" />
      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          value={item.label?.[currentLang] || ''}
          onChange={(e) => onUpdate({ 
            ...item, 
            label: { ...item.label, [currentLang]: e.target.value } 
          })}
          placeholder={`Label (${currentLang})`}
          className="text-xs h-7"
        />
        <Input
          value={item.url || ''}
          onChange={(e) => onUpdate({ ...item, url: e.target.value })}
          placeholder="/page"
          className="text-xs h-7"
        />
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onMove('up')}
          disabled={index === 0}
          className="h-6 w-6 p-0"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onMove('down')}
          disabled={index === totalItems - 1}
          className="h-6 w-6 p-0"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 text-red-500"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// Main Menu Item Editor (parent item)
const MenuItemEditor = ({ item, index, onUpdate, onRemove, onMove, totalItems, currentLang }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const addSubmenuItem = () => {
    const newChild = {
      id: Date.now().toString(),
      label: { en: '', hr: '', de: '' },
      url: '/',
      order: (item.children || []).length,
      visible: true
    };
    onUpdate({ 
      ...item, 
      children: [...(item.children || []), newChild] 
    });
  };

  const updateSubmenuItem = (childIndex, updatedChild) => {
    const children = [...(item.children || [])];
    children[childIndex] = updatedChild;
    onUpdate({ ...item, children });
  };

  const removeSubmenuItem = (childIndex) => {
    const children = (item.children || []).filter((_, i) => i !== childIndex);
    children.forEach((c, i) => c.order = i);
    onUpdate({ ...item, children });
  };

  const moveSubmenuItem = (childIndex, direction) => {
    const children = [...(item.children || [])];
    const newIndex = direction === 'up' ? childIndex - 1 : childIndex + 1;
    if (newIndex < 0 || newIndex >= children.length) return;
    [children[childIndex], children[newIndex]] = [children[newIndex], children[childIndex]];
    children.forEach((c, i) => c.order = i);
    onUpdate({ ...item, children });
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          {hasChildren && <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />}
          <span className="text-sm font-medium">
            {item.label?.[currentLang] || item.label?.en || 'Menu Item'}
          </span>
          {hasChildren && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              {item.children.length} submenu
            </span>
          )}
          {!hasChildren && item.url && (
            <span className="text-xs text-gray-400">{item.url}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
            disabled={index === 0}
            className="h-6 w-6 p-0"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
            disabled={index === totalItems - 1}
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="h-6 w-6 p-0 text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-gray-100">
          {/* Labels for all languages */}
          <div className="grid grid-cols-3 gap-2">
            {['en', 'hr', 'de'].map(lang => (
              <div key={lang}>
                <Label className="text-xs text-gray-500">{lang.toUpperCase()}</Label>
                <Input
                  value={item.label?.[lang] || ''}
                  onChange={(e) => onUpdate({ 
                    ...item, 
                    label: { ...item.label, [lang]: e.target.value } 
                  })}
                  placeholder={`Label (${lang})`}
                  className="text-sm h-8"
                />
              </div>
            ))}
          </div>
          
          {/* URL - only show if no children */}
          {!hasChildren && (
            <div>
              <Label className="text-xs text-gray-500">URL</Label>
              <Input
                value={item.url || ''}
                onChange={(e) => onUpdate({ ...item, url: e.target.value })}
                placeholder="/page or https://..."
                className="text-sm h-8"
              />
            </div>
          )}

          {/* Visibility toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`visible-${item.id}`}
              checked={item.visible !== false}
              onChange={(e) => onUpdate({ ...item, visible: e.target.checked })}
            />
            <Label htmlFor={`visible-${item.id}`} className="text-xs">Visible</Label>
          </div>

          {/* Submenu Section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-gray-700">
                Submenu Items ({(item.children || []).length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubmenuItem}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Submenu
              </Button>
            </div>
            
            {/* Submenu Items */}
            {(item.children || []).length > 0 && (
              <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-3">
                {(item.children || [])
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((child, childIndex) => (
                    <SubmenuItemEditor
                      key={child.id}
                      item={child}
                      index={childIndex}
                      onUpdate={(updated) => updateSubmenuItem(childIndex, updated)}
                      onRemove={() => removeSubmenuItem(childIndex)}
                      onMove={(dir) => moveSubmenuItem(childIndex, dir)}
                      totalItems={(item.children || []).length}
                      currentLang={currentLang}
                    />
                  ))}
              </div>
            )}
            
            {(item.children || []).length === 0 && (
              <p className="text-xs text-gray-400 ml-4">
                Add submenu items to create a dropdown menu
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const HeaderFooterEditor = ({ type = 'header', onClose }) => {
  const { i18n } = useTranslation();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language?.split('-')[0] || 'en');

  const menuName = type === 'header' ? 'header' : 'footer';
  const title = type === 'header' ? 'Header Navigation' : 'Footer Links';

  useEffect(() => {
    loadMenu();
  }, [menuName]);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await cmsApi.getMenuByName(menuName);
      setMenu(data);
    } catch (error) {
      setMenu({
        name: menuName,
        items: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.updateMenu(menuName, menu);
      toast.success(`${title} saved successfully!`);
      // Trigger page reload to reflect menu changes
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to save ${title.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: { en: '', hr: '', de: '' },
      url: '/',
      order: menu.items.length,
      visible: true,
      children: []
    };
    setMenu({ ...menu, items: [...menu.items, newItem] });
  };

  const addDropdownItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: { en: 'New Dropdown', hr: 'Novi Dropdown', de: 'Neues Dropdown' },
      url: '',
      order: menu.items.length,
      visible: true,
      children: [
        {
          id: Date.now().toString() + '-1',
          label: { en: 'Submenu Item 1', hr: 'Podmeni 1', de: 'Untermenü 1' },
          url: '/',
          order: 0,
          visible: true
        }
      ]
    };
    setMenu({ ...menu, items: [...menu.items, newItem] });
  };

  const updateItem = (index, updatedItem) => {
    const items = [...menu.items];
    items[index] = updatedItem;
    setMenu({ ...menu, items });
  };

  const removeItem = (index) => {
    const items = menu.items.filter((_, i) => i !== index);
    items.forEach((item, i) => item.order = i);
    setMenu({ ...menu, items });
  };

  const moveItem = (index, direction) => {
    const items = [...menu.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    items.forEach((item, i) => item.order = i);
    setMenu({ ...menu, items });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg">Loading...</div>
      </div>
    );
  }

  const sortedItems = [...(menu?.items || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-gray-500">Manage menu items and dropdowns</p>
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

        {/* Language Selector */}
        <div className="px-4 py-2 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Editing language:</span>
            {['en', 'hr', 'de'].map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setCurrentLang(lang)}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  currentLang === lang 
                    ? 'bg-[#00BFB3] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedItems.map((item, index) => (
            <MenuItemEditor
              key={item.id}
              item={item}
              index={index}
              onUpdate={(updated) => updateItem(index, updated)}
              onRemove={() => removeItem(index)}
              onMove={(dir) => moveItem(index, dir)}
              totalItems={sortedItems.length}
              currentLang={currentLang}
            />
          ))}

          {sortedItems.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No menu items yet.</p>
              <p className="text-sm">Add items below to build your navigation.</p>
            </div>
          )}
        </div>

        {/* Footer - Add Buttons */}
        <div className="p-4 border-t bg-gray-50 flex gap-2">
          <Button type="button" variant="outline" onClick={addItem} className="flex-1">
            <Plus className="h-4 w-4 mr-1" /> Add Link
          </Button>
          <Button type="button" variant="outline" onClick={addDropdownItem} className="flex-1">
            <FolderPlus className="h-4 w-4 mr-1" /> Add Dropdown
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderFooterEditor;
