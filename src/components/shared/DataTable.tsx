'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: string[];
  pageSize?: number;
  onRowClick?: (item: T) => void;
  className?: string;
}

export default function DataTable<T extends object>({
  columns, data, searchable = true, searchKeys = [],
  pageSize = 10, onRowClick, className
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  let filtered: T[] = data;
  if (search && searchKeys.length > 0) {
    const q = search.toLowerCase();
    filtered = data.filter(item =>
      searchKeys.some(k => String((item as Record<string, unknown>)[k as string] ?? '').toLowerCase().includes(q))
    );
  }

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const va = (a as any)[sortKey] as string | number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vb = (b as any)[sortKey] as string | number;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className={cn('rounded-2xl overflow-hidden', className)}>
      {searchable && (
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Cari..."
            className="pl-10 rounded-2xl bg-bg-subtle border-0"
          />
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left text-xs font-semibold text-muted-foreground px-4 py-3',
                    col.sortable && 'cursor-pointer hover:text-foreground select-none',
                    col.className
                  )}
                  onClick={() => {
                    if (!col.sortable) return;
                    if (sortKey === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                    else { setSortKey(col.key); setSortDir('asc'); }
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground text-sm">
                  Tidak ada data
                </td>
              </tr>
            ) : paged.map((item, i) => (
              <tr
                key={i}
                className={cn(
                  'border-b border-border/50 transition-colors',
                  i % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-subtle/30',
                  onRowClick && 'cursor-pointer hover:bg-primary-soft/20'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-3 text-sm', col.className)}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {paged.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada data</div>
        ) : paged.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl bg-bg-surface p-4 border border-border/50 space-y-2"
            onClick={() => onRowClick?.(item)}
          >
            {columns.filter(c => !c.hideOnMobile).map(col => (
              <div key={col.key} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{col.label}</span>
                <span className="text-sm font-medium">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-xs text-muted-foreground">
            {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} dari {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-xl hover:bg-bg-subtle disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-xl hover:bg-bg-subtle disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}