import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Module, ModuleRow } from '../types';
import { MODULE_LIBRARY } from '../constants/moduleLibrary';
import { getSupabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, GripVertical, Trash2, Loader2, Info, LayoutGrid, Download } from 'lucide-react';
import ModuleTable from './ModuleTable';
import { motion, AnimatePresence } from 'motion/react';
import { exportModuleToExcel } from '../services/exportService';

interface ModuleCardProps {
  module: Module;
  onDelete: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [rows, setRows] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(module.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = MODULE_LIBRARY.find((m) => m.type === module.module_type);
  const Icon = definition?.icon || LayoutGrid;

  useEffect(() => {
    fetchRows();
  }, [module.id]);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from('module_rows')
      .select('*')
      .eq('module_id', module.id)
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching rows:', error);
    else setRows(data || []);
    setLoading(false);
  };

  const handleAddRow = async (rowData: any) => {
    const { data, error } = await getSupabase()
      .from('module_rows')
      .insert([{ module_id: module.id, row_data: rowData }])
      .select()
      .single();

    if (error) console.error('Error adding row:', error);
    else if (data) setRows([...rows, data]);
  };

  const handleUpdateRow = async (id: string, rowData: any) => {
    const { error } = await getSupabase()
      .from('module_rows')
      .update({ row_data: rowData })
      .eq('id', id);

    if (error) console.error('Error updating row:', error);
    else {
      setRows(rows.map((r) => (r.id === id ? { ...r, row_data: rowData } : r)));
    }
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await getSupabase()
      .from('module_rows')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting row:', error);
    else setRows(rows.filter((r) => r.id !== id));
  };

  const handleUpdateNotes = async () => {
    const { error } = await getSupabase()
      .from('modules')
      .update({ notes })
      .eq('id', module.id);

    if (error) console.error('Error updating notes:', error);
    else setIsEditingNotes(false);
  };

  if (!definition) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden group/card"
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/30">
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
              <Icon className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-zinc-900">{definition.name}</h3>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{definition.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (definition) {
                exportModuleToExcel(definition, rows);
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-medium"
            title="Export to Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete button clicked for module:', module.id);
              onDelete(module.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors opacity-100 sm:opacity-0 group-hover/card:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                </div>
              ) : (
                <ModuleTable
                  definition={definition}
                  rows={rows}
                  onAddRow={handleAddRow}
                  onUpdateRow={handleUpdateRow}
                  onDeleteRow={handleDeleteRow}
                />
              )}
            </div>

            {/* Notes Section */}
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <Info className="w-3 h-3" />
                  Notes & Observations
                </div>
                {!isEditingNotes && notes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-[10px] font-medium text-zinc-500 hover:text-zinc-900 underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm min-h-[80px]"
                    placeholder="Add your analysis, insights or notes here..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotes(module.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateNotes}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => !notes && setIsEditingNotes(true)}
                  className={`text-sm text-zinc-600 cursor-pointer ${!notes ? 'italic text-zinc-400' : ''}`}
                >
                  {notes || 'Click to add notes or analysis observations...'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleCard;
