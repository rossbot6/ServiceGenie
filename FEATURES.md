# ServiceGenie - Features Guide

> Last updated: 2026-02-05  
> A mobile-first salon appointment booking platform built with Expo Router

---

## 📱 App Overview

ServiceGenie is a professional beauty service booking application that connects customers with stylists. It features a dual-interface design:
- **Customer App**: Beautiful consumer-facing booking experience
- **Provider Dashboard**: Powerful management tools for stylists

---

## 🎯 Customer-Facing Features

### 1. Home Screen (`app/index.jsx`)

**Design:**
- Dark-themed UI with modern gradient aesthetics
- Hero section with "AI-Powered Scheduling" badge
- Responsive card-based stylist listings
- Clean typography hierarchy

**Functionality:**
- Browse available stylists with profile images
- View stylist specialties and ratings
- Quick access to booking flow
- "Provider Login" link for stylists to access dashboard
- Genie Reminders info card (SMS confirmation system)

**Stylist Cards Display:**
- Profile photo with rounded corners
- Name and specialty
- Star rating with review count
- Navigation chevron

---

### 2. Booking Flow (`app/book/[id].jsx`)

**Date Selection:**
- Horizontal date picker (5-day rolling window)
- Visual selection state (purple highlight)
- Day name + date number format
- Auto-generates next 5 days from current date

**Dynamic Time Slots:**
- Real-time availability calculation
- Respects stylist working hours (per-day schedules)
- Filters out blocked slots (lunch breaks, time off)
- Only shows valid appointment times
- Grid layout with selection states

**Booking Confirmation:**
- Validates time selection before booking
- Success alert with appointment details
- "Genie Reminders" promise (SMS at 8PM night before)

**Key Features:**
- Smart availability logic
- Empty state handling ("No availability on this date")
- Visual feedback for selection

---

## 💼 Stylist Dashboard (`app/stylist/dashboard.jsx`)

### Dashboard Header
- Stylist name and role
- Settings access
- Dark professional theme

### Tab Navigation
4 main views with horizontal scrolling tabs:
1. **Daily** - Day's appointments
2. **Calendar** - Interactive weekly view
3. **Contacts** - Client list
4. **Blocked** - Unavailable time management

---

### Daily View

**Today's Appointments List:**
- Time-block cards with duration
- Client name display
- Service type shown
- Status badges (confirmed/pending)
- "Book Client" quick action button

**Card Layout:**
- Time column (HH:mm format)
- Duration indicator
- Status pill (color-coded)
- Clean, scannable design

---

### Calendar View (`components/WeeklyCalendar.jsx`)

**Interactive Weekly Grid:**
- Monday-Friday columns
- 8 AM - 6 PM time range
- 30-minute slot granularity
- Horizontal scroll if needed

**Drag-to-Schedule:**
- Touch and drag to select time range
- Visual overlay during selection
- Shows selected duration
- Past time slots disabled (dimmed)

**Existing Appointments:**
- Rendered as purple blocks
- Auto-sized to duration
- Shows client name
- Click to view details (future)

**Modal Booking Form:**
- Opens after drag selection
- Client name search/entry
- Autocomplete from existing customers
- Phone number lookup
- Time slot confirmation
- Duration auto-calculated

**Smart Features:**
- Past time blocking
- Overlap detection
- Customer lookup from database
- Keyboard avoiding modal

---

### Contacts View

**Client List:**
- All linked customers
- Alphabetically sorted
- Quick actions:
  - Avatar with initials
  - Phone number
  - "Book" quick action

**Data Source:**
- Customers linked to stylist
- Contact details visible
- Easy rebooking

---

### Blocked Times View

**Time Off Management:**
- View all unavailable slots
- Block new time ranges
- Reason for blocking
- Date/time display

**Block Types:**
- Lunch breaks
- Personal time off
- Emergency closures
- Custom reasons

---

## 🗄️ Data Architecture

### Mock Data Structure (`data/mockData.json`)

**Stylists:**
```json
{
  "id": "stylist_001",
  "name": "Elena Rodriguez",
  "specialty": "Master Hair Stylist",
  "image": "url",
  "workingHours": {
    "monday": { "start": "09:00", "end": "17:00" },
    // ... per-day schedules
  }
}
```

