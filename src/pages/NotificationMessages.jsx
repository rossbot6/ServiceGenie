import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function NotificationMessages() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase.from('notification_templates').select('*').order('template_type');
      if (error) {
        console.error('Error fetching notification templates', error);
        setTemplates([]);
      } else {
        setTemplates(data);
      }
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  if (loading) return <div>Loading notification templates…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notification Templates</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SMS</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Content Preview</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id} className="border-b">
                <td className="px-4 py-2 capitalize">{t.template_type.replace('_', ' ')}</td>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.is_sms ? '✅' : '❌'}</td>
                <td className="px-4 py-2">{t.is_email ? '✅' : '❌'}</td>
                <td className="px-4 py-2 truncate max-w-xs" title={t.content}>{t.content.substring(0, 60)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
