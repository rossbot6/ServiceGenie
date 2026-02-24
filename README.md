# ServiceGenie - Salon Booking Platform

## 🏁 Quick Start

```bash
# Start everything
./start-servicegenie.sh

# Stop everything  
./stop-servicegenie.sh
```

Then visit: http://localhost:8081

## 🏢 Architecture

```
ServiceGenie/
├── React + Vite Frontend (Port 8081)
├── Local API Server (Port 3001) 
├── PostgreSQL Database (Port 54322)
└── Docker Container
```

## 🔗 API Endpoints

- **Health**: `GET /health`
- **Providers**: `GET /api/providers`
- **Customers**: `GET /api/customers` 
- **Services**: `GET /api/services`
- **Appointments**: `GET /api/appointments?providerId=X&date=YYYY-MM-DD`

## 🛠️ Development Setup

### Prerequisites
- Docker Desktop
- Node.js (for React dev server + API)

### Manual Setup

```bash
# 1. Start database
cd ServiceGenie
docker compose -f docker-compose-supabase.yml up -d

# 2. Start API server
node local-api-simple.cjs &

# 3. Start React app
npm run dev
```

## 🚀 Current Features

✅ **Working Components:**
- Customer management
- Provider directory
- Service catalog  
- Appointment booking
- Dashboard interface
- Local database with full schema

🔄 **Development Ready:**
- React 19 + Vite
- Tailwind CSS styling
- Modern responsive design
- Docker containerized backend

## 📊 Database Schema

Loaded tables:
- `customers` - Client profiles
- `providers` - Stylist accounts
- `services` - Service catalog
- `appointments` - Booking records
- `blocked_times` - Unavailable slots
- `locations` - Salon locations
- `settings` - App configuration
- + more supporting tables

## 🔧 Troubleshooting

**API not responding?**
```bash
# Check if services are running
curl http://localhost:3001/health

# Restart API server
pkill -f "node.*local-api-simple.cjs"
cd ServiceGenie && node local-api-simple.cjs
```

**Database not connecting?**
```bash
# Restart PostgreSQL container
docker compose -f ServiceGenie/docker-compose-supabase.yml restart
```

**React app not loading?**
```bash
# Check dev server logs
tail -f react.log
```

## 📝 Environment Configuration

ServiceGenie uses `.env` files for configuration:

### `.env` (ServiceGenie/)
```bash
EXPO_PUBLIC_SUPABASE_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_ANON_KEY=local-dev-key
EXPO_PUBLIC_API_BASE=http://localhost:3001
```

## 🎨 Design System

- **Theme**: Dark mode first
- **Colors**: Slate backgrounds, indigo accents, emerald success
- **Components**: Tailwind CSS + custom UI components
- **Icons**: Lucide React
- **Calendar**: Custom drag-to-schedule interface

## 🤝 Contributing

1. Start the development environment: `./start-servicegenie.sh`
2. Make changes to React components
3. API changes go to `local-api-simple.cjs`
4. Database schema changes: Update `supabase-schema.sql`

## 📞 Status

🎉 **Fully Operational** - Ready for feature development!

- ✅ Local development environment setup
- ✅ Database with loaded schema  
- ✅ API server providing REST endpoints
- ✅ React app with modern tooling
- ✅ Docker containerization complete