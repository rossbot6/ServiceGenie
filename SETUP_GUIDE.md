# Database Setup Guide

## Current Status 🟡

The ServiceGenie application infrastructure is ready:
- ✅ React App: http://localhost:8081
- ✅ Local API: http://localhost:3001  
- ✅ Supabase Backend: http://localhost:8000
- ⚠️ Database Schema: Needs to be applied

## Quick Setup Steps

### 1. Apply Database Schema
**Best Option:**
1. Open browser: http://localhost:8000/studio
2. Click "SQL Editor" in left sidebar
3. Open `supabase-schema.sql` file
4. Copy ALL content 
5. Paste into SQL Editor
6. Click "Run" button

**Alternative:**
```bash
# If Docker is accessible:
docker exec -it servicegenie-postgres psql -U postgres -d postgres
# Then paste schema content
```

### 2. Add Sample Data (Optional)
After schema is applied, run the sample data script:
1. In same SQL Editor, open `sample-data.sql`
2. Copy content and run

**Sample data includes:**
- 2 salon locations (Downtown, Brooklyn)  
- 4 providers/stylists
- 8+ services with realistic pricing
- 5+ customers with visit history

## Verification Steps

After schema application:

1. **Test Local API:** 
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Database:**
   - API endpoints should return 200 status
   - Sample data will show actual salon data

3. **Test App:**
   - Visit: http://localhost:8081/admin
   - Try "Configure Settings" on locations
   - Check provider schedule management

## What's Created

**Tables:**
- `customers` - Client management
- `providers` - Stylist profiles  
- `locations` - Salon locations
- `services` - Service catalog
- `appointments` - Booking records
- `provider_schedules` - Availability settings
- `location_settings` - Business policies

**Features Ready:**
- Complete location settings management
- Full provider schedule system
- Enhanced stylist dashboard
- Sample data for testing

## Troubleshooting

**If Supabase Studio isn't accessible:**
- Verify Docker is running properly
- Check if Supabase services are active

**If schema application fails:**
- Try one statement at a time (remove semicolons)
- Check for syntax errors
- Verify database permissions

The development environment is fully functional once the schema is applied! 🚀