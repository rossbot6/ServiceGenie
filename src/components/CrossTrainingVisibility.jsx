import React, { useState } from 'react';
import { Users, Star, Award, Search, Filter, TrendingUp, Eye, UserPlus, BookOpen, Target } from 'lucide-react';

const CrossTrainingVisibility = () => {
  const [providers] = useState([
    {
      id: 1,
      name: 'Emma Wilson',
      specialty: 'Senior Colorist',
      primaryLocation: 'Downtown Salon',
      skills: [
        { name: 'Full Balayage', level: 'Expert', certified: true, years: 6, rating: 4.9 },
        { name: 'Partial Highlights', level: 'Expert', certified: true, years: 7, rating: 4.8 },
        { name: 'Keratin Treatment', level: 'Advanced', certified: true, years: 4, rating: 4.6 },
        { name: 'Blowouts', level: 'Advanced', certified: true, years: 8, rating: 4.7 },
        { name: "Men's Cuts", level: 'Intermediate', certified: false, years: 2, rating: 4.2 }
      ],
      crossTrainingCount: 5,
      primaryCertifications: 4,
      avgRating: 4.6,
      availability: 'high-demand'
    },
    {
      id: 2,
      name: 'James Brown',
      specialty: 'Master Stylist',
      primaryLocation: 'Downtown Salon',
      skills: [
        { name: "Women's Cuts", level: 'Expert', certified: true, years: 6, rating: 4.8 },
        { name: "Men's Cuts", level: 'Expert', certified: true, years: 5, rating: 4.7 },
        { name: 'Updos', level: 'Advanced', certified: true, years: 4, rating: 4.5 },
        { name: 'Scalp Treatments', level: 'Intermediate', certified: false, years: 3, rating: 4.3 },
        { name: 'Extensions', level: 'Beginner', certified: false, years: 1, rating: 3.8 }
      ],
      crossTrainingCount: 5,
      primaryCertifications: 3,
      avgRating: 4.4,
      availability: 'available'
    },
    {
      id: 3,
      name: 'Sofia Garcia',
      specialty: 'Senior Colorist',
      primaryLocation: 'Brooklyn Branch',
      skills: [
        { name: 'Color Corrections', level: 'Expert', certified: true, years: 7, rating: 4.9 },
        { name: 'Full Balayage', level: 'Expert', certified: true, years: 6, rating: 4.8 },
        { name: 'Olaplex Treatments', level: 'Advanced', certified: true, years: 3, rating: 4.6 },
        { name: 'Creative Coloring', level: 'Expert', certified: true, years: 8, rating: 4.9 },
        { name: 'Blowouts', level: 'Advanced', certified: true, years: 5, rating: 4.7 }
      ],
      crossTrainingCount: 5,
      primaryCertifications: 4,
      avgRating: 4.8,
      availability: 'available'
    },
    {
      id: 4,
      name: 'Michael Chen',
      specialty: "Men's Stylist",
      primaryLocation: 'Brooklyn Branch',
      skills: [
        { name: "Men's Cuts", level: 'Expert', certified: true, years: 4, rating: 4.6 },
        { name: 'Beard Trimming', level: 'Expert', certified: true, years: 4, rating: 4.7 },
        { name: 'Hair Styling', level: 'Advanced', certified: true, years: 3, rating: 4.4 },
        { name: 'Color Touch-ups', level: 'Intermediate', certified: false, years: 2, rating: 4.1 },
        { name: 'Scalp Treatments', level: 'Beginner', certified: false, years: 1, rating: 3.9 }
      ],
      crossTrainingCount: 5,
      primaryCertifications: 3,
      avgRating: 4.3,
      availability: 'busy'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  const skillNames = [...new Set(providers.flatMap(p => p.skills.map(s => s.name)))];
  const locations = [...new Set(providers.map(p => p.primaryLocation))];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = !skillFilter || provider.skills.some(s => s.name === skillFilter);
    const matchesLevel = !levelFilter || provider.skills.some(s => s.level === levelFilter);
    const matchesLocation = !locationFilter || provider.primaryLocation === locationFilter;
    const matchesAvailability = !availabilityFilter || provider.availability === availabilityFilter;
    
    return matchesSearch && matchesSkill && matchesLevel && matchesLocation && matchesAvailability;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'Expert': return 'bg-green-100 text-green-800 border-green-300';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Beginner': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'high-demand': return 'bg-red-100 text-red-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillStars = (level) => {
    const stars = { 'Expert': 5, 'Advanced': 4, 'Intermediate': 3, 'Beginner': 2 };
    return stars[level] || 1;
  };

  const ProviderCard = ({ provider }) => (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.specialty}</p>
              <p className="text-xs text-gray-500">{provider.primaryLocation}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-yellow-500" />
              <span className="font-bold">{provider.avgRating}</span>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(provider.availability)}`}>
              {provider.availability}
            </span>
          </div>
        </div>

        {/* Cross-training Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Skills</p>
            <p className="text-lg font-bold">{provider.crossTrainingCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Certified</p>
            <p className="text-lg font-bold">{provider.primaryCertifications}</p>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Skills & Expertise</h4>
          {provider.skills.slice(0, 3).map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-gray-500">({skill.years}y)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{skill.rating}</span>
                {[...Array(getSkillStars(skill.level))].map((_, i) => (
                  <Star key={i} size={12} className="fill-current text-yellow-400" />
                ))}
                {skill.certified && <Award size={12} className="text-green-600" />}
              </div>
            </div>
          ))}
          {provider.skills.length > 3 && (
            <p className="text-xs text-gray-500 text-center">+{provider.skills.length - 3} more skills</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors">
            <Eye size={14} className="inline mr-1" />
            View Details
          </button>
          <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus size={14} className="inline mr-1" />
            Request Coverage
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Cross-Training Visibility</h3>
          <p className="text-sm text-gray-600">Track provider skills, certifications, and cross-training capabilities</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search providers by name or specialty..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Skills</option>
            {skillNames.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Levels</option>
            <option value="Expert">Expert</option>
            <option value="Advanced">Advanced</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Beginner">Beginner</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="high-demand">High Demand</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold">{providers.length}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Cross-Trained</p>
              <p className="text-2xl font-bold">{Math.max(...providers.map(p => p.crossTrainingCount))}</p>
            </div>
            <Target className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Skills/Provider</p>
              <p className="text-2xl font-bold">
                {(providers.reduce((sum, p) => sum + p.crossTrainingCount, 0) / providers.length).toFixed(1)}
              </p>
            </div>
            <BookOpen className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skills Available</p>
              <p className="text-2xl font-bold">{skillNames.length}</p>
            </div>
            <Award className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Empty State for no filters applied */}
      {providers.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cross-training data available</h3>
          <p className="text-gray-600 mb-4">
            Start by adding provider skill assessments and certifications
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Provider Skills
          </button>
        </div>
      )}
    </div>
  );
};

export default CrossTrainingVisibility;