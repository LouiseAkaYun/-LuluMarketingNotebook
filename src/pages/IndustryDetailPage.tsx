import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Industry } from '../types';
import { Loader2, Globe, Users, Tag, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ModuleSystem from '../components/ModuleSystem';

const IndustryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [industry, setIndustry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchIndustry();
  }, [id]);

  const fetchIndustry = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('industries')
      .select('*, projects(name)')
      .eq('id', id)
      .single();
    
    if (error) console.error('Error fetching industry:', error);
    else setIndustry(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!industry) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Industry not found.</p>
        <Link to="/industries" className="text-zinc-900 font-medium underline mt-2 inline-block">Back to Industries</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs 
        items={[
          { label: 'Projects', to: '/projects' },
          { label: industry.projects?.name || 'Project', to: '/projects' },
          { label: industry.name }
        ]} 
      />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{industry.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Project</label>
                <p className="text-sm font-medium text-zinc-900">{industry.projects?.name || 'N/A'}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Globe className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Region</label>
                  <p className="text-sm font-medium text-zinc-900">{industry.region || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Users className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Industry Size</label>
                  <p className="text-sm font-medium text-zinc-900">{industry.industry_size || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-medium text-zinc-400 block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {industry.tags?.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Research Modules Section */}
        <div className="lg:col-span-2 space-y-6">
          <ModuleSystem parentId={industry.id} parentType="industry" />
        </div>
      </div>
    </div>
  );
};

export default IndustryDetailPage;
