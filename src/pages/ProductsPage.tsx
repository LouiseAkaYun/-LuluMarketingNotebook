import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Product, Category, Project } from '../types';
import { Plus, Pencil, Trash2, Loader2, DollarSign, Calendar } from 'lucide-react';
import Modal from '../components/Modal';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    project_id: '', 
    category_id: '', 
    description: '',
    market: '', 
    price_range: '', 
    research_date: new Date().toISOString().split('T')[0],
    tags: [] as string[] 
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchProjects();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('products')
      .select('*, projects(name), categories(name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await getSupabase().from('categories').select('id, name');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
  };

  const fetchProjects = async () => {
    const { data, error } = await getSupabase().from('projects').select('id, name');
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { description, ...dbPayload } = formData;
    if (editingProduct) {
      const { error } = await getSupabase()
        .from('products')
        .update(dbPayload)
        .eq('id', editingProduct.id);
      if (error) console.error('Error updating product:', error);
    } else {
      const { error } = await getSupabase()
        .from('products')
        .insert([dbPayload]);
      if (error) console.error('Error creating product:', error);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      project_id: '', 
      category_id: '', 
      description: '',
      market: '', 
      price_range: '', 
      research_date: new Date().toISOString().split('T')[0],
      tags: [] 
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await getSupabase()
        .from('products')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting product:', error);
      fetchProducts();
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      project_id: product.project_id, 
      category_id: product.category_id, 
      description: product.description || '',
      market: product.market, 
      price_range: product.price_range, 
      research_date: product.research_date,
      tags: product.tags || [] 
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
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Products</h2>
          <p className="text-zinc-500 text-sm">Detailed research on specific products.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ 
              name: '', 
              project_id: '', 
              category_id: '', 
              market: '', 
              price_range: '', 
              research_date: new Date().toISOString().split('T')[0],
              tags: [] 
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 text-sm">No products found. Start adding products to your research notebook.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Market</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price Range</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link 
                        to={`/products/${product.id}`}
                        className="text-sm font-medium text-zinc-900 hover:underline"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] text-zinc-400">{product.projects?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-500">{product.categories?.name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-500">{product.market}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <DollarSign className="w-3.5 h-3.5" />
                      {product.price_range}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
              placeholder="e.g. Acme CRM"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Project</label>
              <select
                required
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
              >
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
              >
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm min-h-[80px]"
              placeholder="Brief overview of the product..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Market</label>
              <input
                type="text"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
                placeholder="e.g. SMB, Enterprise"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Price Range</label>
              <input
                type="text"
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
                placeholder="e.g. $10-50/mo"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Research Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.research_date}
                onChange={(e) => setFormData({ ...formData, research_date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
              />
              <Calendar className="absolute right-4 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
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
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
