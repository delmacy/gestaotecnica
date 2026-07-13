"use client";

import { ViewBlueprint, ViewField, ViewType } from "./view-builder-types";

interface ViewCanvasProps {
  blueprint: ViewBlueprint;
  simulatedType: ViewType;
  simulatedFields: Record<string, boolean>;
}

export function ViewCanvas({ blueprint, simulatedType, simulatedFields }: ViewCanvasProps) {
  // Filter fields based on simulated visibility
  const visibleFields = blueprint.fields.filter(f => {
    // If we have a simulated state for this field, use it, otherwise fallback to the blueprint's default visibility
    return simulatedFields[f.id] !== undefined ? simulatedFields[f.id] : f.visible;
  });

  const getFieldLabel = (f: ViewField) => f.label || f.key || f.id || "Unknown Field";

  const renderMockTable = () => (
    <div className="border rounded-md bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {visibleFields.map(f => (
                <th key={f.id} className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                  {getFieldLabel(f)}
                  {f.sortable && <span className="ml-1 text-gray-400 text-[10px]">↕</span>}
                </th>
              ))}
              {blueprint.layout.show_actions && (
                <th className="px-4 py-3 font-medium text-gray-700 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y text-gray-600">
            {Array.from({ length: blueprint.preview_state.mock_row_count || 3 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {visibleFields.map(f => (
                  <td key={f.id} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4 max-w-[150px]"></div>
                  </td>
                ))}
                {blueprint.layout.show_actions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t flex justify-between">
        <span>Showing {blueprint.preview_state.mock_row_count} mock rows</span>
        <span>Pagination: {blueprint.layout.default_page_size} / page</span>
      </div>
    </div>
  );

  const renderMockKanban = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {['To Do', 'In Progress', 'Done'].map(col => (
        <div key={col} className="w-72 shrink-0 bg-gray-50 rounded-md border flex flex-col max-h-[500px]">
          <div className="p-3 border-b font-medium text-sm text-gray-700 bg-white rounded-t-md flex justify-between">
            {col} <span className="text-gray-400 text-xs">{(Math.random() * 5 + 1).toFixed(0)}</span>
          </div>
          <div className="p-2 flex-1 overflow-y-auto space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm border text-sm space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                {visibleFields.slice(0, 3).map(f => (
                  <div key={f.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{getFieldLabel(f)}</span>
                    <span className="h-3 bg-gray-100 rounded animate-pulse w-1/3"></span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMockCalendar = () => (
    <div className="bg-white border rounded-md shadow-sm h-[500px] flex flex-col">
       <div className="p-4 border-b flex justify-between items-center">
         <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
         <div className="flex gap-1">
           <div className="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
           <div className="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
           <div className="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
         </div>
       </div>
       <div className="flex-1 p-4 grid grid-cols-7 gap-px bg-gray-200 border-t">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="bg-white p-1 min-h-[80px]">
              <div className="text-xs text-gray-400 mb-1">{i + 1}</div>
              {i % 8 === 0 && (
                <div className="bg-blue-100 text-blue-700 text-[10px] p-1 rounded truncate">
                  Mock Event
                </div>
              )}
            </div>
          ))}
       </div>
    </div>
  );

  const renderMockCompactList = () => {
    const rowCount = blueprint.preview_state.mock_row_count || 0;

    if (rowCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 border rounded-md bg-white text-gray-500 shadow-sm">
          <p>No rows to display.</p>
        </div>
      );
    }

    return (
      <div className="bg-white border rounded-md shadow-sm divide-y">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
            <div className="flex-1 space-y-2">
               {visibleFields.slice(0, 1).map(f => (
                  <div key={f.id} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{getFieldLabel(f)}:</span>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
               ))}
               <div className="flex gap-4">
                 {visibleFields.slice(1, 3).map(f => (
                    <div key={f.id} className="flex items-center gap-2">
                       <span className="text-xs text-gray-400">{getFieldLabel(f)}:</span>
                       <div className="h-3 bg-gray-100 rounded animate-pulse w-16"></div>
                    </div>
                 ))}
               </div>
            </div>
            {blueprint.layout.show_actions && (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t flex justify-between">
          <span>Showing {rowCount} items</span>
        </div>
      </div>
    );
  };

  const renderFallback = () => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md bg-gray-50 text-gray-500">
      <div title="Warning" className="mb-2">⚠️</div>
      <p>Visual preview for <strong>{simulatedType}</strong> is not fully implemented in this design MVP.</p>
      <p className="text-xs mt-1">Fields mapped: {visibleFields.length}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-100/50 relative">
      {/* Canvas Header */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{blueprint.name}</h2>
          <p className="text-sm text-gray-500">{blueprint.description}</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium border border-yellow-200">
             MOCK CANVAS
           </span>
        </div>
      </div>

      {/* Warning Bar */}
      <div className="mx-4 mb-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-md border border-blue-100 flex items-start gap-2">
         <div title="Info" className="mt-0.5">ℹ️</div>
         <div>
           <p className="font-medium">Design-only Mode</p>
           <p className="text-blue-600/80 mt-0.5">This view does not query a database or generate real components. Layouts are structural representations.</p>
         </div>
      </div>

      {/* Render Area */}
      <div className="px-4 pb-4 flex-1 overflow-auto">
        {simulatedType === 'table' && renderMockTable()}
        {simulatedType === 'kanban' && renderMockKanban()}
        {simulatedType === 'calendar' && renderMockCalendar()}
        {simulatedType === 'compact_list' && renderMockCompactList()}
        {['detail', 'timeline', 'dashboard_cards', 'split_master_detail'].includes(simulatedType) && renderFallback()}
      </div>
    </div>
  );
}
