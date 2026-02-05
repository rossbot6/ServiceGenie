# ServiceGenie - Feature Ideas & Roadmap

> Admin Dashboard & Multi-Location Management  
> Created: 2026-02-05

---

## 🎯 Core Vision

Expand ServiceGenie from a single-salon booking app into a **multi-location salon management platform** with a powerful admin dashboard for franchise/chain management.

---

## 🏢 Multi-Location Architecture

### Salon Management
- [ ] **Add/Edit/Delete Locations**
  - Salon name, address, phone
  - Hours of operation (per location)
  - Location photos/gallery
  - Amenities (parking, WiFi, etc.)
  - Default timezone per location

- [ ] **Location Settings**
  - Booking policies (cancellation, rescheduling, deposits)
  - Buffer time between appointments
  - Lead time for bookings (e.g., min 24h notice)
  - Default appointment duration

- [ ] **Multi-Timezone Support**
  - Display times in customer's local tz
  - Provider schedules in location tz
  - Automated timezone conversions

---

## 👥 Provider (Stylist) Management

### CRUD Operations
- [ ] **Add Provider**
  - Name, photo, bio
  - Specialty/expertise tags
  - Contact info (email, phone)
  - Assign to location(s)
  - Commission rate or salary model

- [ ] **Manage Provider Profile**
  - Profile photo upload
  - Service offerings (what they do)
  - Bio and experience
  - Languages spoken
  - Accessibility features

- [ ] **Schedule Management**
  - Set weekly availability
  - Per-day working hours
  - Time off / vacations
  - Lunch breaks
  - Override specific dates

- [ ] **Provider Status**
  - Active/Inactive toggle
  - Onboarding workflow
  - Termination with history preservation

### Advanced Provider Features
- [ ] **Service Bindings**
  - Each provider has their own price list
  - Services they don't perform hidden
  - Custom durations per provider

- [ ] **Performance Metrics**
  - Appointments completed
  - Revenue generated
  - Cancellation rate
  - Average rating
  - Utilization %

- [ ] **Team Management**
  - Group providers into teams (colorists, stylists, nails)
  - Team lead assignment
  - Cross-training visibility

---

## 👤 Customer Management

### Customer Profiles
- [ ] **Basic Info**
  - Name, phone, email
  - Photo (optional)
  - Date of birth (for rewards)

- [ ] **Communication Preferences**
  - SMS notifications (yes/no)
  - Email notifications
  - Marketing opt-in
  - Preferred contact method

- [ ] **Visit History**
  - Past appointments
  - Services received
  - Providers used
  - Spending total

- [ ] **Notes & Tags**
  - Internal notes (allergies, preferences)
  - Tags (VIP, new client, frequent)
  - Custom fields

### Customer Actions
- [ ] **Search & Filter**
  - By name, phone, email
  - By last visit date
  - By provider
  - By tag/segment

- [ ] **Customer Export**
  - CSV export of customer list
  - Segment-based exports

- [ ] **Communications**
  - Send SMS from dashboard
  - Send email campaigns
  - Bulk messaging (promos, reminders)

---

## 📅 Booking Management (Admin View)

### Appointments Dashboard
- [ ] **All Appointments View**
  - Calendar view (all locations)
  - List view with filters
  - Export functionality

- [ ] **Appointment Actions**
  - Reschedule (move to different time/provider)
  - Cancel with reason tracking
  - No-show flagging
  - Add notes

- [ ] **Walk-ins**
  - Log walk-in appointments
  - Mark as completed
  - Collect customer info

### Booking Policies
- [ ] **Cancellation Rules**
  - Minimum notice period
  - Cancellation fee thresholds
  - No-show consequences

- [ ] **Deposit System**
  - Require deposits for certain services
  - Deposit amount (fixed or %)
  - Deposit forfeiture rules

---

## 💰 Financial Features

### Revenue Tracking
- [ ] **Daily/Weekly/Monthly Revenue**
  - By location
  - By provider
  - By service category

- [ ] **Payment Processing**
  - Card on file
  - In-app payments
  - Cash tracking
  - Refund management

### Provider Compensation
- [ ] **Commission Model**
  - Percentage per service
  - Tiered commissions (volume bonuses)

- [ ] **Salary + Commission**
  - Base pay + performance bonus

- [ ] **Payout Reports**
  - Pay stubs per provider
  - Period summaries

---

## 🛠️ Service Catalog

### Service Management
- [ ] **Service CRUD**
  - Name, description, duration
  - Default price
  - Category (hair, nails, spa)
  - Color coding

