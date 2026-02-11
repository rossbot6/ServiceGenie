import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1);
  
  const services = [
    { id: 'haircut', name: "Women's Haircut", price: 85, duration: 60, description: 'Precision cut and blowout' },
    { id: 'color', name: 'Full Balayage', price: 180, duration: 180, description: 'Hand-painted highlights' },
    { id: 'treatment', name: 'Keratin Treatment', price: 250, duration: 120, description: 'Smoothing treatment' },
    { id: 'style', name: 'Blowout', price: 55, duration: 45, description: 'Professional blow dry' },
  ];
  
  const currentService = services.find(s => s.id === id) || services[0];
  
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      num: date.getDate(),
      full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    };
  });
  
  const locations = [
    { id: 1, name: 'Downtown Salon', address: '123 Main St, New York, NY 10001' },
    { id: 2, name: 'Uptown Studio', address: '456 Park Ave, New York, NY 10065' },
    { id: 3, name: 'Brooklyn Loft', address: '789 Bedford Ave, Brooklyn, NY 11211' },
  ];
  
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  
  const handleBook = () => {
    alert('Booking confirmed! You will receive a confirmation SMS and email.');
    navigate('/');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600">{currentService.name} - ${currentService.price}</p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {['Service', 'Date & Time', 'Confirm'].map((label, idx) => (
          <div key={label} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step > idx + 1 ? 'bg-green-500 text-white' :
              step === idx + 1 ? 'bg-primary-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step > idx + 1 ? <Check size={16} /> : idx + 1}
            </div>
            <span className={`ml-2 text-sm ${step >= idx + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              {label}
            </span>
            {idx < 2 && <div className="w-12 h-0.5 bg-gray-200 ml-4" />}
          </div>
        ))}
      </div>
      
      {/* Step 1: Service Details */}
      {step === 1 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Service Details</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{currentService.name}</h3>
              <p className="text-sm text-gray-600">{currentService.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {currentService.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} /> ${currentService.price}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
            <div className="space-y-2">
              {locations.map((loc) => (
                <label
                  key={loc.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.id === loc.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="location"
                    checked={selectedLocation?.id === loc.id}
                    onChange={() => setSelectedLocation(loc)}
                    className="text-primary-600"
                  />
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{loc.name}</p>
                    <p className="text-sm text-gray-500">{loc.address}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setStep(2)}
            className="btn btn-primary w-full mt-6"
          >
            Continue to Date & Time
          </button>
        </div>
      )}
      
      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Select Date & Time</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {next7Days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`flex-shrink-0 w-16 py-3 rounded-lg text-center transition-colors ${
                    selectedDate?.num === day.num
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xs opacity-70">{day.day}</div>
                  <div className="font-semibold">{day.num}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Confirm Booking</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Service</h3>
              <p className="text-gray-600">{currentService.name} - ${currentService.price}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Date & Time</h3>
              <p className="text-gray-600">
                {selectedDate?.full} at {selectedTime}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{selectedLocation?.name}</p>
              <p className="text-sm text-gray-500">{selectedLocation?.address}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleBook}
              className="btn btn-primary flex-1"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
