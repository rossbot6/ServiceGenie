# ServiceGenie - Feature Ideas & Roadmap

> Plain React + Vite Rewrite  
> Branch: NoExpo  
> Created: 2026-02-11

---

## Notes:
- Use 12 hour AM/PM time format.
- Local supabase backend at http://locallhost:8000
- Create backend tables, views, etc. and update supabase-schema.sql
- Use "NoExpo" branch

---

## 🎯 Core Vision

Multi-location salon management platform with admin dashboard for franchise/chain management.

---

## 🏢 Multi-Location Architecture

- [ ] Look at FEATURES.MD and convert to plain React with no Expo, when finished, use it along side this document.

### Database
- [ ] Read supabase-schema.sql 

### Source Clean-Up
- [x] Remove any old references and files pertaining to expo

### Salon Management
- [x] Add/Edit/Delete Locations
- [x] Location Settings ✅ COMPLETED
  - [x] Booking policies (cancellation, rescheduling, deposits)
  - [x] Buffer time between appointments
  - [x] Lead time for bookings
  - [x] Default appointment duration
  - [x] No-show policies & ban thresholds
  - [x] Business hours management
  - [x] Advanced settings (rush booking, waitlist)
  - [x] Notification preferences

### Multi-Timezone Support
- [ ] Display times in customer's local timezone
- [ ] Provider schedules in location timezone
- [ ] Automated timezone conversions

---

## 👥 Provider (Stylist) Management

### CRUD Operations
- [x] Add Provider
- [x] Manage Provider Profile ✅ COMPLETED
- [x] Schedule Management ✅ COMPLETED
  - [x] Weekly availability grid (16-hour slots)
  - [x] Bulk time slot toggling 
  - [x] Blocked time management
  - [x] Schedule settings & preferences
- [x] Provider Status ✅ COMPLETED
  - [x] Available/Busy/Break/Unavailable status management
  - [x] Status change quick actions and tracking
  - [x] Break duration timer
  - [x] Status notes and reason for unavailability

### Advanced Provider Features
- [ ] Performance Metrics
- [ ] Team Management
- [ ] Team Lead Assignment
- [ ] Cross-training visibility

---

## 👤 Customer Management

### Customer Profiles
- [x] Basic Info
- [ ] Communication Preferences
- [x] Visit History
- [x] Notes & Tags

### Customer Actions
- [x] Search & Filter
- [x] Customer Export
- [ ] Communications

### Reviews
- [ ] Provider Ratings
- [ ] Recent Reviews

---

## 📅 Booking Management

### Appointments Dashboard
- [x] Calendar View
- [x] All Appointments View
- [x] Appointment Actions
- [x] Blocked Time Management ✅ COMPLETED
  - [x] Add/remove blocked time slots directly in appointment calendar
  - [x] Blocked time types (break, vacation, training, personal)
  - [x] Time slot blocking in daily schedule preview
  - [x] Visual indication of blocked times vs available appointments

### Booking Policies
- [ ] Cancellation Rules
- [ ] Deposit System
- [ ] No-show consequences

---

## 💰 Financial Features

### Revenue Tracking
- [x] Revenue Display

### Payment Processing
- [ ] In-App Payments
- [ ] Cash Tracking
- [ ] Refund Management

### Provider Compensation
- [x] Commission Model
- [ ] Salary + Commission
- [x] Payout Reports

---

## 📱 Customer App Enhancements

- [x] My Bookings
- [ ] Waitlist
- [ ] Reviews
- [x] Group Bookings

---

## 🔔 Notifications & Reminders

- [ ] Appointment Reminders
- [ ] Confirmation Messages
- [ ] SMS Templates
- [ ] Email Templates

---

## 🔐 Roles & Permissions

- [ ] Admin
- [ ] Location Manager
- [ ] Provider
- [ ] Front Desk/Receptionist

---

## 🔄 Integrations

- [ ] Google Calendar
- [ ] QuickBooks / Xero
- [ ] Mailchimp / Klaviyo
- [ ] Square / Clover

---

## 📊 Reporting & Analytics

- [ ] Dashboard Widgets
- [ ] Provider Performance
- [ ] Customer Insights
- [ ] Location Comparison

---

## 🔄 API Integration & Data Persistence

### Enhanced API Server
- [x] **Complete API Integration** ✅ COMPLETED
  - [x] JSON file persistence with graceful database fallback
  - [x] All CRUD endpoints for providers, schedules, locations, customers, services
  - [x] Provider status tracking with persistence
  - [x] Schedule management with weekly grid persistence
  - [x] Location settings with complete business policy save
  - [x] Blocked time management with API backing

### Frontend Integration
- [x] React components updated with real API calls
- [x] ProviderStatus: Real-time status saving and loading
- [x] ProviderSchedule: Complete schedule persistence with save UI
- [x] BlockedTimeManager: API-backed blocked time operations
- [x] LocationSettings: Full business policy configuration save

### Data Persistence System
- [x] Local JSON file storage at `local-data.json`
- [x] Provider status stored as `provider-{id}-status`
- [x] Schedule data saved as `provider-{id}-schedule`
- [x] Location settings stored as `location-{id}-settings`
- [x] Blocked times saved as `provider-{id}-blocked-times`
- [x] Data survives server restarts and application reloads

### Test Coverage
- [x] All 12+ API endpoints tested and verified
- [x] Data loading and saving across all components
- [x] Frontend-backend integration complete
- [x] React dev server running on port 5173
- [x] Enhanced API server running on port 3001

---

*Document reset for NoExpo branch - all features pending implementation*
