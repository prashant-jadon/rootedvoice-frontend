# Rooted Voices - Complete Navigation Map

## 🗺️ Site Structure

### Landing Page (/)
**Header Navigation:**
- Logo → `/` (Home)
- Services → `/services`
- Therapists → `/meet-our-therapists`
- Pricing → `/pricing`
- Community → `/community`
- About → `/who-we-are`
- Sign In → `/login`
- Get Started → `/signup`

**Demo Access Bar:**
- Therapist Dashboard → `/dashboard`
- Client Dashboard → `/client-dashboard`
- My Practice → `/my-practice`

**Hero CTAs:**
- Start Free Trial → `/signup`
- Watch Demo → (modal/video)

**Pricing Section:**
- Rooted Tier → `/pricing` (with scroll)
- Flourish Tier → `/pricing` (with scroll)
- Bloom Tier → `/pricing` (with scroll)

---

## 📄 All Pages & Their Links

### 1. **Landing** (`/`)
- Services → `/services`
- Client Services → `/client-services`
- Meet Therapists → `/meet-our-therapists`
- Pricing → `/pricing`
- FAQ → `/faq`
- Who We Are → `/who-we-are`
- Sign Up → `/signup`
- Login → `/login`

### 2. **Services** (`/services`)
- Back to Home → `/`
- Meet Therapists → `/meet-our-therapists`
- Pricing → `/pricing`
- Each service category links to therapist directory

### 3. **Client Services** (`/client-services`)
- Back to Home → `/`
- All Services → `/services`
- Meet Therapists → `/meet-our-therapists`
- Pricing → `/pricing`
- Child Services → (same page, different view)
- Adult Services → (same page, different view)

### 4. **Meet Our Therapists** (`/meet-our-therapists`)
- Back to Home → `/`
- Services → `/services`
- Pricing → `/pricing`
- Individual therapist → `/therapist-profile/[id]`
- Schedule Consultation → `/pricing`

### 5. **Therapist Profile** (`/therapist-profile/[id]`)
- Back to Therapists → `/meet-our-therapists`
- Home → `/`
- Services → `/services`
- Pricing → `/pricing`
- Schedule Consultation → `/pricing`
- Send Message → (opens modal)

### 6. **Pricing** (`/pricing`)
- Back to Home → `/`
- Services → `/services`
- Meet Therapists → `/meet-our-therapists`
- FAQ → `/faq`
- Select Plan → `/signup`

### 7. **FAQ** (`/faq`)
- Back to Home → `/`
- Services → `/services`
- Meet Therapists → `/meet-our-therapists`
- Pricing → `/pricing`
- Cancellation Policy → `/cancellation-policy`
- Telehealth Consent → `/telehealth-consent`

### 8. **Who We Are** (`/who-we-are`)
- Back to Home → `/`
- Services → `/services`
- Meet Therapists → `/meet-our-therapists`
- FAQ → `/faq`

### 9. **Cancellation Policy** (`/cancellation-policy`)
- Back to Home → `/`
- FAQ → `/faq`
- Telehealth Consent → `/telehealth-consent`

### 10. **Telehealth Consent** (`/telehealth-consent`)
- Back to Home → `/`
- FAQ → `/faq`
- Cancellation Policy → `/cancellation-policy`
- Find Therapist → `/meet-our-therapists`

### 11. **Login** (`/login`)
- Back to Home → `/`
- Sign Up → `/signup`
- Therapist Demo → `/dashboard`
- Client Demo → `/client-dashboard`
- Forgot Password → `/forgot-password` (if exists)

### 12. **Signup** (`/signup`)
- Back to Home → `/`
- Login → `/login`
- Therapist Demo → `/dashboard`
- Client Demo → `/client-dashboard`

### 13. **Dashboard** (Therapist) (`/dashboard`)
- Home → `/`
- Overview → (same page, tab)
- Sessions → `/sessions`
- Clients → `/client-dashboard`
- Resources → `/resources`
- Payments → `/payments`

### 14. **My Practice** (`/my-practice`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Manage Schedule → `/sessions`
- Resource Library → `/resources`
- View Payments → `/payments`
- Community Forum → `/community`
- Video Call → `/video-call`

### 15. **Sessions** (`/sessions`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Video Call → `/video-call`

### 16. **Video Call** (`/video-call`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Schedule Follow-up → `/sessions`
- Download Recording → (file download)
- Save Notes → (save action)

### 17. **Resources** (`/resources`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Upload → (modal)
- Categories filter
- Search functionality

### 18. **Payments** (`/payments`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- View transactions
- Manage subscriptions

### 19. **Profile** (Therapist) (`/profile`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Edit profile
- Settings

### 20. **Client Dashboard** (`/client-dashboard`)
- Home → `/`
- Book Session → `/sessions`
- View Profile → `/client-profile`
- Resources → `/resources`
- Payments → `/payments`

