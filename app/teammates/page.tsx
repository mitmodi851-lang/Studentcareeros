'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { TeammateRequest, ExperienceLevel, CollaborationMode, TeammateRequestStatus } from '@/types';

const POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Python',
  'AI/ML',
  'Firebase',
  'Tailwind CSS',
  'Next.js',
  'Node.js',
  'Linux',
  'Network Security',
  'Wireshark',
  'AWS',
  'Docker',
  'Kubernetes',
  'Go',
  'UI/UX',
  'PostgreSQL',
];

const ROLES = [
  'All Roles',
  'Frontend Developer',
  'Backend Developer',
  'AI/ML Developer',
  'Cybersecurity Analyst',
  'Cloud & Kubernetes Engineer',
  'UI/UX Designer',
  'Full-Stack Developer',
  'Mobile Developer',
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const COLLAB_MODES: CollaborationMode[] = ['Remote', 'In-Person', 'Hybrid'];
const AVAILABILITIES = [
  '5-10 hrs/week',
  '10-15 hrs/week',
  '15-20 hrs/week',
  'Weekends only',
  'Full-time sprint',
];

export default function TeammatesPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<TeammateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Filter: 'all' | 'Open' | 'Closed'
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'Closed'>('all');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<TeammateRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [preferredRole, setPreferredRole] = useState('Frontend Developer');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'JavaScript']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [description, setDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [availability, setAvailability] = useState('10-15 hrs/week');
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>('Remote');
  const [status, setStatus] = useState<TeammateRequestStatus>('Open');
  const [teamSize, setTeamSize] = useState<number>(2);
  const [maxTeamSize, setMaxTeamSize] = useState<number>(4);

  // Action feedback states
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = activeTab === 'mine' ? '/api/teammates?mine=true' : '/api/teammates';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load teammate requests.');
      const data = await res.json();
      setRequests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching teammate requests.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status Filter ('all', 'Open', 'Closed')
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }
      // Role Filter
      if (selectedRole !== 'All Roles' && r.preferredRole.toLowerCase() !== selectedRole.toLowerCase()) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesProject = r.projectName.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesRole = r.preferredRole.toLowerCase().includes(q);
        const matchesUser = r.userName?.toLowerCase().includes(q);
        const matchesSkills = r.skills?.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesProject && !matchesDesc && !matchesRole && !matchesSkills && !matchesUser) {
          return false;
        }
      }
      return true;
    });
  }, [requests, statusFilter, selectedRole, searchQuery]);

  const openCreateModal = () => {
    setEditingRequest(null);
    setProjectName('');
    setPreferredRole('Frontend Developer');
    setSelectedSkills(['React', 'JavaScript']);
    setDescription('');
    setExperienceLevel('Intermediate');
    setAvailability('10-15 hrs/week');
    setCollaborationMode('Remote');
    setStatus('Open');
    setTeamSize(2);
    setMaxTeamSize(4);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (req: TeammateRequest) => {
    setEditingRequest(req);
    setProjectName(req.projectName);
    setPreferredRole(req.preferredRole);
    setSelectedSkills(req.skills || []);
    setDescription(req.description);
    setExperienceLevel(req.experienceLevel);
    setAvailability(req.availability);
    setCollaborationMode(req.collaborationMode);
    setStatus(req.status || 'Open');
    setTeamSize(req.teamSize || 2);
    setMaxTeamSize(req.maxTeamSize || 4);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setCustomSkillInput('');
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!projectName.trim()) {
      setFormError('Please specify the hackathon or project name.');
      return;
    }
    if (selectedSkills.length === 0) {
      setFormError('Please select at least one skill.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Description must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingRequest) {
        // Update existing request
        const res = await fetch(`/api/teammates/${editingRequest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName,
            preferredRole,
            skills: selectedSkills,
            description,
            experienceLevel,
            availability,
            collaborationMode,
            status,
            teamSize: Number(teamSize),
            maxTeamSize: Number(maxTeamSize),
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update request.');
        }
        setActionSuccess('Teammate request updated successfully!');
      } else {
        // Create new request
        const res = await fetch('/api/teammates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName,
            preferredRole,
            skills: selectedSkills,
            description,
            experienceLevel,
            availability,
            collaborationMode,
            status: 'Open',
            teamSize: Number(teamSize),
            maxTeamSize: Number(maxTeamSize),
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create request.');
        }
        setActionSuccess('Teammate request posted successfully!');
      }

      setIsModalOpen(false);
      fetchRequests();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error submitting request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teammate request?')) return;
    try {
      const res = await fetch(`/api/teammates/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete request.');
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setActionSuccess('Request deleted successfully.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete request.');
    }
  };

  const handleToggleInterest = async (requestId: string) => {
    if (!session?.user?.id) {
      alert('Please sign in to express interest in joining a team.');
      return;
    }
    try {
      const res = await fetch(`/api/teammates/${requestId}/interest`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to update interest.');
      const updated: TeammateRequest = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080d1a] text-gray-100 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Pill */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-[#0f172a] border border-blue-900/40 text-blue-400 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-inner">
            <span className="text-blue-400">🛡️</span>
            <span>SCO COMMUNITY NETWORK</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Hackathons &amp; Projects</span>
          </div>
        </div>

        {/* Title + Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Teammate Finder
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mt-1.5 leading-relaxed">
              Connect with fellow students, find team members for upcoming hackathons, AI challenges, and portfolio projects.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {session ? (
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
              >
                <span className="text-base leading-none">+</span>
                <span>Find Teammates</span>
              </button>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/teammates"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all"
              >
                <span>+ Find Teammates</span>
              </Link>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2 shadow-lg animate-fade-in">
            <span className="text-base">✓</span>
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        )}

        {/* Search & Status Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project, role, or skill..."
              className="w-full bg-[#0f172a] border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 transition-colors outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
              STATUS:
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`text-xs font-semibold px-4 py-2 rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#0f172a] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              All Posts
            </button>

            <button
              onClick={() => setStatusFilter('Open')}
              className={`text-xs font-semibold px-4 py-2 rounded-md transition-all ${
                statusFilter === 'Open'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#0f172a] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              Open Posts
            </button>

            <button
              onClick={() => setStatusFilter('Closed')}
              className={`text-xs font-semibold px-4 py-2 rounded-md transition-all ${
                statusFilter === 'Closed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#0f172a] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              Filled Posts
            </button>

            {session && (
              <button
                onClick={() => setActiveTab(activeTab === 'all' ? 'mine' : 'all')}
                className={`text-xs font-semibold px-3 py-2 rounded-md transition-all border ${
                  activeTab === 'mine'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-950/40'
                    : 'border-gray-800 text-gray-400 hover:text-gray-200 bg-[#0f172a]'
                }`}
              >
                {activeTab === 'mine' ? 'My Posts (Active)' : 'My Posts'}
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter for Role (Optional pill dropdown) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-thin">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            ROLE:
          </span>
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 ${
                selectedRole === role
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-600/50'
                  : 'bg-[#0f172a]/60 text-gray-400 hover:text-gray-300 border border-gray-800/80'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 h-72 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800" />
                  <div className="space-y-2 flex-1">
                    <div className="w-28 h-3.5 bg-gray-800 rounded" />
                    <div className="w-16 h-2.5 bg-gray-800 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-40 h-3 bg-gray-800 rounded" />
                  <div className="w-full h-8 bg-gray-800 rounded" />
                </div>
                <div className="w-full h-10 bg-gray-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-[#0f172a] border border-red-900/40 rounded-xl p-8">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-lg font-bold text-red-400 mt-2">Error Loading Posts</h3>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
            <button
              onClick={fetchRequests}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a] border border-gray-800/80 rounded-xl p-8">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-white mt-4">No teammate requests found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
              {searchQuery || selectedRole !== 'All Roles' || statusFilter !== 'all'
                ? 'Try clearing your filters or search keywords to view other open requests.'
                : 'Be the first student to post a request and form a winning hackathon team!'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('All Roles');
                setStatusFilter('all');
              }}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((req) => {
              const isOwner = session?.user?.id === req.userId;
              const hasJoined = session?.user?.id ? req.interestedUserIds?.includes(session.user.id) : false;
              const currentMembers = req.teamSize ?? ((req.interestedCount || 0) + 1);
              const maxMembers = req.maxTeamSize ?? 4;
              const progressPct = Math.min(100, Math.round((currentMembers / maxMembers) * 100));
              const isFilled = req.status === 'Closed' || currentMembers >= maxMembers;

              // Format date: Posted M/D/YYYY
              const formattedDate = req.createdAt
                ? new Date(req.createdAt).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              // User initial for avatar circle
              const avatarLetter = (req.userName || 'Student').charAt(0).toUpperCase();

              return (
                <div
                  key={req.id}
                  className="bg-[#0f172a] border border-gray-800/90 hover:border-gray-700/90 rounded-xl p-6 shadow-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Top Row: User Avatar + Name + Date & Status Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {avatarLetter}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-tight">
                            {req.userName || 'Student Member'}
                          </h4>
                          <span className="text-[11px] text-gray-400">
                            Posted {formattedDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'Open' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            • Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 border border-gray-700 text-gray-400">
                            • Filled
                          </span>
                        )}

                        {/* Owner edit/delete menu */}
                        {isOwner && (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => openEditModal(req)}
                              title="Edit post"
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              title="Delete post"
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hackathon Category / Project Label */}
                    <div className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mt-2">
                      {req.projectName}
                    </div>

                    {/* Main Headline: Looking for: [Role] */}
                    <h3 className="text-base font-bold text-white mt-1">
                      Looking for:{' '}
                      <span className="text-blue-400 font-bold">{req.preferredRole}</span>
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-300 leading-relaxed mt-2.5 min-h-[38px] line-clamp-3">
                      {req.description}
                    </p>

                    {/* Skills Required */}
                    <div className="mt-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        SKILLS REQUIRED:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {req.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="bg-[#131d33] border border-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Team Size Bar & CTA */}
                  <div className="mt-5 pt-4 border-t border-gray-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Team Size</span>
                      <span className="text-gray-300 font-medium">
                        {currentMembers} / {maxMembers} members
                      </span>
                    </div>

                    {/* Team Size Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Request to Join / Action Button */}
                    {isOwner ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(req)}
                          className="flex-1 py-2 px-3 bg-[#131d33] hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-semibold rounded-lg text-center transition-colors"
                        >
                          Edit Post
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="py-2 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ) : isFilled ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 bg-gray-800/80 border border-gray-700/60 text-gray-500 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <span>Team Full</span>
                      </button>
                    ) : hasJoined ? (
                      <button
                        onClick={() => handleToggleInterest(req.id)}
                        className="w-full py-2.5 px-4 bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
                      >
                        <span>Request Sent ✓</span>
                        <span className="text-xs text-emerald-200 font-normal">(Click to cancel)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleInterest(req.id)}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        <span>Request to Join</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create / Edit Modal (Premium Dark UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0f172a] border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
              <h2 className="text-xl font-bold text-white">
                {editingRequest ? 'Edit Teammate Request' : 'Find Hackathon Teammates'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4">
              {/* Project / Hackathon Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Project or Hackathon Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. AI Innovation Challenge 2025, Smart India Hackathon"
                  className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Preferred Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Role You Need *
                </label>
                <select
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {ROLES.filter((r) => r !== 'All Roles').map((r) => (
                    <option key={r} value={r} className="bg-[#0f172a] text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Size & Max Team Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Current Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Math.max(2, parseInt(e.target.value) || 4))}
                    className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Skills Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Skills Required *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-28 overflow-y-auto p-2 bg-[#131d33]/50 border border-gray-800 rounded-lg">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-medium'
                            : 'bg-[#131d33] text-gray-400 hover:text-gray-200 border border-gray-700'
                        }`}
                      >
                        {skill} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Add custom skill (e.g. Solidity) & hit Enter"
                    className="flex-1 bg-[#131d33] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 bg-[#1e293b] hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Experience & Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-[#0f172a] text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Collaboration Mode
                  </label>
                  <select
                    value={collaborationMode}
                    onChange={(e) => setCollaborationMode(e.target.value as CollaborationMode)}
                    className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {COLLAB_MODES.map((m) => (
                      <option key={m} value={m} className="bg-[#0f172a] text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Time Commitment
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {AVAILABILITIES.map((a) => (
                      <option key={a} value={a} className="bg-[#0f172a] text-white">
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {editingRequest && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TeammateRequestStatus)}
                      className="w-full bg-[#131d33] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Open" className="bg-[#0f172a] text-white">Open</option>
                      <option value="Closed" className="bg-[#0f172a] text-white">Closed (Filled)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Project Description &amp; Role Goals *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you are building, the problem it solves, and what specific tasks the teammate will handle..."
                  className="w-full bg-[#131d33] border border-gray-700 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRequest ? 'Update Post' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
