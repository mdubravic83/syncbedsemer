import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import FeaturePage from "./pages/FeaturePage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";
import "./i18n";
import i18n from "./i18n";

const SUPPORTED_LANGS = ["hr", "en", "de", "sl"];
const DEFAULT_LANG = "hr";

function AdminRoute({ children }) {
  const { isCmsAdmin } = useAuth();
  if (!isCmsAdmin) {
    return <HomePage />;
  }
  return children;
}

function LanguageWrapper({ children }) {
  const { lang } = useParams();

  if (!SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}`} replace />;
  }

  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Root - redirect to default language */}
            <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />

            {/* Public site with language prefix */}
            <Route
              path=":lang/*"
              element={
                <LanguageWrapper>
                  <Routes>
                    {/* Home */}
                    <Route path="" element={<HomePage />} />

                    {/* Features */}
                    <Route path="features/:featureSlug" element={<FeaturePage />} />
                    <Route path="channel-manager" element={<FeaturePage />} />
                    <Route path="evisitor" element={<FeaturePage />} />
                    <Route path="website" element={<FeaturePage />} />
                    <Route path="smart-apartment" element={<FeaturePage />} />

                    {/* Pricing */}
                    <Route path="pricing" element={<PricingPage />} />

                    {/* Blog */}
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/:postId" element={<BlogPostPage />} />

                    {/* Contact */}
                    <Route path="contact" element={<ContactPage />} />

                    {/* About */}
                    <Route path="about" element={<AboutPage />} />

                    {/* Legal Pages */}
                    <Route path="privacy" element={<PrivacyPolicyPage />} />
                    <Route path="terms" element={<TermsPage />} />

                    {/* Catch all within language - back to localized home */}
                    <Route path="*" element={<Navigate to="" replace />} />
                  </Routes>
                </LanguageWrapper>
              }
            />

            {/* Admin CMS without language prefix */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Fallback - any unknown path goes to default lang home */}
            <Route path="*" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
