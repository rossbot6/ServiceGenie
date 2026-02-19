// Simple timezone conversion helper
export function toLocalTime(timeStr, sourceTz, targetTz = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  // timeStr is in HH:mm:ss format, sourceTz is IANA string
  const [h, m, s] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, s ?? 0);
  // Build ISO string with source timezone offset using Intl
  const fmt = new Intl.DateTimeFormat('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', 
    timeZone: sourceTz,
    hour12: false 
  });
  const parts = fmt.formatToParts(date);
  const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}T${timeStr}`;
  const dt = new Date(iso + 'Z'); // treat as UTC then adjust
  return dt.toLocaleString('en-US', { timeZone: targetTz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
