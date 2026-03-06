import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ModuleDefinition } from '../constants/moduleLibrary';
import { ModuleRow } from '../types';

export const exportModuleToExcel = (
  definition: ModuleDefinition,
  rows: ModuleRow[]
) => {
  const date = new Date().toISOString().split('T')[0];
  const fileName = `${definition.name.replace(/\s+/g, '-')}_${date}.xlsx`;

  // Prepare data for Excel
  const data = rows.map((row) => {
    const rowData: any = {};
    definition.columns.forEach((col) => {
      rowData[col.label] = row.row_data[col.key] || '';
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, definition.name);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(blob, fileName);
};

export const exportReportToHtml = (
  title: string,
  info: { label: string; value: string }[],
  modules: { definition: ModuleDefinition; rows: ModuleRow[]; notes?: string }[]
) => {
  const date = new Date().toLocaleDateString();
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}_report.html`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Research Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #18181b;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #fff;
        }
        header {
            border-bottom: 2px solid #f4f4f5;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        .report-meta {
            color: #71717a;
            font-size: 0.875rem;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        h1 {
            font-size: 2.5rem;
            margin: 0 0 20px 0;
            color: #09090b;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .info-item b {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #a1a1aa;
            margin-bottom: 4px;
        }
        .info-item span {
            font-weight: 500;
        }
        .module {
            margin-bottom: 60px;
            page-break-inside: avoid;
        }
        .module-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            border-bottom: 1px solid #f4f4f5;
            padding-bottom: 12px;
        }
        .module-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
        }
        .module-category {
            font-size: 0.75rem;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 0.875rem;
        }
        th {
            background-color: #f9fafb;
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e4e4e7;
            color: #71717a;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #f4f4f5;
            vertical-align: top;
        }
        .notes {
            background-color: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            color: #52525b;
            border-left: 4px solid #e4e4e7;
        }
        .notes-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #18181b;
            font-size: 0.75rem;
            text-transform: uppercase;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <header>
        <div class="report-meta">Marketing Notebook Report • ${date}</div>
        <h1>${title}</h1>
        <div class="info-grid">
            ${info.map(item => `
                <div class="info-item">
                    <b>${item.label}</b>
                    <span>${item.value || 'N/A'}</span>
                </div>
            `).join('')}
        </div>
    </header>

    ${modules.map(mod => `
        <div class="module">
            <div class="module-header">
                <div>
                    <div class="module-category">${mod.definition.category}</div>
                    <h2 class="module-title">${mod.definition.name}</h2>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        ${mod.definition.columns.map(col => `<th>${col.label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${mod.rows.length > 0 ? mod.rows.map(row => `
                        <tr>
                            ${mod.definition.columns.map(col => `<td>${row.row_data[col.key] || ''}</td>`).join('')}
                        </tr>
                    `).join('') : `<tr><td colspan="${mod.definition.columns.length}" style="text-align: center; color: #a1a1aa;">No data available</td></tr>`}
                </tbody>
            </table>

            ${mod.notes ? `
                <div class="notes">
                    <div class="notes-title">Notes & Observations</div>
                    ${mod.notes}
                </div>
            ` : ''}
        </div>
    `).join('')}

    <footer style="margin-top: 80px; text-align: center; color: #a1a1aa; font-size: 0.75rem;">
        Generated by Marketing Notebook
    </footer>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, fileName);
};
