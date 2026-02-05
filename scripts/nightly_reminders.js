const fs = require('fs');
const path = require('path');
const { addDays, format } = require('date-fns');

const dataPath = path.join(__dirname, '../data/mockData.json');

function runReminders() {
  console.log('--- Starting Nightly Appointment Reminders ---');
  
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found!');
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  
  console.log(`Checking for appointments on: ${tomorrow}`);

  const tomorrowApps = data.appointments.filter(app => app.date === tomorrow);

  if (tomorrowApps.length === 0) {
    console.log('No appointments for tomorrow.');
    return;
  }

  tomorrowApps.forEach(app => {
    const stylist = data.stylists.find(s => s.id === app.stylistId);
    const customer = data.customers.find(c => c.id === app.customerId);
    
    if (stylist && customer) {
      const message = `Hi ${customer.name}, this is ServiceGenie! Just a reminder for your appointment with ${stylist.name} tomorrow at ${app.time}. Please reply YES to confirm or NO to reschedule.`;
      console.log(`[SMS] Sending to ${customer.phone}: "${message}"`);
    }
  });

  console.log(`Processed ${tomorrowApps.length} reminders.`);
  console.log('--- Reminders Complete ---');
}

runReminders();
