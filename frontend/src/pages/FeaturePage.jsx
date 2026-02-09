import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import EditablePage from '../components/EditablePage';

// Fallback content component if CMS page for feature is missing
const FeatureFallbackContent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Page not found</h1>
      <Link to="/" className="text-[#00D9FF] hover:underline">Go back home</Link>
    </div>
  </div>
);

const FeaturePage = () => {
  const { featureSlug } = useParams();
  const location = useLocation();
  
  // If no featureSlug from params, use the pathname (e.g., /channel-manager -> channel-manager)
  const slug = featureSlug || location.pathname.replace('/', '');
  
  return <EditablePage slug={slug} FallbackContent={FeatureFallbackContent} />;
};

export default FeaturePage;
