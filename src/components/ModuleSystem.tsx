import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { getSupabase } from '../lib/supabase';
import { Module } from '../types';
import { MODULE_LIBRARY } from '../constants/moduleLibrary';
import { Plus, Loader2, LayoutGrid, Search, X } from 'lucide-react';
import ModuleCard from './ModuleCard';
import Modal from './Modal';

interface ModuleSystemProps {
  parentId: string;
  parentType: 'industry' | 'category' | 'product';
}

const ModuleSystem: React.FC<ModuleSystemProps> = ({ parentId, parentType }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchModules();
  }, [parentId]);

  const fetchModules = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('modules')
      .select('*')
      .eq('parent_id', parentId)
      .eq('parent_type', parentType)
      .order('module_order', { ascending: true });

    if (error) console.error('Error fetching modules:', error);
    else setModules(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = modules.findIndex((m) => m.id === activeId);
      const newIndex = modules.findIndex((m) => m.id === overId);

      const newModules = arrayMove(modules, oldIndex, newIndex) as Module[];
      setModules(newModules);

      // Update orders in database
      const updates = newModules.map((m, index) => ({
        id: m.id,
        module_order: index,
      }));

      for (const update of updates) {
        await getSupabase()
          .from('modules')
          .update({ module_order: update.module_order })
          .eq('id', update.id);
      }
    }
  };

  const handleAddModule = async (moduleType: string) => {
    const nextOrder = modules.length;
    const { data, error } = await getSupabase()
      .from('modules')
      .insert([
        {
          parent_id: parentId,
          parent_type: parentType,
          module_type: moduleType,
          module_order: nextOrder,
        },
      ])
      .select()
      .single();

    if (error) console.error('Error adding module:', error);
    else if (data) {
      setModules([...modules, data]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    console.log('Opening delete confirmation for module:', id);
    setModuleToDelete(id);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;
    
    const id = moduleToDelete;
    console.log('Confirmed deletion for module:', id);
    
    try {
      const { error } = await getSupabase()
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module: ' + error.message);
      } else {
        console.log('Module deleted successfully:', id);
        setModules(modules.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Unexpected error deleting module:', err);
    } finally {
      setModuleToDelete(null);
    }
  };

  const filteredLibrary = MODULE_LIBRARY.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(MODULE_LIBRARY.map((m) => m.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-900 font-semibold">
          <LayoutGrid className="w-5 h-5" />
          <h3>Analysis Modules</h3>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">No Analysis Modules</h3>
          <p className="text-zinc-500 text-sm max-w-xs mt-1 mb-6">
            Add marketing analysis frameworks to structure your research and insights.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm font-medium text-zinc-900 underline hover:text-zinc-600"
          >
            Browse Module Library
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} onDelete={handleDeleteModule} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Module Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Module Library"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {categories.map((category) => {
            const categoryModules = filteredLibrary.filter((m) => m.category === category);
            if (categoryModules.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryModules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <button
                        key={module.type}
                        onClick={() => handleAddModule(module.type)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-colors">
                          <Icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-900">{module.name}</span>
                          <span className="text-[10px] text-zinc-400">Insert framework</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredLibrary.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">No modules found matching your search.</p>
            </div>
          )}
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!moduleToDelete}
        onClose={() => setModuleToDelete(null)}
        title="Delete Module"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Are you sure?</h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              This will permanently delete this module and all its research data. This action cannot be undone.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setModuleToDelete(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete Module
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModuleSystem;
