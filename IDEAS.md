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
- [x] **Location Settings**
  - [x] ~~Booking policies (cancellation, rescheduling, deposits)~~ ✅ **Completed** - Added booking policies display
  - [x] ~~Buffer time between appointments~~ ✅ **Completed** - 15min default buffer shown in location policies
  - [x] ~~Lead time for bookings~~ ✅ **Completed** - Min lead hours configurable (24h default)
  - [x] ~~Default appointment duration~~ ✅ **Completed** - Duration shown per location

- [x] **Multi-Timezone Support**
  - [x] ~~Display times in customer's local tz~~ ✅ **Completed** - Automated conversion in appointment list
  - [x] ~~Provider schedules in location tz~~ ✅ **Completed** - Display location timezone in list
  - [x] ~~Automated timezone conversions~~ ✅ **Completed** - Integrated into UI for cross-timezone management

---

## 👥 Provider (Stylist) Management

### CRUD Operations
- [x] ~~Add Provider~~ ✅ **Completed** - Name, specialty, email, phone in admin
- [x] ~~Manage Provider Profile~~ ✅ **Completed** - Edit provider details
- [x] ~~Schedule Management~~ ✅ **Completed** - Weekly calendar with drag-to-schedule
- [x] ~~Provider Status~~ ✅ **Completed** - Active/Inactive toggle in admin

### Advanced Provider Features
- [x] ~~Performance Metrics~~ ✅ **Completed** - Appointments, revenue, rating per provider
- [x] ~~Team Management~~ ✅ **Completed** - Group providers into teams with lead assignments
- [x] ~~Team Lead Assignment~~ ✅ **Completed** - Display team leads within teams
- [x] **Cross-training visibility** ✅ **NEW** - Display provider skills with certified and learning status

---

## 👤 Customer Management

### Customer Profiles
- [x] ~~Basic Info~~ ✅ **Completed** - Name, phone visible in admin
- [x] ~~Communication Preferences~~ ✅ **Completed** - SMS/email/marketing opt-in, preferred contact UI
- [x] ~~Visit History~~ ✅ **Completed** - Past appointments, services, providers, spending total
- [x] ~~Notes & Tags~~ ✅ **Completed** - Internal notes, VIP/new/custom tags

### Customer Actions
- [x] ~~Search & Filter~~ ✅ **Completed** - Search customers in admin
- [x] ~~Customer Profiles with Notes~~ ✅ **Completed** - Added notes display, VIP/new/tags support
- [x] ~~Customer Export~~ ✅ **Completed** - CSV export with name, phone, email, notes, tags
- [x] ~~Communications~~ ✅ **Completed** - Customer list with export and Bulk Msg action

### Communications
- [x] ~~Send SMS from dashboard~~ ✅ **Partial** - UI button in Customer list
- [x] ~~Send email campaigns~~ ✅ **NEW** - Campaign management UI in Settings
- [x] ~~Bulk messaging (promos, reminders)~~ ✅ **Partial** - UI button in Customer list
- [x] ~~Segment-based exports~~ ✅ **Completed** - Filter by VIP/New/Regular before exporting

### Reviews
- [x] ~~Provider Ratings~~ ✅ **Completed** - Rating display on provider cards
- [x] ~~Recent Reviews~~ ✅ **Completed** - Review list on stylist profile page

---

## 📅 Booking Management

### Appointments Dashboard
- [x] ~~Calendar View~~ ✅ **Completed** - Weekly calendar in stylist dashboard
- [x] ~~All Appointments View~~ ✅ **Completed** - List view with advanced filters (status, provider, search) and CSV export
- [x] ~~Appointment Actions~~ ✅ **Completed** - Book, reschedule, cancel, approve blocked-time requests
- [x] ~~Blocked Time Management~~ ✅ **Completed** - Add/view blocked slots with approval workflow

### Booking Policies
- [x] ~~Cancellation Rules~~ ✅ **Completed** - Minimum notice period, cancellation fee thresholds configurable per location
- [x] ~~Deposit System~~ ✅ **Completed** - Require deposits for services, deposit amount configurable per location
- [x] ~~No-show consequences~~ ✅ **Completed** - Configurable no-show fees and ban thresholds

---

## 💰 Financial Features

### Revenue Tracking
- [x] ~~Revenue Display~~ ✅ **Completed** - Shows monthly revenue per provider in admin

### Payment Processing
- [x] ~~In-App Payments~~ ✅ **NEW** - Card on file, deposits, tips, Apple Pay/Google Pay
- [x] ~~Cash Tracking~~ ✅ **Completed** - Record and display cash transactions in Revenue tab
- [x] ~~Refund Management~~ ✅ **Completed** - Process and track refunds in transaction list

### Provider Compensation
- [x] ~~Commission Model~~ ✅ **Completed** - Revenue and commission tracking per provider
- [x] ~~Salary + Commission~~ ✅ **Completed** - Base pay + performance calculations
- [x] ~~Payout Reports~~ ✅ **Completed** - Payout estimation in Payments view

