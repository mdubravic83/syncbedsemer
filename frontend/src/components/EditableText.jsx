import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

/**
 * EditableText - Elementor-style click-to-edit component
 * 
 * When in edit mode:
 * - Shows hover highlight on editable elements
 * - Clicking opens inline editing or focuses the sidebar field
 * - Shows visual indicator of which element is being edited
 */
export const EditableText = ({
  children,
  value,
  onChange,
  onFocus,
  isEditMode = false,
  fieldId,
  activeFieldId,
  className,
  as: Component = 'span',
  multiline = false,
  placeholder = 'Click to edit...',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    if (!isEditMode) return;
    e.stopPropagation();
    
    if (onFocus) {
      // Use sidebar editing - just notify parent
      onFocus(fieldId);
    } else {
      // Inline editing
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value || '');
      setIsEditing(false);
    }
  };

  const isActive = activeFieldId === fieldId;

  if (!isEditMode) {
    return <Component className={className}>{children}</Component>;
  }

  if (isEditing && !onFocus) {
    // Inline editing mode
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'bg-white border-2 border-[#00D9FF] rounded px-2 py-1 outline-none',
          'shadow-lg text-inherit font-inherit',
          multiline && 'min-h-[100px] resize-y',
          className
        )}
        placeholder={placeholder}
        style={{ 
          fontSize: 'inherit', 
          fontWeight: 'inherit',
          lineHeight: 'inherit',
          width: '100%'
        }}
      />
    );
  }

  // Click-to-edit hover mode
  return (
    <Component
      onClick={handleClick}
      className={cn(
        'cursor-pointer transition-all duration-200 relative',
        'hover:outline hover:outline-2 hover:outline-[#00D9FF] hover:outline-offset-2',
        'hover:bg-[#00D9FF]/5 rounded',
        isActive && 'outline outline-2 outline-[#00D9FF] outline-offset-2 bg-[#00D9FF]/10',
        className
      )}
      title="Click to edit"
    >
      {children}
      {isEditMode && (
        <span className={cn(
          'absolute -top-2 -right-2 w-5 h-5 bg-[#00D9FF] rounded-full',
          'flex items-center justify-center opacity-0 transition-opacity',
          'group-hover:opacity-100 hover:opacity-100',
          isActive && 'opacity-100'
        )}>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </span>
      )}
    </Component>
  );
};

/**
 * EditableWrapper - Wraps a section with edit mode styling
 */
export const EditableSection = ({
  children,
  isEditMode,
  sectionId,
  activeSectionId,
  onSelect,
  label,
  className,
}) => {
  const isActive = activeSectionId === sectionId;

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(sectionId);
      }}
      className={cn(
        'relative transition-all duration-200 cursor-pointer group',
        'hover:outline hover:outline-2 hover:outline-dashed hover:outline-[#00D9FF]/50',
        isActive && 'outline outline-2 outline-dashed outline-[#00D9FF]',
        className
      )}
    >
      {/* Section label badge */}
      <div className={cn(
        'absolute -top-3 left-4 z-10 px-2 py-0.5 rounded text-xs font-medium',
        'bg-[#00D9FF] text-white opacity-0 transition-opacity',
        'group-hover:opacity-100',
        isActive && 'opacity-100'
      )}>
        {label || 'Section'}
      </div>
      {children}
    </div>
  );
};

export default EditableText;
