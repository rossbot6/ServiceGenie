import { useState } from 'react';
import { Users, Calendar, Mail, Phone, Plus, Trash2, Star, CreditCard } from 'lucide-react';

export default function GroupBooking() {
  const [members, setMembers] = useState([
    { id: 1, name: '', email: '', phone: '', service: '' },
  ]);
  
  const services = [
    { id: 'haircut', name: "Women's Haircut", price: 85 },
    { id: 'color', name: 'Full Balayage', price: 180 },
    { id: 'treatment', name: 'Keratin Treatment', price: 250 },
    { id: 'style', name: 'Blowout', price: 55 },
    { id: 'updo', name: 'Updo', price: 150 },
    { id: 'scalp', name: 'Scalp Treatment', price: 75 },
  ];
  
  const eventTypes = [
    { id: 'bridal', name: 'Bridal Party', discount: 15 },
    { id: 'event', name: 'Special Event', discount: 10 },
    { id: 'corporate', name: 'Corporate Event', discount: 5 },
    { id: 'other', name: 'Other', discount: 0 },
  ];
  
  const [eventType, setEventType] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', email: '', phone: '', service: '' }]);
  };
  
  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };
  
  const updateMember = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  
  const subtotal = members.reduce((sum, m) => {
    const service = services.find(s => s.id === m.service);
    return sum + (service ? service.price : 0);
  }, 0);
  
  const discount = eventType ? eventTypes.find(e => e.id === eventType)?.discount || 0 : 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Group booking request submitted!\n\nEvent Type: ${eventTypes.find(e => e.id === eventType)?.name}\nGroup Leader: ${groupLeader}\nMembers: ${members.length}\nSubtotal: $${subtotal}\nDiscount: ${discount}%\nTotal: $${total}\n\nWe'll contact you within 24 hours.`);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Group Booking</h1>
        <p className="text-gray-600">Book appointments for bridal parties, events, or groups</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Event Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} {type.discount > 0 ? `(${type.discount}% off)` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Leader / Contact Person
              </label>
              <input
                type="text"
                value={groupLeader}
                onChange={(e) => setGroupLeader(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Who's organizing this event?"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any special requirements, dietary restrictions, accessibility needs..."
              />
            </div>
          </div>
        </div>
        
        {/* Group Members */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Group Members</h2>
            <button
              type="button"
              onClick={addMember}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
          
          <div className="space-y-4">
            {members.map((member, idx) => (
              <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{idx + 1}</span>
                    </div>
                    <span className="font-medium text-gray-700">Member {idx + 1}</span>
                  </div>
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={member.service}
                    onChange={(e) => updateMember(member.id, 'service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pricing Summary */}
        <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-blue-200">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal ({members.length} members)</span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 flex items-center gap-1">
                  <Star size={14} className="fill-green-600" />
                  {eventTypes.find(e => e.id === eventType)?.name} Discount
                </span>
                <span className="font-medium text-green-600">-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-blue-200 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Estimated Total</p>
                  {discount > 0 && <p className="text-xs text-green-600">Includes {discount}% group discount</p>}
                </div>
                <p className="text-3xl font-bold text-blue-600">${total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            A 50% deposit will be required to confirm the booking
          </p>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <CreditCard size={18} />
            Submit Booking Request
          </button>
        </div>
      </form>
    </div>
  );
}
