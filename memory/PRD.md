# SyncBeds CMS Marketing Website PRD

## Original Problem Statement
Build a CMS-driven marketing website for MyRent/SyncBeds brand identical to reference: https://multilang-cms-4.preview.emergentagent.com/

## User Personas
1. **CMS Admin** - Marketing team managing website content
2. **Website Visitor** - Potential customers viewing the site

## Core Requirements (Static)
- P0: Page identical to reference design ✅ COMPLETE
- P0: CMS Page/Post Creation ✅
- P0: Multi-language support (EN/HR/DE) ✅
- P0: Direct Image Uploads ✅
- P0: SVG & Raw HTML Support ✅
- P1: Headline Highlighting ✅
- P1: AI Content Generation (OpenAI) - PENDING
- P2: Mailchimp Integration - PENDING

## What's Been Implemented (Feb 5, 2026)

### Session 1 - Setup & Content Replication
- ✅ Cloned GitHub repo (second branch)
- ✅ Installed all dependencies
- ✅ Configured backend/frontend communication
- ✅ Created comprehensive home page content matching reference:
  - Hero section (hero_2 type) with "All in one" highlight
  - PMS dark section
  - Features list (5 cards)
  - Booking providers logos (6 partners)
  - CTA section with primary background
  - Channel Manager section
  - Modules grid (4 tools)
  - Testimonials section
  - FAQ section
  - Complete footer

### Testing Results
- Backend: 100%
- Frontend: 90%

## Prioritized Backlog

### P0 (Critical) - DONE
- ✅ Home page identical to reference

### P1 (High)
- ❌ SVG Animation not working in custom HTML sections
- ❌ OpenAI integration for AI content generation

### P2 (Medium)
- ❌ Mailchimp newsletter integration
- ❌ Live editing UX improvements
- ❌ Drag-and-drop section reordering fix

## Tech Stack
- Frontend: React 19, Tailwind CSS, @dnd-kit, Tiptap
- Backend: FastAPI, MongoDB (motor)
- i18n: react-i18next

## Key Files
- `/app/frontend/src/components/SectionRenderer.jsx` - Section rendering
- `/app/frontend/src/components/AdvancedPageEditor.jsx` - CMS Editor
- `/app/backend/server.py` - API endpoints
- `/app/scripts/seed_home_v2.py` - Home page seed data

## CMS Credentials
- Username: admin
- Password: admin123
- Access: Click "CMS login" in footer

## Reference
- Reference site: https://multilang-cms-4.preview.emergentagent.com/