- [ ] **Service Options**
  - Add-ons (e.g., deep conditioning)
  - Variants (short/long hair pricing)

- [ ] **Service Categories**
  - Organize services into groups
  - Category-specific settings

---

## 📊 Reporting & Analytics

### Dashboard Widgets
- [ ] **Key Metrics**
  - Today's appointments
  - Revenue today/week
  - New customers
  - Cancellation rate

### Reports
- [ ] **Provider Performance**
  - Appointments, revenue, ratings

- [ ] **Customer Insights**
  - Retention rate
  - Visit frequency
  - Lifetime value

- [ ] **Location Comparison**
  - Revenue per location
  - Utilization rates
  - Staff productivity

---

## 🔔 Notifications & Reminders

### Automated Messages
- [ ] **Appointment Reminders**
  - 24 hours before
  - 2 hours before
  - Day-of (morning of)

- [ ] **Confirmation Messages**
  - Booking confirmation
  - Cancellation notice
  - Reschedule notice

- [ ] **Marketing**
  - Birthday discounts
  - "We miss you" campaigns
  - New service announcements

### Template Management
- [ ] **SMS Templates**
  - Edit reminder texts
  - Placeholders (name, time, location)
  - Multi-language support

- [ ] **Email Templates**
  - Rich HTML emails
  - Branding controls

---

## 🔐 Roles & Permissions

### User Roles
- [ ] **Super Admin**
  - All access across all locations

- [ ] **Location Manager**
  - Full access to assigned location(s)
  - Cannot modify other locations

- [ ] **Provider**
  - View own schedule
  - Manage own availability
  - View assigned customers

- [ ] **Front Desk/Receptionist**
  - Book appointments
  - View customer notes
  - Cannot change financial settings

---

## 📱 Customer App Enhancements

### Consumer Features
- [ ] **My Bookings**
  - View upcoming appointments
  - Past appointment history
  - Easy rebooking

- [ ] **In-App Payments**
  - Save card
  - Pay deposits
  - Tip within app

- [ ] **Waitlist**
  - Join waitlist for sold-out times
  - Auto-notify of openings

- [ ] **Reviews**
  - Rate appointment
  - Leave feedback
  - Public reviews on profile

---

## 🔄 Integrations

### External Systems
- [ ] **Google Calendar**
  - Sync provider schedules
  - Customer calendar invites

- [ ] **Accounting**
  - QuickBooks integration
  - Xero sync
  - Revenue exports

- [ ] **Marketing**
  - Mailchimp
  - Klaviyo
  - SMS providers (Twilio, etc.)

- [ ] **POS Systems**
  - Square integration
  - Clover
  - In-person payment sync

---

## 🚀 Future Roadmap (V2+)

- [ ] **Loyalty/Rewards Program**
  - Points per visit
  - Tiered rewards
  - Birthday bonuses

- [ ] **Gift Cards**
  - Purchase gift cards
  - Redeem for services

- [ ] **Membership Subscriptions**
  - Monthly packages
  - Unlimited services tiers

- [ ] **Multi-Language App**
  - Spanish, French, etc.
  - Provider preference settings

- [ ] **Accessibility Features**
  - Screen reader support
  - Large text mode
  - High contrast

- [ ] **API for Third-Party Apps**
  - Public API
  - Partner integrations

---

## 📋 Implementation Priorities

### Phase 1: Admin Basics
1. Multi-location setup
2. Provider CRUD
3. Customer CRUD
4. Basic appointment management

### Phase 2: Core Features
1. Booking dashboard (all locations)
2. Service catalog
3. Notification system
4. Roles & permissions

### Phase 3: Financials
1. Revenue tracking
2. Provider payouts
3. Payment processing

### Phase 4: Scale
1. Reporting/analytics
2. Marketing tools
3. Advanced integrations

---

## 💡 Random Ideas

- **AI Scheduling Assistant** - Auto-recommend optimal times
- **Virtual Consultations** - Video call before appointment
- **AR Preview** - Show how haircut might look
- **Social Sharing** - Share new look on Instagram
- **Appointment Photos** - Before/after photos in profile
- **Recipe Sharing** - Hair care product recommendations
- **Group Bookings** - Bridal party packages
- **E-Gift Cards**
- **Subscription Boxes** - Monthly product boxes
- **QR Code Check-in** - Contactless arrival

---

## 📝 Notes

- Need to consider GDPR/data privacy for EU customers
- Consider HIPAA if adding health/beautyconsultations
- Offline mode for areas with poor connectivity
- Battery-efficient location tracking
- App size optimization

---

*This document will evolve as features are prioritized and implemented.*
