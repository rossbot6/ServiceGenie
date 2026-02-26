import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ArrowRight, Check } from 'lucide-react';

export default function ServiceBooking() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  
  const services = [
    { 
      id: 'haircut', 
      name: "Women's Haircut", 
      price: 85, 
      duration: 60, 
      description: 'Precision cut and blowout',
      category: 'Cut & Style',
      image: '💇‍♀️'
    },
    { 
      id: 'color', 
      name: 'Full Balayage', 
      price: 180, 
      duration: 180, 
      description: 'Hand-painted highlights',
      category: 'Color',
      image: '🟨'
    },
    { 
      id: 'treatment', 
      name: 'Keratin Treatment', 
      price: 250, 
      duration: 120, 
      description: 'Smoothing treatment',
      category: 'Treatment',
      image: '✨'
    },
    { 
      id: 'style', 
      name: 'Professional Blowout', 
      price: 55, 
      duration: 45, 
      description: 'Professional blow dry',
      category: 'Style',
      image: '💨'
    },
    {
      id: 'manicure',
      name: 'Gel Manicure',
      price: 45,
      duration: 60,
      description: 'Long-lasting gel polish',
      category: 'Nails',
      image: '💅'
    },
    {
      id: 'pedicure', 
      name: 'Spa Pedicure',
      price: 65,
      duration: 90,
      description: 'Relaxing foot treatment',
      category: 'Nails',
      image: '🦶'
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedService) {
      navigate(`/book/${selectedService.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose Your Service
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select a service to book your appointment
              </p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
                ${selectedService?.id === service.id 
                  ? 'border-indigo-500 shadow-lg bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{service.image}</div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {service.duration}min
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {service.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {service.category}
                </span>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Duration: {service.duration} min</span>
                </div>
              </div>
              
              {selectedService?.id === service.id && (
                <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedService && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Continue to Book
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Summary Section */}
      {selectedService && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Selected Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedService.name} - {selectedService.duration} min
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${selectedService.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}