import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cmsApi } from '../services/api';
import { Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AdvancedPageEditor } from '../components/AdvancedPageEditor';
import { SectionRenderer } from '../components/SectionRenderer';
import { useAuth } from '../context/AuthContext';

/**
 * EditablePage - A reusable component that renders page content from CMS
 * with admin editing capabilities.
 * 
 * @param {string} slug - The page slug to fetch from CMS
 * @param {React.Component} FallbackContent - Optional fallback component to render if no CMS content
 * @param {object} fallbackData - Optional fallback data for the page (feature images, etc.)
 */
const EditablePage = ({ slug, FallbackContent, fallbackData }) => {
  const { i18n } = useTranslation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const { isCmsAdmin } = useAuth();

  const currentLang = i18n.language?.split('-')[0] || 'en';

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await cmsApi.getPageBySlug(slug);
        setPageData(data);
      } catch (e) {
        console.error('Failed to load page:', e);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [slug]);

  // Sort sections by order and filter visible ones
  const sortedSections = pageData?.sections
    ?.filter(s => s.visible !== false)
    ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  // If no CMS content and we have fallback, render fallback
  const hasCmsContent = sortedSections.length > 0;
  
  return (
    <div data-testid={`page-${slug}`} className={editOpen ? 'mr-[32rem]' : ''}>
      {/* Edit Button for CMS Admin */}
      {isCmsAdmin && !editOpen && (
        <div className="fixed top-20 right-6 z-40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur border-gray-200 text-xs font-medium shadow-lg"
            onClick={() => setEditOpen(true)}
            data-testid="edit-page-btn"
          >
            <Edit2 className="h-3 w-3 mr-1" /> Edit page
          </Button>
        </div>
      )}

      {/* Render sections from CMS if available */}
      {hasCmsContent ? (
        sortedSections.map((section) => (
          <div
            key={section.id}
            id={`page-section-${section.id}`}
            className={editOpen && isCmsAdmin ? 'cursor-pointer group' : ''}
            onClick={() => {
              if (editOpen && isCmsAdmin) {
                setActiveSectionId(section.id);
              }
            }}
          >
            <SectionRenderer
              section={section}
              currentLang={currentLang}
              feature={fallbackData}
            />
          </div>
        ))
      ) : (
        // Fallback content if no CMS sections exist
        FallbackContent ? (
          <FallbackContent />
        ) : (
          <section className="py-24 bg-[#0A1628] text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">
                {pageData?.title?.[currentLang] || 'Page Content'}
              </h1>
              <p className="text-gray-300">
                No sections have been added to this page yet.
                {isCmsAdmin && ' Click "Edit page" to add content.'}
              </p>
            </div>
          </section>
        )
      )}

      {/* Advanced Page Editor Sidebar */}
      {editOpen && pageData && (
        <AdvancedPageEditor
          page={pageData}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => {
            setPageData(updated);
          }}
        />
      )}
    </div>
  );
};

export default EditablePage;