**Customers:**
```json
{
  "id": "cust_001",
  "name": "Sarah Parker",
  "phone": "+15550123",
  "linkedStylists": ["stylist_001", "stylist_002"]
}
```

**Appointments:**
```json
{
  "id": "app_001",
  "stylistId": "stylist_001",
  "customerId": "cust_001",
  "date": "2026-02-05",
  "time": "10:30",
  "duration": 60,
  "status": "pending"
}
```

**Blocked Slots:**
```json
{
  "id": "block_001",
  "stylistId": "stylist_001",
  "date": "2026-02-05",
  "startTime": "13:00",
  "endTime": "14:00",
  "reason": "Lunch Break"
}
```

---

## 🎨 Design System

### Color Palette
- **Background**: `#0f172a` (slate-900)
- **Surface**: `#1e293b` (slate-800)
- **Primary**: `#6366f1` (indigo-500)
- **Primary Light**: `#818cf8` (indigo-400)
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#94a3b8` (slate-400)
- **Text Muted**: `#64748b` (slate-500)
- **Success**: `#10b981` (emerald-500)
- **Warning**: `#f59e0b` (amber-500)
- **Danger**: `#ef4444` (red-500)

### Typography
- **Headers**: 800 weight, tight letter-spacing
- **Body**: 400-600 weight
- **Labels**: 700 weight, uppercase
- **Sizes**: 10-32px range

### Components
- **Cards**: Rounded corners (16-20px), subtle borders
- **Buttons**: Rounded (12-20px), shadow effects
- **Inputs**: Rounded (12px), dark backgrounds
- **Modals**: Large rounded (24px), keyboard avoidance

---

## 🔧 Technical Stack

### Core
- **Framework**: React Native (0.81.5)
- **Platform**: Expo 54.0.33
- **Router**: Expo Router 6.0.23
- **Language**: TypeScript 5.9

### Navigation
- **Stack Navigation**: Modal presentations
- **Deep Linking**: `servicegenie://` scheme
- **Typed Routes**: Enabled in experiments

### UI & Styling
- **Icons**: Lucide React Native
- **Images**: Expo Image
- **Fonts**: Expo Font
- **Haptics**: Expo Haptics
- **Safe Areas**: React Native Safe Area Context

### Data & Time
- **Date Handling**: date-fns 4.1.0
- **Calendar**: Custom WeeklyCalendar component
- **Time Slots**: 30-minute granularity

### Development
- **Linting**: ESLint + Config Expo
- **Type Safety**: TypeScript strict mode
- **Compiler**: React Compiler enabled

---

## 🔜 Planned Features

- [ ] SMS/Email notifications (Twilio integration)
- [ ] Payment processing (Stripe)
- [ ] Calendar sync (Google/Apple)
- [ ] Multiple service types
- [ ] Pricing display
- [ ] Appointment history
- [ ] Customer preferences
- [ ] Review system
- [ ] Multiple location support
- [ ] Team management
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Apple/Google Sign-In
- [ ] Email confirmations
- [ ] Waitlist functionality
- [ ] Recurring appointments

---

## 📁 Project Structure

```
ServiceGenie/
├── app/
│   ├── _layout.jsx          # Root layout + navigation stack
│   ├── index.jsx            # Home screen
│   ├── book/
│   │   └── [id].jsx         # Booking flow
│   └── stylist/
│       └── dashboard.jsx    # Provider dashboard
├── components/
│   ├── WeeklyCalendar.jsx   # Drag-to-schedule grid
│   ├── haptic-tab.tsx       # Tab with haptics
│   ├── parallax-scroll-view.tsx
│   └── ui/                  # Reusable UI components
├── data/
│   └── mockData.json        # Demo data
├── constants/
│   └── theme.ts             # Design tokens
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── assets/
│   ├── images/              # App icons + splash
│   └── fonts/
└── package.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run web version
npm run web
```

---

## 📝 Notes

- Currently using mock data (replace with real backend)
- SMS reminders are UI-only (needs Twilio/backend integration)
- Dashboard is hardcoded to stylist_001 for demo
- Calendar only shows current week (add week navigation)
- All state is local (add persistence/realtime sync)
