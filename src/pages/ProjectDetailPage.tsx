import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Project, Industry, Category, Product } from '../types';
import { Loader2, Globe, Package, Box, Tag, ArrowLeft, Plus } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    setLoading(true);
    const [
      { data: projectData },
      { data: industriesData },
      { data: categoriesData },
      { data: productsData }
    ] = await Promise.all([
      getSupabase().from('projects').select('*').eq('id', id).single(),
      getSupabase().from('industries').select('*').eq('project_id', id),
      getSupabase().from('categories').select('*').eq('project_id', id),
      getSupabase().from('products').select('*').eq('project_id', id)
    ]);

    if (projectData) setProject(projectData);
    if (industriesData) setIndustries(industriesData);
    if (categoriesData) setCategories(categoriesData);
    if (productsData) setProducts(productsData);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Project not found.</p>
        <Link to="/" className="text-zinc-900 font-medium underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', to: '/' },
          { label: project.name }
        ]} 
      />

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{project.name}</h2>
        <p className="text-zinc-500 max-w-2xl">{project.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Industries Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-400" />
              Industries
            </h3>
            <Link 
              to="/industries" 
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden divide-y divide-zinc-100">
            {industries.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-zinc-400 italic">No industries added yet.</p>
              </div>
            ) : (
              industries.map(industry => (
                <Link
                  key={industry.id}
                  to={`/industries/${industry.id}`}
                  className="block p-4 hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-900">{industry.name}</span>
                  <div className="flex gap-1 mt-1">
                    {industry.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-zinc-400" />
              Categories
            </h3>
            <Link 
              to="/categories" 
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden divide-y divide-zinc-100">
            {categories.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-zinc-400 italic">No categories added yet.</p>
              </div>
            ) : (
              categories.map(category => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="block p-4 hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-900">{category.name}</span>
                  <div className="flex gap-1 mt-1">
                    {category.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Box className="w-5 h-5 text-zinc-400" />
              Products
            </h3>
            <Link 
              to="/products" 
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden divide-y divide-zinc-100">
            {products.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-zinc-400 italic">No products added yet.</p>
              </div>
            ) : (
              products.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="block p-4 hover:bg-zinc-50 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-900">{product.name}</span>
                  <div className="flex gap-1 mt-1">
                    {product.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