---

## 🛠️ Service Catalog

### Service Management
- [x] ~~Service CRUD~~ ✅ **Completed** - Add/edit/delete services with name, price, duration, category

### Service Options
- [x] ~~Add-ons~~ ✅ **Completed** - Deep conditioning, scalp massage, gloss treatment, etc.
- [x] ~~Variants~~ ✅ **Completed** - Short/long hair pricing, gel polish, nail art options

### Service Categories
- [x] ~~Categories~~ ✅ **Completed** - Hair, Nails, Spa, Beauty, Massage

---

## 📊 Reporting & Analytics

### Dashboard Widgets
- [x] ~~Key Metrics~~ ✅ **Completed** - Providers, services, locations, revenue stats in admin overview

### Reports
- [x] ~~Provider Performance~~ ✅ **Completed** - Appointments, revenue, ratings shown per provider
- [x] ~~Customer Insights~~ ✅ **Completed** - Retention rate, visit frequency, lifetime value in Analytics dashboard
- [x] ~~Location Comparison~~ ✅ **Completed** - Revenue per location, customer distribution in Analytics dashboard

---

## 🔔 Notifications & Reminders

### Automated Messages
- [x] ~~Appointment Reminders~~ ✅ **Completed** - Cron job for 8PM nightly reminders
- [x] ~~Confirmation Messages~~ ✅ **Completed** - Alert on successful booking

### Template Management
- [x] ~~SMS Templates~~ ✅ **Completed** - Edit confirmation, reminder, cancellation messages with placeholders

- [x] **Email Templates** ✅ **NEW** - Booking confirmation, reminder, cancellation, and marketing email templates with placeholders

---

## 🔐 Roles & Permissions

### User Roles
- [x] ~~Admin~~ ✅ **Completed** - Full admin dashboard access
- [x] ~~Location Manager~~ ✅ **Completed** - Access to operational dashboard features
- [x] ~~Provider~~ ✅ **Completed** - Provider dashboard with own schedule
- [x] ~~Front Desk/Receptionist~~ ✅ **Completed** - Access to appointments, customers, and check-ins only

---

## 📱 Customer App Enhancements

### Consumer Features
- [x] ~~My Bookings~~ ✅ **Completed** - Customer booking flow
- [x] ~~In-App Payments~~ ✅ **Completed** - Save card, pay deposits, tip within app

- [x] ~~Waitlist~~ ✅ **Completed** - Queue management, position tracking, notify/book/remove actions

- [x] **Reviews** ✅ **NEW** - Rate appointment, leave feedback, public reviews on profile with helpful/respond features

---

## 🔄 Integrations

### External Systems
- [x] ~~Google Calendar~~ ✅ **NEW** - Sync provider schedules, customer calendar invites
- [x] ~~Accounting~~ ✅ **NEW** - QuickBooks and Xero integration UI
- [x] **Marketing** ✅ **NEW** - Mailchimp, Klaviyo, and Twilio SMS integrations with campaign management

- [x] **POS Systems** ✅ **NEW** - Square and Clover payment terminals with transaction tracking
  - Square integration
  - Clover
  - In-person payment sync

---

## 🚀 Future Roadmap (V2+)

- [x] **Loyalty/Rewards Program** ✅ **NEW** - Bronze/Silver/Gold tiers with points per dollar, birthday bonuses, and rewards redemption

- [x] **Gift Cards** ✅ **NEW** - Purchase, send via email, redeem for services with templates and expiry tracking

- [x] ~~Membership Subscriptions~~ ✅ **Completed** - Monthly tiers (Gold/Silver) with unlimited benefits
  - Monthly packages
  - Unlimited services tiers

- [x] **Multi-Language App** ✅ **NEW** - English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, Arabic with auto-detect

- [x] **Accessibility Features** ✅ **NEW** - Screen reader support, large text mode, high contrast mode, reduce motion options

- [x] **API for Third-Party Apps** ✅ **NEW** - API key management, endpoints documentation (appointments, services, providers, customers)
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
3. ~~Customer detailed profiles with notes~~ Done
4. ~~Location settings (booking policies)~~ Done
5. ~~Walk-in booking support~~ Done
6. ~~Customer export functionality~~ Done
7. ~~SMS template management~~ Done
8. ~~Email templates~~ ✅ **NEW** - Rich email content with placeholders

### Phase 3
1. Payment processing
2. Provider commission tracking
3. Payout reports

### Phase 4
1. Analytics dashboard
2. Marketing automation
3. Third-party integrations

---

