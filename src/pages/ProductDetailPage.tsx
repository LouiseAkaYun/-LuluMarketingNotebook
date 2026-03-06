import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Product } from '../types';
import { Loader2, DollarSign, Calendar, Tag, ArrowLeft, Package, Globe, FileText } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ModuleSystem from '../components/ModuleSystem';
import { exportReportToHtml } from '../services/exportService';
import { MODULE_LIBRARY } from '../constants/moduleLibrary';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('products')
      .select('*, projects(name), categories(name)')
      .eq('id', id)
      .single();
    
    if (error) console.error('Error fetching product:', error);
    else setProduct(data);
    setLoading(false);
  };

  const handleExportReport = async () => {
    if (!product) return;

    try {
      // Fetch all modules
      const { data: modulesData, error: modulesError } = await getSupabase()
        .from('modules')
        .select('*')
        .eq('parent_id', product.id)
        .eq('parent_type', 'product')
        .order('module_order', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch rows for each module
      const modulesWithRows = await Promise.all(
        (modulesData || []).map(async (mod) => {
          const { data: rowsData, error: rowsError } = await getSupabase()
            .from('module_rows')
            .select('*')
            .eq('module_id', mod.id)
            .order('created_at', { ascending: true });

          if (rowsError) throw rowsError;

          const definition = MODULE_LIBRARY.find((d) => d.type === mod.module_type);
          return {
            definition: definition!,
            rows: rowsData || [],
            notes: mod.notes,
          };
        })
      );

      const info = [
        { label: 'Project', value: product.projects?.name },
        { label: 'Category', value: product.categories?.name },
        { label: 'Market', value: product.market },
        { label: 'Price Range', value: product.price_range },
        { label: 'Research Date', value: product.research_date ? new Date(product.research_date).toLocaleDateString() : '' },
        { label: 'Description', value: product.description },
      ];

      exportReportToHtml(product.name, info, modulesWithRows.filter(m => !!m.definition));
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Product not found.</p>
        <Link to="/products" className="text-zinc-900 font-medium underline mt-2 inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs 
        items={[
          { label: 'Projects', to: '/projects' },
          { label: product.projects?.name || 'Project', to: '/projects' },
          { label: product.categories?.name || 'Category', to: `/categories/${product.category_id}` },
          { label: product.name }
        ]} 
      />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{product.name}</h2>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Export Research Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Project</label>
                <p className="text-sm font-medium text-zinc-900">{product.projects?.name || 'N/A'}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Package className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Category</label>
                  <p className="text-sm font-medium text-zinc-900">{product.categories?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Globe className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Market</label>
                  <p className="text-sm font-medium text-zinc-900">{product.market || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Price Range</label>
                  <p className="text-sm font-medium text-zinc-900">{product.price_range || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block">Research Date</label>
                  <p className="text-sm font-medium text-zinc-900">
                    {product.research_date ? new Date(product.research_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-medium text-zinc-400 block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag: string) => (
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
          <ModuleSystem parentId={product.id} parentType="product" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
