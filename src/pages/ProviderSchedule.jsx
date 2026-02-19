import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export default function ProviderSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules() {
      const { data, error } = await supabase
        .from('provider_schedules')
        .select('*');
      if (error) {
        console.error('Error loading schedules') error);
        setSchedules([]);
      } else {
        setSchedules(data);
      }
      setLoading(false);
    }
    fetchSchedules();
  }, []);

  if (loading) return <div>Loading provider schedules…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Provider Schedules</h1>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Provider ID</th>
            <th className="border px-2 py-1">Start Time</th>
            <th className="border px-2 py-1">End Time</th>
            <th className="border px-2 py-1">Location ID</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="odd:bg-white even:bg-gray-50">
              <td className="border px-2 py-1">{s.id}</td>
              <td className="border px-2 py-1">{s.provider_id}</td>
              <td className="border px-2 py-1">{s.start_time}</td>
              <td className="border px-2 py-1">{s.end_time}</td>
              <td className="border px-2 py-1">{s.location_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
