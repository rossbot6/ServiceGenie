import { useEffect, useState } from 'react';
import { 
  Users, Building2, Edit2, Plus, Check, X, 
  ChevronRight, Crown, Shield, Award, UserCheck,
  UserX, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', color: '#8b5cf6' });
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (teamsError) throw teamsError;

      // Fetch providers with team info
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select(`
          id, 
          name, 
          email, 
          phone, 
          specialty, 
          bio, 
          avatar_url, 
          is_active, 
          team_id, 
          is_team_lead,
          teams (id, name, color)
        `)
        .order('name');
      
      if (providersError) throw providersError;

      setTeams(teamsData || []);
      setProviders(providersData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name: teamForm.name, color: teamForm.color }])
        .select()
        .single();
      
      if (error) throw error;
      setTeams([...teams, data]);
      setShowTeamModal(false);
      setTeamForm({ name: '', color: '#8b5cf6' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('teams')
        .update({ name: teamForm.name, color: teamForm.color })
        .eq('id', editingTeam.id);
      
      if (error) throw error;
      setTeams(teams.map(t => t.id === editingTeam.id ? { ...t, ...teamForm } : t));
      setEditingTeam(null);
      setTeamForm({ name: '', color: '#8b5cf6' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Delete this team? Providers assigned to this team will become unassigned.')) return;
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
      
      if (error) throw error;
      setTeams(teams.filter(t => t.id !== teamId));
      // Unassign providers from this team
      setProviders(providers.map(p => p.team_id === teamId ? { ...p, team_id: null, is_team_lead: false } : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignProvider = async (providerId, teamId) => {
    try {
      const { error } = await supabase
        .from('providers')
        .update({ team_id: teamId })
        .eq('id', providerId);
      
      if (error) throw error;
      setProviders(providers.map(p => p.id === providerId ? { ...p, team_id: teamId, is_team_lead: false } : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleLead = async (providerId, currentLead) => {
    try {
      const { error } = await supabase
        .from('providers')
        .update({ is_team_lead: !currentLead })
        .eq('id', providerId);
      
      if (error) throw error;
      setProviders(providers.map(p => p.id === providerId ? { ...p, is_team_lead: !currentLead } : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const getTeamProviders = (teamId) => {
    return providers.filter(p => p.team_id === teamId);
  };

  const unassignedProviders = providers.filter(p => !p.team_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-red-200">
        <AlertCircle className="inline-block mr-2" />
        Error loading team data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Organize providers into teams and assign leads</p>
        </div>
        <button
          onClick={() => { setEditingTeam(null); setTeamForm({ name: '', color: '#8b5cf6' }); setShowTeamModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">Teams ({teams.length})</h2>
          {teams.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-500 mb-3" />
              <p className="text-slate-400">No teams created yet.</p>
              <button 
                onClick={() => setShowTeamModal(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                Create your first team
              </button>
            </div>
          ) : (
            teams.map(team => {
              const teamProviders = getTeamProviders(team.id);
              return (
                <div key={team.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-700/30 transition"
                    onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: team.color }}
                        ></div>
                        <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-sm rounded-full">
                          {teamProviders.length} member{teamProviders.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingTeam(team); setTeamForm({ name: team.name, color: team.color }); setShowTeamModal(true); }}
                          className="p-2 hover:bg-slate-700 rounded-lg transition"
                          title="Edit team"
                        >
                          <Edit2 size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                          className="p-2 hover:bg-red-900/30 rounded-lg transition"
                          title="Delete team"
                        >
                          <X size={16} className="text-red-400" />
                        </button>
                        <ChevronRight 
                          size={20} 
                          className={`text-slate-400 transition-transform ${expandedTeam === team.id ? 'rotate-90' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {expandedTeam === team.id && (
                    <div className="border-t border-slate-700 p-4 bg-slate-900/30">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Team Members</h4>
                      {teamProviders.length === 0 ? (
                        <p className="text-slate-500 text-sm">No providers assigned</p>
                      ) : (
                        <div className="space-y-2">
                          {teamProviders.map(provider => (
                            <div key={provider.id} className="flex items-center justify-between p-3 bg-slate-800/70 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                  {provider.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{provider.name}</p>
                                  <p className="text-slate-400 text-sm">{provider.specialty}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {provider.is_team_lead && (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                    <Crown size={12} />
                                    Lead
                                  </span>
                                )}
                                <button
                                  onClick={() => handleToggleLead(provider.id, provider.is_team_lead)}
                                  className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition ${
                                    provider.is_team_lead 
                                      ? 'bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/50' 
                                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  }`}
                                >
                                  {provider.is_team_lead ? <Shield size={14} /> : <UserCheck size={14} />}
                                  {provider.is_team_lead ? 'Remove Lead' : 'Make Lead'}
                                </button>
                                <button
                                  onClick={() => handleAssignProvider(provider.id, null)}
                                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                                  title="Unassign from team"
                                >
                                  <UserX size={16} className="text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Unassigned Providers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Unassigned Providers ({unassignedProviders.length})
          </h2>
          {unassignedProviders.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <UserCheck className="mx-auto h-10 w-10 text-green-500 mb-2" />
              <p className="text-slate-400 text-sm">All providers are assigned to a team.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedProviders.map(provider => (
                <div key={provider.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold">
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{provider.name}</p>
                      <p className="text-slate-400 text-sm">{provider.specialty}</p>
                    </div>
                  </div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAssignProvider(provider.id, e.target.value);
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Assign to team...</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Award size={18} />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Total Teams</p>
                <p className="text-2xl font-bold text-white">{teams.length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Assigned Providers</p>
                <p className="text-2xl font-bold text-white">{providers.filter(p => p.team_id).length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Team Leads</p>
                <p className="text-2xl font-bold text-yellow-400">{providers.filter(p => p.is_team_lead).length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Unassigned</p>
                <p className="text-2xl font-bold text-white">{unassignedProviders.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {(showTeamModal || editingTeam) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Creative Team"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Team Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={teamForm.color}
                      onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
                      className="w-12 h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={teamForm.color}
                      onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
                      className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowTeamModal(false); setEditingTeam(null); setTeamForm({ name: '', color: '#8b5cf6' }); }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  {editingTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
