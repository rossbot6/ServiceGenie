import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export default function AppointmentReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReminders() {
      const { data, error } = await supabase.from('appointments').select('*, customers(name, email), providers(name)')
        .gt('date', new Date().toISOString().split('T')[0])
        .order('date');
      if (error) {
        console.error('Error fetching reminders', error);
        setReminders([]);
      } else {
        setReminders(data);
      }
      setLoading(false);
    }
    fetchReminders();
  }, []);

  if (loading) return <div>Loading reminders…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Appointment Reminders</h1>
      <ul>
        {reminders.map(a => (
          <li key={a.id} className="mb-2">
            {a.date} {a.start_time} - {a.end_time} – {a.customer?.name} with {a.provider?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
