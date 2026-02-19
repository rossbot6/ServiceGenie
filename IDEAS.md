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
- [ ] Location Settings
  - [x] Booking policies (cancellation, rescheduling, deposits)
  - [x] Buffer time between appointments
  - [x] Lead time for bookings
  - [x] Default appointment duration

### Multi-Timezone Support
- [x] Display times in customer's local timezone
- [ ] Provider schedules in location timezone
- [ ] Automated timezone conversions

---

## 👥 Provider (Stylist) Management

### CRUD Operations
- [x] Add Provider
- [x] Manage Provider Profile
- [x] Schedule Management
- [x] Provider Status

### Advanced Provider Features
- [ ] Performance Metrics
- [ ] Team Management
- [ ] Team Lead Assignment
- [ ] Cross-training visibility

---

## 👤 Customer Management

### Customer Profiles
- [x] Basic Info
- [x] Communication Preferences
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
- [ ] Blocked Time Management

### Booking Policies
- [x] Cancellation Rules
- [x] Deposit System
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

*Document reset for NoExpo branch - all features pending implementation*
