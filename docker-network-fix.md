# Windows Docker Desktop Host-to-Docker Networking Fix

## 🚀 Solution 1: Enable Docker Daemon TCP Access (Recommended)

### Step 1: Enable Docker Daemon TCP
1. **Open Docker Desktop Settings** → Go to "General" tab
2. **Check "Expose daemon on tcp://localhost:2376 without TLS"**
3. **Apply & Restart** Docker Desktop

### Step 2: Set Environment Variable
```powershell
# Add to your system environment (or current session)
$env:DOCKER_HOST = "tcp://localhost:2376"
```

### Step 3: Test Connection
```bash
curl http://localhost:3001/api/providers
```

## 🔥 Solution 2: Windows Firewall Configuration

### Allow Docker Through Windows Firewall:
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Docker TCP" dir=in action=allow protocol=TCP localport=2376
netsh advfirewall firewall add rule name="Docker TCP" dir=out action=allow protocol=TCP localport=2376
```

### Alternative: Disable Windows Defender Firewall (Development Only)
```powershell
# Run as Administrator - TEMPORARY SOLUTION
netsh advfirewall set allprofiles state off
```

## 🔧 Solution 3: Docker Desktop Network Settings

### Switch WSL2 Integration:
1. **Settings** → **Resources** → **WSL Integration**  
2. **Enable all recommended settings**
3. **Apply & Restart**

### Network Mode Check:
- **Settings** → **Docker Engine**
- Ensure JSON configuration doesn't override networking

## 🌐 Solution 4: Use Docker Compose Port Mapping

### Check your docker-compose.yml port mappings:
```yaml
services:
  postgres:
    ports:
      - "5432:5432"        # Host:Container mapping
  api:
    ports:
      - "3001:3001"
```

### Restart services after port mapping changes:
```bash
docker compose down
docker compose up -d
```

## 🛠️ Solution 5: Alternative API Setup (Quick Fix)

### Create a proxy API that uses Docker exec:
- Instead of direct TCP connection
- Use Docker CLI commands inside your API server
- Bypass network issues entirely

## 📋 Quick Diagnostic Commands

### Test Docker Connectivity:
```bash
# Test direct PostgreSQL connection
docker exec supabase-db psql -U supabase_admin -d postgres -c "SELECT 1;"

# Test host networking
curl -v http://localhost:3001/health

# Check Docker Desktop status
docker info | grep -i network
```

## 🎯 Recommended Approach

1. **Start with Solution 1** (Enable TCP daemon)
2. **Add Solution 2** if firewall issues persist  
3. **Use Solution 5** as fallback if networking can't be resolved

## ⚠️ Security Note
- TCP access without TLS should **only** be used for local development
- Never enable in production environments