# SyncBeds CMS Marketing Website PRD

## Original Problem Statement
Build a CMS-driven marketing website for MyRent/SyncBeds brand. Key features include:
- Full CMS with page/section editing
- Multi-language support (EN, HR, DE)
- Multiple hero section variants
- Custom HTML/SVG support with size/alignment controls
- Figma design replication
- Direct image uploads

## User Personas
1. **CMS Admin** - Marketing team managing website content
2. **Website Visitor** - Potential customers viewing the site

## Core Requirements (Static)
- P0: CMS Page/Post Creation
- P0: Figma Design Replication
- P0: Direct Image Uploads
- P0: SVG & Raw HTML Support
- P1: Headline Highlighting
- P1: AI Content Generation (OpenAI)
- P2: Mailchimp Integration

## What's Been Implemented (Feb 5, 2026)
- ✅ GitHub repo cloned (second branch)
- ✅ All dependencies installed (react-i18next, @dnd-kit, @tiptap, etc.)
- ✅ Backend API running on port 8001
- ✅ Frontend running on port 3000
- ✅ CMS Admin Login (admin/admin123)
- ✅ Page Editor with section management
- ✅ Hero Section (3 variants)
- ✅ Custom HTML/SVG section with:
  - WYSIWYG Editor / Raw HTML toggle
  - max_width control (100%, 1200px, 900px, 700px, 500px, 400px)
  - alignment control (left, center, right)
- ✅ Section Order input
- ✅ Drag-and-drop reordering
- ✅ Multi-language support (EN/HR/DE)
- ✅ Direct image uploads

## Prioritized Backlog

### P0 (Critical)
- ❌ Pixel-perfect Figma replication for Home and Feature pages

### P1 (High)
- ❌ SVG Animation not working in custom HTML sections
- ❌ OpenAI integration for AI content generation

### P2 (Medium)
- ❌ Mailchimp newsletter integration
- ❌ Live editing UX improvements
- ❌ Media library evolution

## Known Issues
1. **SVG Animation (P1)** - Custom SVG with internal scripts does not animate when rendered via dangerouslySetInnerHTML
2. **Drag-and-drop (P2)** - User deferred fix, manual order input works

## Tech Stack
- Frontend: React 19, Tailwind CSS, @dnd-kit, Tiptap
- Backend: FastAPI, MongoDB (motor)
- Deployment: Kubernetes

## Key Files
- `/app/frontend/src/components/AdvancedPageEditor.jsx` - CMS Editor
- `/app/frontend/src/components/SectionRenderer.jsx` - Section rendering
- `/app/backend/server.py` - API endpoints

## CMS Credentials
- Username: admin
- Password: admin123
