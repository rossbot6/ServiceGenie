import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function NotificationMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase.from('notifications').select('*');
      if (error) {
        console.error('Error fetching notifications', error);
        setMessages([]);
      } else {
        setMessages(data);
      }
      setLoading(false);
    }
    fetchMessages();
  }, []);

  if (loading) return <div>Loading notifications…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notification Messages</h1>
      <ul>
        {messages.map(m => (
          <li key={m.id} className="mb-2">
            <strong>{m.title}</strong>: {m.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
