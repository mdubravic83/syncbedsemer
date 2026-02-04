import React from 'react';
import { useParams, Link } from 'react-router-dom';
import EditablePage from '../components/EditablePage';

// Fallback content component if CMS page for feature is missing
const FeatureFallbackContent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Page not found</h1>
      <Link to="/" className="text-[#00BFB3] hover:underline">Go back home</Link>
    </div>
  </div>
);

const FeaturePage = () => {
  const { featureSlug } = useParams();
  return <EditablePage slug={featureSlug} FallbackContent={FeatureFallbackContent} />;
};

export default FeaturePage;
