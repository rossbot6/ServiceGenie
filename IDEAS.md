# ServiceGenie - Feature Ideas & Roadmap

> Admin Dashboard & Multi-Location Management  
> Created: 2026-02-05  
> Last Updated: 2026-02-05

---

## 🎯 Core Vision

Expand ServiceGenie from a single-salon booking app into a **multi-location salon management platform** with a powerful admin dashboard for franchise/chain management.

---

## 🏢 Multi-Location Architecture

### Salon Management
- [x] ~~Add/Edit/Delete Locations~~ ✅ **Completed** - Basic location CRUD in admin
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
- [x] ~~Add Provider~~ ✅ **Completed** - Name, specialty, email, phone in admin
- [x] ~~Manage Provider Profile~~ ✅ **Completed** - Edit provider details
- [x] ~~Schedule Management~~ ✅ **Completed** - Weekly calendar with drag-to-schedule
- [x] ~~Provider Status~~ ✅ **Completed** - Active/Inactive toggle in admin

### Advanced Provider Features
- [x] ~~Performance Metrics~~ ✅ **Completed** - Appointments, revenue, rating per provider
- [ ] **Team Management**
  - Group providers into teams (colorists, stylists, nails)
  - Team lead assignment
  - Cross-training visibility

---

## 👤 Customer Management

### Customer Profiles
- [x] ~~Basic Info~~ ✅ **Completed** - Name, phone visible in admin
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
- [x] ~~Search & Filter~~ ✅ **Completed** - Search customers in admin
- [ ] **Customer Export**
  - CSV export of customer list
  - Segment-based exports

- [ ] **Communications**
  - Send SMS from dashboard
  - Send email campaigns
  - Bulk messaging (promos, reminders)

---

## 📅 Booking Management

### Appointments Dashboard
- [x] ~~Calendar View~~ ✅ **Completed** - Weekly calendar in stylist dashboard
- [ ] **All Appointments View**
  - List view with filters
  - Export functionality

- [x] ~~Appointment Actions~~ ✅ **Completed** - Book, reschedule, cancel, approve blocked-time requests
- [x] ~~Blocked Time Management~~ ✅ **Completed** - Add/view blocked slots with approval workflow

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
- [x] ~~Revenue Display~~ ✅ **Completed** - Shows monthly revenue per provider in admin
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
- [x] ~~Service CRUD~~ ✅ **Completed** - Add/edit/delete services with name, price, duration, category

### Service Options
- [ ] **Add-ons**
  - e.g., deep conditioning
- [ ] **Variants**
  - Short/long hair pricing

### Service Categories
- [x] ~~Categories~~ ✅ **Completed** - Hair, Nails, Spa, Beauty, Massage

---

## 📊 Reporting & Analytics

### Dashboard Widgets
- [x] ~~Key Metrics~~ ✅ **Completed** - Providers, services, locations, revenue stats in admin overview

### Reports
- [x] ~~Provider Performance~~ ✅ **Completed** - Appointments, revenue, ratings shown per provider
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
- [x] ~~Appointment Reminders~~ ✅ **Completed** - Cron job for 8PM nightly reminders
- [x] ~~Confirmation Messages~~ ✅ **Completed** - Alert on successful booking

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
- [x] ~~Admin~~ ✅ **Completed** - Full admin dashboard access
- [ ] **Location Manager**
  - Full access to assigned location(s)
  - Cannot modify other locations

- [x] ~~Provider~~ ✅ **Completed** - Provider dashboard with own schedule
- [ ] **Front Desk/Receptionist**
  - Book appointments
  - View customer notes
  - Cannot change financial settings

---

## 📱 Customer App Enhancements

### Consumer Features
- [x] ~~My Bookings~~ ✅ **Completed** - Customer booking flow
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

## ✅ Completed Features Summary

### Phase 1 - Admin Basics ✅
| Feature | Status |
|---------|--------|
| Admin Dashboard | ✅ Complete |
| Provider CRUD | ✅ Complete |
| Customer CRUD | ✅ Complete |
| Basic Appointment Management | ✅ Complete |
| Blocked Times + Approval | ✅ Complete |

### Phase 2 - Core Features 🔄
| Feature | Status |
|---------|--------|
| Service Catalog | ✅ Complete |
| Notification System | ✅ Partial (cron job) |
| Roles & Permissions | ⚠️ Partial |
| Booking Dashboard | ✅ Partial |

### Phase 3 - Financials ⏳
| Feature | Status |
|---------|--------|
| Revenue Tracking | ✅ Partial |
| Provider Payouts | ⏳ Pending |
| Payment Processing | ⏳ Pending |

### Phase 4 - Scale ⏳
| Feature | Status |
|---------|--------|
| Reporting/Analytics | ⏳ Pending |
| Marketing Tools | ⏳ Pending |
| Advanced Integrations | ⏳ Pending |

---

## 📋 Implementation Priorities (Updated)

### Next Up (Phase 2)
1. ~~Service catalog~~ ✅ Done
2. ~~Provider metrics~~ Done
3. Location settings (booking policies, cancellation rules)
4. Walk-in booking support
5. Customer detailed profiles with notes

### Phase 3
1. Payment processing
2. Provider commission tracking
3. Payout reports

### Phase 4
1. Analytics dashboard
2. Marketing automation
3. Third-party integrations

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
- Consider HIPAA if adding health/beauty consultations
- Offline mode for areas with poor connectivity
- Battery-efficient location tracking
- App size optimization

---

*This document will evolve as features are prioritized and implemented.*
