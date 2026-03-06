import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Project, Industry, Category, Product } from '../types';
import { Search, Loader2, ArrowRight, Package, Globe, Box, Briefcase } from 'lucide-react';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    projects: Project[];
    industries: Industry[];
    categories: Category[];
    products: Product[];
  }>({
    projects: [],
    industries: [],
    categories: [],
    products: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults({
          projects: [],
          industries: [],
          categories: [],
          products: [],
        });
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
    setLoading(false);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    const query = searchQuery.toLowerCase();

    // Fetch all entities for client-side filtering (simple approach for this demo)
    // In a real app, you'd use Supabase's text search or multiple queries
    const [
      { data: projectsData },
      { data: industriesData },
      { data: categoriesData },
      { data: productsData }
    ] = await Promise.all([
      getSupabase().from('projects').select('*'),
      getSupabase().from('industries').select('*'),
      getSupabase().from('categories').select('*'),
      getSupabase().from('products').select('*')
    ]);

    const filterFn = (item: any) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const descriptionMatch = item.description?.toLowerCase().includes(query);
      const tagsMatch = item.tags?.some((tag: string) => tag.toLowerCase().includes(query));
      return nameMatch || descriptionMatch || tagsMatch;
    };

    setSearchResults({
      projects: (projectsData || []).filter(filterFn),
      industries: (industriesData || []).filter(filterFn),
      categories: (categoriesData || []).filter(filterFn),
      products: (productsData || []).filter(filterFn)
    });
    setIsSearching(false);
  };

  const hasResults = 
    searchResults.projects.length > 0 || 
    searchResults.industries.length > 0 || 
    searchResults.categories.length > 0 || 
    searchResults.products.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Marketing Notebook</h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, categories, industries, or projects..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-base"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          )}

          {/* Search Results Overlay */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="p-3 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Search Results</h3>
                <button onClick={() => setSearchQuery('')} className="text-[10px] font-medium text-zinc-400 hover:text-zinc-900 px-2">Clear</button>
              </div>
              
              {!isSearching && !hasResults ? (
                <div className="p-12 text-center">
                  <p className="text-zinc-500 text-sm">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {/* Projects Results */}
                  {searchResults.projects.length > 0 && (
                    <div className="p-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-3">
                        <Briefcase className="w-3 h-3" />
                        Projects
                      </h4>
                      <div className="grid grid-cols-1 gap-0.5">
                        {searchResults.projects.map(project => (
                          <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-900">{project.name}</span>
                              {project.description && (
                                <span className="text-[11px] text-zinc-400 line-clamp-1">{project.description}</span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Industries Results */}
                  {searchResults.industries.length > 0 && (
                    <div className="p-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-3">
                        <Globe className="w-3 h-3" />
                        Industries
                      </h4>
                      <div className="grid grid-cols-1 gap-0.5">
                        {searchResults.industries.map(industry => (
                          <Link
                            key={industry.id}
                            to={`/industries/${industry.id}`}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-900">{industry.name}</span>
                              {industry.description && (
                                <span className="text-[11px] text-zinc-400 line-clamp-1">{industry.description}</span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories Results */}
                  {searchResults.categories.length > 0 && (
                    <div className="p-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-3">
                        <Package className="w-3 h-3" />
                        Categories
                      </h4>
                      <div className="grid grid-cols-1 gap-0.5">
                        {searchResults.categories.map(category => (
                          <Link
                            key={category.id}
                            to={`/categories/${category.id}`}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-900">{category.name}</span>
                              {category.description && (
                                <span className="text-[11px] text-zinc-400 line-clamp-1">{category.description}</span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Results */}
                  {searchResults.products.length > 0 && (
                    <div className="p-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-3">
                        <Box className="w-3 h-3" />
                        Products
                      </h4>
                      <div className="grid grid-cols-1 gap-0.5">
                        {searchResults.products.map(product => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-900">{product.name}</span>
                              {product.description && (
                                <span className="text-[11px] text-zinc-400 line-clamp-1">{product.description}</span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Projects Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Recent Projects</h2>
          <Link 
            to="/projects" 
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
            <p className="text-zinc-500 text-sm">No projects found. Create your first one to get started!</p>
            <Link 
              to="/projects" 
              className="mt-4 inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-900 transition-colors">{project.name}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 mt-1">{project.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-50">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:gap-3 transition-all"
                    >
                      Open Project
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
