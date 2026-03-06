import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Industry, Project } from '../types';
import { Plus, Pencil, Trash2, Loader2, Globe, Users } from 'lucide-react';
import Modal from '../components/Modal';

const IndustriesPage = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    project_id: '', 
    description: '',
    region: '', 
    industry_size: '', 
    tags: [] as string[] 
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchIndustries();
    fetchProjects();
  }, []);

  const fetchIndustries = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('industries')
      .select('*, projects(name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching industries:', error);
    else setIndustries(data || []);
    setLoading(false);
  };

  const fetchProjects = async () => {
    const { data, error } = await getSupabase().from('projects').select('id, name');
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { description, ...dbPayload } = formData;
    if (editingIndustry) {
      const { error } = await getSupabase()
        .from('industries')
        .update(dbPayload)
        .eq('id', editingIndustry.id);
      if (error) console.error('Error updating industry:', error);
    } else {
      const { error } = await getSupabase()
        .from('industries')
        .insert([dbPayload]);
      if (error) console.error('Error creating industry:', error);
    }
    setIsModalOpen(false);
    setEditingIndustry(null);
    setFormData({ name: '', project_id: '', description: '', region: '', industry_size: '', tags: [] });
    fetchIndustries();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this industry?')) {
      const { error } = await getSupabase()
        .from('industries')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting industry:', error);
      fetchIndustries();
    }
  };

  const openEditModal = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({ 
      name: industry.name, 
      project_id: industry.project_id, 
      description: industry.description || '',
      region: industry.region, 
      industry_size: industry.industry_size, 
      tags: industry.tags || [] 
    });
    setIsModalOpen(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Industries</h2>
          <p className="text-zinc-500 text-sm">Analyze market sectors and regions.</p>
        </div>
        <button
          onClick={() => {
            setEditingIndustry(null);
            setFormData({ name: '', project_id: '', description: '', region: '', industry_size: '', tags: [] });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Industry
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : industries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 text-sm">No industries found. Add one to start your research.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {industries.map((industry: any) => (
                <tr key={industry.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link 
                        to={`/industries/${industry.id}`}
                        className="text-sm font-medium text-zinc-900 hover:underline"
                      >
                        {industry.name}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {industry.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-500">{industry.projects?.name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Globe className="w-3.5 h-3.5" />
                      {industry.region}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Users className="w-3.5 h-3.5" />
                      {industry.industry_size}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(industry)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(industry.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndustry ? 'Edit Industry' : 'New Industry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Industry Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
              placeholder="e.g. Fintech, E-commerce"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Project</label>
            <select
              required
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm min-h-[80px]"
              placeholder="Brief overview of the industry..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
                placeholder="e.g. Global, EMEA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Size</label>
              <input
                type="text"
                value={formData.industry_size}
                onChange={(e) => setFormData({ ...formData, industry_size: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
                placeholder="e.g. $50B, 1M+ Users"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
            >
              {editingIndustry ? 'Save Changes' : 'Create Industry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IndustriesPage;
