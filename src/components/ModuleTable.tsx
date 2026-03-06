import React, { useState } from 'react';
import { ModuleDefinition } from '../constants/moduleLibrary';
import { ModuleRow } from '../types';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface ModuleTableProps {
  definition: ModuleDefinition;
  rows: ModuleRow[];
  onAddRow: (data: any) => void;
  onUpdateRow: (id: string, data: any) => void;
  onDeleteRow: (id: string) => void;
}

const ModuleTable: React.FC<ModuleTableProps> = ({
  definition,
  rows,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
}) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [cellValue, setCellValue] = useState<string>('');

  const handleStartCellEdit = (rowId: string, colKey: string, value: any) => {
    setEditingCell({ rowId, colKey });
    setCellValue(value || '');
  };

  const handleSaveCellEdit = (rowId: string, colKey: string) => {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      const newData = { ...row.row_data, [colKey]: cellValue };
      onUpdateRow(rowId, newData);
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowId: string, colKey: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveCellEdit(rowId, colKey);
    }
    if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    const initialData = definition.columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {});
    setFormData(initialData);
  };

  const handleSaveAdd = () => {
    onAddRow(formData);
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-zinc-100">
            {definition.columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {rows.map((row) => (
            <tr key={row.id} className="group hover:bg-zinc-50/50 transition-colors">
              {definition.columns.map((col) => {
                const isEditing = editingCell?.rowId === row.id && editingCell?.colKey === col.key;
                return (
                  <td 
                    key={col.key} 
                    className={`px-4 py-3 text-sm text-zinc-600 cursor-text min-w-[150px] ${isEditing ? 'bg-zinc-50' : ''}`}
                    onClick={() => !isEditing && handleStartCellEdit(row.id, col.key, row.row_data[col.key])}
                  >
                    {isEditing ? (
                      col.type === 'select' ? (
                        <select
                          autoFocus
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={() => handleSaveCellEdit(row.id, col.key)}
                          className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm bg-white"
                        >
                          <option value="">Select...</option>
                          {col.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : col.type === 'textarea' ? (
                        <textarea
                          autoFocus
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={() => handleSaveCellEdit(row.id, col.key)}
                          onKeyDown={(e) => handleKeyDown(e, row.id, col.key)}
                          className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm min-h-[60px] bg-white"
                        />
                      ) : (
                        <input
                          autoFocus
                          type="text"
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={() => handleSaveCellEdit(row.id, col.key)}
                          onKeyDown={(e) => handleKeyDown(e, row.id, col.key)}
                          className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm bg-white"
                        />
                      )
                    ) : (
                      <div className="whitespace-pre-wrap min-h-[1.25rem]">
                        {row.row_data[col.key] || <span className="text-zinc-300 italic text-xs">Empty</span>}
                      </div>
                    )}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRow(row.id);
                  }}
                  className="p-1 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}

          {isAdding && (
            <tr className="bg-zinc-50/50">
              {definition.columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.type === 'select' ? (
                    <select
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm bg-white"
                    >
                      <option value="">Select...</option>
                      {col.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : col.type === 'textarea' ? (
                    <textarea
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm min-h-[60px] bg-white"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[col.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 text-sm bg-white"
                    />
                  )
                  }
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={handleSaveAdd}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="p-1 text-zinc-400 hover:bg-zinc-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isAdding && (
        <button
          onClick={handleStartAdd}
          className="w-full py-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors border-t border-zinc-100"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Add Row</span>
        </button>
      )}
    </div>
  );
};

export default ModuleTable;
