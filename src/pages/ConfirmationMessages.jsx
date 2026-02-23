import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ConfirmationMessages() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      // Fetch both SMS confirmation and email confirmation templates
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .in('template_type', ['confirmation', 'email_confirmation']);
      if (error) {
        console.error('Error fetching confirmation templates', error);
        setTemplates([]);
      } else {
        setTemplates(data);
      }
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  if (loading) return <div>Loading confirmation templates…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Confirmation Message Templates</h1>
      <div className="space-y-4">
        {templates.map(t => (
          <div key={t.id} className="border rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <div className="flex gap-2">
                {t.is_sms && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">SMS</span>}
                {t.is_email && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Email</span>}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-medium">Type:</span> {t.template_type.replace('_', ' ')}
            </p>
            <pre className="bg-white border rounded p-3 text-sm whitespace-pre-wrap font-mono">
              {t.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
