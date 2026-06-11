'use client';

import { useState, useMemo } from 'react';
import { mockRegistryData } from './registry-data';
import { RegistryItem } from './registry-types';
import { RegistryItemCard } from './RegistryItemCard';
import { RegistryDetailPanel } from './RegistryDetailPanel';
import { RegistryFilters } from './RegistryFilters';

export function RegistryView() {
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredData = useMemo(() => {
    return mockRegistryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType ? item.type === selectedType : true;
      const matchesStatus = selectedStatus ? item.status === selectedStatus : true;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* View Header */}
      <div className="px-6 py-4 border-b border-border bg-background flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Registry View
            <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md border">
              Read-Only
            </span>
            <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-md border border-purple-200">
              Mock Mode
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catálogo técnico de capabilities, dependências e contratos do System Builder.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredData.length} item{filteredData.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <RegistryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main List Area */}
        <div className={`flex-1 p-6 overflow-y-auto ${selectedItem ? 'hidden md:block' : 'block'}`}>
          {filteredData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <svg className="w-12 h-12 mb-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-foreground mb-1">No items found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredData.map((item) => (
                <RegistryItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="w-full md:w-[400px] lg:w-[500px] h-full flex-shrink-0 animate-in slide-in-from-right-4 duration-200 z-20 bg-background absolute md:relative right-0">
            <RegistryDetailPanel
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