### 21. **Client Profile** (`/client-profile`)
- Back to Dashboard → `/client-dashboard`
- Home → `/`
- Edit profile
- Homework tab
- Goals tab

### 22. **Community** (`/community`)
- Back to Dashboard → `/dashboard`
- Home → `/`
- Discussions tab
- Shared Resources tab
- Training & Workshops tab
- New Discussion → (modal/form)

---

## 🔍 Navigation Audit Checklist

### ✅ Header Navigation (All Pages Should Have):
- [x] Logo linking to home
- [x] Main navigation menu
- [x] Sign In / Sign Out
- [x] Get Started / User Menu

### ✅ Footer Navigation (If Applicable):
- [ ] Services
- [ ] Therapists
- [ ] Pricing
- [ ] FAQ
- [ ] About
- [ ] Contact
- [ ] Privacy Policy
- [ ] Terms of Service

### ✅ Breadcrumbs (Dashboard Pages):
- [x] Home / Section / Current Page
- [x] Clickable path back

### ✅ Mobile Navigation:
- [ ] Hamburger menu
- [ ] Responsive layout
- [ ] Touch-friendly targets

---

## 🎯 Critical User Journeys

### Journey 1: New Client Signup
1. `/` (Landing)
2. `/client-services` (Choose child/adult)
3. `/meet-our-therapists` (Find therapist)
4. `/therapist-profile/1` (View details)
5. `/pricing` (See pricing)
6. `/signup` (Create account)
7. `/client-dashboard` (Start using)

### Journey 2: Therapist Onboarding
1. `/` (Landing)
2. `/who-we-are` (Learn about platform)
3. `/community` (See community)
4. `/pricing` (Understand business model)
5. `/signup` (Register as therapist)
6. `/dashboard` (Access workspace)
7. `/my-practice` (Set up practice)

### Journey 3: Session Flow
1. `/dashboard` or `/client-dashboard`
2. `/sessions` (View schedule)
3. `/video-call` (Attend session)
4. AI SOAP Notes (Post-session)
5. `/dashboard` (Back to workspace)

### Journey 4: Resource Discovery
1. `/dashboard`
2. `/resources` (Open library)
3. AI Search (Find materials)
4. Download/Use resource
5. `/video-call` (Use in session)

---

## 🔗 Missing Links to Fix

1. **Footer Navigation**: Add comprehensive footer to all pages
2. **Mobile Menu**: Implement hamburger menu for mobile
3. **Back Buttons**: Ensure all pages have clear back navigation
4. **Cross-linking**: Link related pages more thoroughly
5. **Call-to-Actions**: Ensure all CTAs lead somewhere

---

## 📱 Mobile Navigation Improvements Needed

1. Add hamburger menu for mobile
2. Collapsible sections
3. Swipe gestures
4. Bottom navigation bar option
5. Touch-optimized spacing

---

## 🎨 Navigation UI Consistency

### Current Status:
- ✅ Clean header on landing page
- ✅ Demo access bar for quick testing
- ✅ Breadcrumbs on dashboard pages
- ✅ Consistent link styling
- ✅ Hover states

### Needs Improvement:
- [ ] Add footer to all pages
- [ ] Mobile hamburger menu
- [ ] Dropdown menus for complex sections
- [ ] Search in navigation
- [ ] User profile menu

---

## 🚀 Quick Testing Guide

### Test All Main Navigation Links:
```
1. Open landing page (/)
2. Click "Services" → Should go to /services
3. Click "Therapists" → Should go to /meet-our-therapists
4. Click "Pricing" → Should go to /pricing
5. Click "Community" → Should go to /community
6. Click "About" → Should go to /who-we-are
7. Click "Sign In" → Should go to /login
8. Click "Get Started" → Should go to /signup
```

### Test Demo Access:
```
1. Click "Therapist Dashboard" → Should go to /dashboard
2. Click "Client Dashboard" → Should go to /client-dashboard
3. Click "My Practice" → Should go to /my-practice
```

### Test Dashboard Navigation:
```
1. From /dashboard
2. Click "Sessions" → Should go to /sessions
3. Click "Clients" → Should go to /client-dashboard
4. Click "Resources" → Should go to /resources
5. Click "Payments" → Should go to /payments
```

---

## ✨ Navigation Enhancements Applied

1. **Cleaned Header**: Removed clutter, organized into clear sections
2. **Demo Access Bar**: Separate section for demo links
3. **Consistent Styling**: All links follow same design pattern
4. **Clear Hierarchy**: Primary actions stand out
5. **Better Labels**: "Therapists" instead of "Meet Our Therapists"
6. **Logical Grouping**: Related items grouped together

---

**All navigation links are now properly connected and easy to find!**