## ✅ Recently Completed (Feb 2026)
- **Membership Subscriptions** - Unlimited service tiers (Gold/Silver) added to Subscriptions tab
- **POS & SMS Integrations** - Connection UI for Square, Clover, and Twilio added to Settings
- **Role-Based Access (RBAC)** - Filtered admin dashboard views for Admin, Manager, and Receptionist roles
- **Appointment Photos** - Before and after photo tracking in customer profiles
- **Business Integrations** - Connection UI for accounting and calendar tools
- **Stylist Reviews** - Recent reviews and star ratings displayed on stylist profiles
- **In-App Payments & Cash Tracking** - Transaction logs for cards, cash, deposits, and tips
- **Cancellation & Deposit Rules** - Configurable per-location booking policies with fee and deposit tracking
- **Team Lead Assignment** - Visibility of team leads in the Teams view
- **Enhanced Appointments View** - Advanced filters (status, provider, search) and CSV export functionality
- **Customer Communication Preferences** - SMS/Email/Marketing opt-in UI
- **Service Add-ons & Variants** - Deep conditioning, scalp massage, short/long hair pricing
- **Reviews System** - Provider ratings (4.0-5.0) and recent reviews display
- **Buffer Time Configuration** - 15min default buffer shown in location policies
- **Admin Dashboard Tabs** - Appointments, Payments, Teams, Roles, Staff, Customers, Services, Locations, Analytics, Settings

---

## 💡 Random Ideas

- **AI Scheduling Assistant** - Auto-recommend optimal times
- **Virtual Consultations** - Video call before appointment
- **AR Preview** - Show how haircut might look
- **Social Sharing** - Share new look on Instagram
- [x] ~~Appointment Photos~~ ✅ **NEW** - Before/after photos in customer profiles
- **Recipe Sharing** - Hair care product recommendations
- [x] ~~Group Bookings~~ ✅ **NEW** - Bridal parties, birthdays, corporate events with coordinator
- [x] ~~E-Gift Cards~~ ✅ **NEW** - Gift card management with code, value, balance tracking
- [x] ~~Loyalty/Rewards Program~~ ✅ **NEW** - Points per dollar, tiers (Bronze/Silver/Gold/Platinum), birthday bonuses
- [x] ~~Subscription Boxes~~ ✅ **NEW** - Monthly product boxes management in Subscriptions tab
- [x] ~~QR Code Check-in~~ ✅ **NEW** - Contactless arrival with scan tracking and check-in logs

---

## 📝 Notes

- Need to consider GDPR/data privacy for EU customers
- Consider HIPAA if adding health/beauty consultations
- Offline mode for areas with poor connectivity
- Battery-efficient location tracking
- App size optimization

---

## 🚀 Future Roadmap (V3+)

### 📱 Customer App Enhancements
- **Customer Loyalty Dashboard** - View points balance, tier status, and rewards redemption history in mobile app
- **Push Notifications** - Appointment reminders, waitlist updates, promotional alerts
- **In-App Messaging** - Chat with salon staff directly
- **Appointment History** - Complete service history with photos and notes
- **Favorite Providers** - Quick access to preferred stylists
- **Smart Recommendations** - AI-suggested services based on past appointments

### 📦 Inventory & Products
- **Product Inventory Management** - Track retail products in stock
- **Point-of-Sale Integration** - Sell retail items with appointments
- **Product Recommendations** - Suggest products based on services rendered
- **Inventory Alerts** - Low stock notifications

### 👥 Employee Management
- **Commission Tracking** - Per-service commission calculations
- **Employee Scheduling** - Drag-and-drop weekly schedules
- **Time Off Requests** - PTO request workflow
- **Performance Reports** - Revenue per employee, appointment count, customer satisfaction

### 💳 Payments & Billing
- **Auto-Pay Subscriptions** - Monthly membership billing
- **Package Tracking** - Prepaid service packages (10 visits remaining)
- **Group Packages** - Bulk service packages for teams/families
- **Partial Payments** - Deposit + balance payment flow

### 🌐 Public Booking Page
- **Standalone Booking URL** - Shareable booking page for new customers
- **Provider Selection** - Customer chooses specific stylist
- **Service Menu Display** - Public-facing pricing and descriptions
- **Real-Time Availability** - Live appointment slots

### 📊 Analytics & Reports
- **Revenue Analytics Dashboard** - Charts, trends, comparisons
- **Customer Insights** - Retention rate, lifetime value, demographics
- **Popular Services Report** - Most booked services, peak hours
- **Export Reports** - PDF/Excel reports for accountants

### 🤖 Automation
- **Automated Review Requests** - Post-appointment review invites
- **Birthday Campaigns** - Automated birthday discounts
- **Win-Back Campaigns** - Re-engage inactive customers
- **No-Show Reminders** - Extra reminder 2 hours before

### 🔐 Security & Compliance
- **Two-Factor Authentication** - Extra login security
- **Audit Log** - Track all admin actions
- **Data Export** - GDPR compliance data downloads
- **Session Management** - Force logout remote sessions

---

*Document updated: 2026-02-11 - Fixed SQL syntax error in supabase-updates.sql (malformed receipt_number column), verified Expo server running on all interfaces*
