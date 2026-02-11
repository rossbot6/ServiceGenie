import { useState } from 'react';
import { Users, Calendar, Mail, Phone, Plus, Trash2 } from 'lucide-react';

export default function GroupBooking() {
  const [members, setMembers] = useState([
    { id: 1, name: '', email: '', phone: '', service: '' },
  ]);
  
  const services = [
    { id: 'haircut', name: "Women's Haircut", price: 85 },
    { id: 'color', name: 'Full Balayage', price: 180 },
    { id: 'treatment', name: 'Keratin Treatment', price: 250 },
    { id: 'style', name: 'Blowout', price: 55 },
  ];
  
  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', email: '', phone: '', service: '' }]);
  };
  
  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };
  
  const updateMember = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  
  const totalPrice = members.reduce((sum, m) => {
    const service = services.find(s => s.id === m.service);
    return sum + (service ? service.price : 0);
  }, 0);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Group booking request submitted for ${members.length} people!\nTotal estimate: $${totalPrice}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Group Booking</h1>
        <p className="text-gray-600">Book appointments for bridal parties, events, or groups</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Group Members</h2>
            <button
              type="button"
              onClick={addMember}
              className="btn btn-secondary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
          
          <div className="space-y-4">
            {members.map((member, idx) => (
              <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Member {idx + 1}</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="input"
                    required
                  />
                  <select
                    value={member.service}
                    onChange={(e) => updateMember(member.id, 'service', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                    ))}
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    className="input"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Event Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                placeholder="Any special requirements or notes..."
                rows={3}
                className="input resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Estimated Total</p>
              <p className="text-3xl font-bold text-primary-900">${totalPrice}</p>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
