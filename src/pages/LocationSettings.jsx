import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export default function LocationSettings() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Error fetching locations', error);
        setLocations([]);
      } else {
        setLocations(data);
      }
      setLoading(false);
    }
    fetchLocations();
  }, []);

  if (loading) return <div>Loading locations…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Location Settings</h1>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Timezone</th>
            <th className="border px-2 py-1">Policy</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(loc => (
            <tr key={loc.id} className="odd:bg-white even:bg-gray-50">
              <td className="border px-2 py-1">{loc.name}</td>
              <td className="border px-2 py-1">{loc.address}</td>
              <td className="border px-2 py-1">{loc.phone}</td>
              <td className="border px-2 py-1">{loc.timezone}</td>
              <td className="border px-2 py-1">{JSON.stringify(loc.booking_policy)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
