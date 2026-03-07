import React, { useState } from 'react';
import { Crown, Users, Search, UserCheck, Star, Award, TrendingUp, Clock, Calendar } from 'lucide-react';

const TeamLeadAssignment = () => {
  const [teams] = useState([
    {
      id: 1,
      name: 'Downtown Elite Team',
      location: 'Downtown Salon',
      currentLead: 'Emma Wilson',
      members: [
        { id: 1, name: 'Emma Wilson', specialty: 'Senior Colorist', experience: '8 years', performance: 4.9, revenue: 15600, availability: 'available', status: 'current-lead', assigned: '2025-06-01' },
        { id: 2, name: 'James Brown', specialty: 'Master Stylist', experience: '6 years', performance: 4.7, revenue: 15200, availability: 'busy', status: 'member', assigned: '2025-06-01' },
        { id: 7, name: 'Lisa Thompson', specialty: 'Color Specialist', experience: '3 years', performance: 4.5, revenue: 9800, availability: 'available', status: 'candidate', assigned: null },
        { id: 8, name: 'Mark Rodriguez', specialty: 'Senior Stylist', experience: '5 years', performance: 4.6, revenue: 11200, availability: 'on-break', status: 'candidate', assigned: null }
      ]
    },
    {
      id: 2,
      name: 'Brooklyn Specialists',
      location: 'Brooklyn Branch', 
      currentLead: 'Sofia Garcia',
      members: [
        { id: 4, name: 'Sofia Garcia', specialty: 'Senior Colorist', experience: '7 years', performance: 4.8, revenue: 18900, availability: 'available', status: 'current-lead', assigned: '2025-05-15' },
        { id: 5, name: 'Michael Chen', specialty: "Men's Stylist", experience: '4 years', performance: 4.6, revenue: 12300, availability: 'available', status: 'candidate', assigned: null }
      ]
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [candidateForPromotion, setCandidateForPromotion] = useState(null);

  const selectedTeamData = teams.find(t => t.id === selectedTeam);
  const candidates = selectedTeamData?.members.filter(m => m.status !== 'current-lead') || [];
  const currentLead = selectedTeamData?.members.find(m => m.status === 'current-lead');

  const handlePromoteToLead = (member) => {
    setCandidateForPromotion(member);
    setShowAssignModal(true);
  };

  const confirmPromotion = () => {
    // In a real app, this would update the backend
    console.log(`Promoting ${candidateForPromotion.name} to team lead of ${selectedTeamData.name}`);
    setShowAssignModal(false);
    setCandidateForPromotion(null);
  };

  const handleRemoveLead = (team) => {
    if (confirm(`Are you sure you want to remove the current team lead from ${team.name}?`)) {
      console.log(`Removing team lead from ${team.name}`);
      // In a real app, this would update the backend
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'current-lead': return <Crown className="text-yellow-500" size={16} />;
      case 'candidate': return <UserCheck className="text-blue-500" size={16} />;
      default: return <Users className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'current-lead': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'candidate': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Team Lead Assignment</h3>
          <p className="text-sm text-gray-600">Manage team leadership roles and assignments</p>
        </div>
      </div>

      {/* Team Selection */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium mb-3">Select Team</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`p-3 text-left border rounded-lg transition-all ${
                selectedTeam === team.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">{team.name}</h5>
                  <p className="text-sm text-gray-600">{team.location}</p>
                  <p className="text-xs text-gray-500">{team.members.length} members</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={14} className="text-yellow-500" />
                    <span className="text-sm font-medium">{team.currentLead}</span>
                  </div>
                  <span className="text-xs text-gray-500">Team Lead</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTeamData && (
        <>
          {/* Current Team Lead */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center gap-2">
                <Crown className="text-yellow-500" size={18} />
                Current Team Lead
              </h4>
              <button
                onClick={() => handleRemoveLead(selectedTeamData)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove as Lead
              </button>
            </div>
            
            {currentLead && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Crown className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <h5 className="font-medium text-lg">{currentLead.name}</h5>
                    <p className="text-sm text-gray-600">{currentLead.specialty} • {currentLead.experience}</p>
                    <p className="text-xs text-green-600">Leading since {currentLead.assigned}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className="font-bold text-lg">⭐ {currentLead.performance}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-bold text-lg">${currentLead.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(currentLead.availability)}`}>
                    {currentLead.availability}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Potential Candidates */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <UserCheck className="text-blue-500" size={18} />
              Potential Team Lead Candidates
            </h4>
            
            <div className="space-y-3">
              {candidates.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h5 className="font-medium">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.specialty} • {member.experience}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500" />
                          <span className="text-xs">{member.performance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} className="text-green-500" />
                          <span className="text-xs">${member.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(member.availability)}`}>
                      {member.availability}
                    </span>
                    <button
                      onClick={() => handlePromoteToLead(member)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Crown size={14} />
                      Promote to Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {candidates.length === 0 && (
              <div className="text-center py-8">
                <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No eligible candidates</h3>
                <p className="text-gray-600">All team members are already serving as team leads</p>
              </div>
            )}
          </div>

          {/* Leadership Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Leads</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Crown className="text-yellow-600" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold">
                    {(selectedTeamData.members.reduce((sum, m) => sum + m.performance, 0) / selectedTeamData.members.length).toFixed(1)}
                  </p>
                </div>
                <Star className="text-purple-600" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${selectedTeamData.members.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidates</p>
                  <p className="text-2xl font-bold">{candidates.length}</p>
                </div>
                <UserCheck className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && candidateForPromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Crown className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Promote Team Lead</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to promote <strong>{candidateForPromotion.name}</strong> to team lead of <strong>{selectedTeamData?.name}</strong>?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-left">
                  <p className="text-sm"><strong>Name:</strong> {candidateForPromotion.name}</p>
                  <p className="text-sm"><strong>Specialty:</strong> {candidateForPromotion.specialty}</p>
                  <p className="text-sm"><strong>Experience:</strong> {candidateForPromotion.experience}</p>
                  <p className="text-sm"><strong>Performance:</strong> ⭐ {candidateForPromotion.performance}</p>
                  <p className="text-sm"><strong>Revenue:</strong> ${candidateForPromotion.revenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPromotion}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Promote to Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeadAssignment;