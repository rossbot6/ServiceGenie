import React, { useState } from 'react';
import { Users, Plus, Search, Edit, Trash2, Crown, UserPlus, Settings, ArrowLeft, Calendar, Phone, Mail } from 'lucide-react';

const TeamManagement = () => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Downtown Elite Team',
      location: 'Downtown Salon',
      teamLead: 'Emma Wilson',
      members: 3,
      totalRevenue: 45600,
      rating: 4.9,
      description: 'Senior colorists and stylists specializing in high-end services',
      membersList: [
        { id: 1, name: 'Emma Wilson', role: 'Team Lead', specialty: 'Senior Colorist', email: 'emma@servicegenie.com', phone: '(212) 555-0101', revenue: 15600, rating: 4.9 },
        { id: 2, name: 'James Brown', role: 'Senior Member', specialty: 'Master Stylist', email: 'james@servicegenie.com', phone: '(212) 555-0102', revenue: 15200, rating: 4.7 },
        { id: 3, name: 'Sarah Davis', role: 'Team Member', specialty: 'Stylist', email: 'sarah@servicegenie.com', phone: '(212) 555-0103', revenue: 14800, rating: 4.6 }
      ],
      isActive: true
    },
    {
      id: 2,
      name: 'Brooklyn Specialists',
      location: 'Brooklyn Branch',
      teamLead: 'Sofia Garcia',
      members: 2,
      totalRevenue: 31200,
      rating: 4.8,
      description: 'Specialized team for color work and texture treatments',
      membersList: [
        { id: 4, name: 'Sofia Garcia', role: 'Team Lead', specialty: 'Senior Colorist', email: 'sofia@servicegenie.com', phone: '(718) 555-0201', revenue: 18900, rating: 4.8 },
        { id: 5, name: 'Michael Chen', role: 'Senior Member', specialty: "Men's Stylist", email: 'michael@servicegenie.com', phone: '(718) 555-0202', revenue: 12300, rating: 4.6 }
      ],
      isActive: true
    }
  ]);

  const [locations] = useState([
    { id: 1, name: 'Downtown Salon' },
    { id: 2, name: 'Brooklyn Branch' }
  ]);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    locationId: 1,
    teamLead: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({ name: '', locationId: 1, teamLead: '', description: '' });
    setShowTeamModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      locationId: locations.find(l => l.name === team.location)?.id || 1,
      teamLead: team.teamLead,
      description: team.description
    });
    setShowTeamModal(true);
  };

  const handleDeleteTeam = (id) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    const teamLeadInfo = teams.find(t => t.id === editingTeam?.id)?.membersList.find(m => m.name === teamForm.teamLead);
    const locationName = locations.find(l => l.id === teamForm.locationId)?.name;
    
    const teamData = {
      ...teamForm,
      id: editingTeam ? editingTeam.id : Date.now(),
      location: locationName,
      teamLead: teamForm.teamLead,
      members: editingTeam ? editingTeam.members : 0,
      totalRevenue: editingTeam ? editingTeam.totalRevenue : 0,
      rating: 4.7,
      description: teamForm.description,
      membersList: editingTeam ? editingTeam.membersList : [],
      isActive: true
    };

    if (editingTeam) {
      setTeams(teams.map(t => t.id === editingTeam.id ? teamData : t));
    } else {
      setTeams([...teams, teamData]);
    }
    setShowTeamModal(false);
  };

  const handleAssignTeamLead = (teamId, memberId) => {
    const team = teams.find(t => t.id === teamId);
    const member = team.membersList.find(m => m.id === memberId);
    
    if (member) {
      const updatedTeam = {
        ...team,
        teamLead: member.name,
        membersList: team.membersList.map(m => ({
          ...m,
          role: m.id === memberId ? 'Team Lead' : 'Team Member',
          revenue: m.id === memberId ? (member.revenue + 2000) : m.revenue // Team lead gets more revenue
        }))
      };
      setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.teamLead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TeamCard = ({ team }) => (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEditTeam(team)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDeleteTeam(team.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Crown className="text-yellow-500" size={16} />
          <span className="text-sm font-medium">Team Lead: {team.teamLead}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4">{team.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Members</p>
            <p className="text-lg font-semibold">{team.members}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-semibold">${team.totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-lg font-semibold">⭐ {team.rating}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTeamDetails(team.id === showTeamDetails ? null : team.id)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showTeamDetails === team.id ? 'Hide Details' : 'View Team'}
          </button>
        </div>

        {showTeamDetails === team.id && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-3">Team Members</h4>
            <div className="space-y-2">
              {team.membersList.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${member.role === 'Team Lead' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                      {member.role === 'Team Lead' ? <Crown size={14} className="text-yellow-600" /> : <Users size={14} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${member.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Team Management</h3>
          <p className="text-sm text-gray-600">Organize providers into teams and manage team leads</p>
        </div>
        <button
          onClick={handleAddTeam}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Team
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams by name, location, or team lead..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold">{teams.length}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Teams</p>
              <p className="text-2xl font-bold">{teams.filter(t => t.isActive).length}</p>
            </div>
            <Crown className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.members, 0)}</p>
            </div>
            <UserPlus className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold">
                {(teams.reduce((sum, team) => sum + team.rating, 0) / teams.length).toFixed(1)}
              </p>
            </div>
            <Settings className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search query' : 'Start by creating your first team'}
          </p>
          <button
            onClick={handleAddTeam}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Team
          </button>
        </div>
      )}

      {/* Add/Edit Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingTeam ? 'Edit Team' : 'Add New Team'}
              </h3>
              <button
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            
            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  value={teamForm.locationId}
                  onChange={(e) => setTeamForm({ ...teamForm, locationId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Team Lead</label>
                <input
                  type="text"
                  value={teamForm.teamLead}
                  onChange={(e) => setTeamForm({ ...teamForm, teamLead: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter team lead name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Describe the team's specialization..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTeam ? 'Update' : 'Create'} Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;