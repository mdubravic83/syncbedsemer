import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function AdminRoute({ children }) {
  const { isCmsAdmin } = useAuth();
  if (!isCmsAdmin) {
    return <HomePage />;
  }
  return children;
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          
          {/* Features */}
          <Route path="/features/:featureSlug" element={<FeaturePage />} />
          <Route path="/channel-manager" element={<FeaturePage />} />
          <Route path="/evisitor" element={<FeaturePage />} />
          <Route path="/website" element={<FeaturePage />} />
          <Route path="/smart-apartment" element={<FeaturePage />} />
          
          {/* Pricing */}
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Blog */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          
          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />
          
          {/* About */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Admin CMS */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
