import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-2xl bg-bg-subtle', className)} {...props} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] bg-bg-surface space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-14 h-5 rounded-full" />
      </div>
      <Skeleton className="w-24 h-3 rounded-full" />
      <Skeleton className="w-32 h-7 rounded-lg" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return <div className={cn('rounded-3xl p-5 bg-bg-surface', className)}><Skeleton className="w-full h-[240px] rounded-2xl" /></div>;
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-bg-surface">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4 rounded-full" /><Skeleton className="h-2.5 w-1/2 rounded-full" /></div>
        </div>
      ))}
    </div>
  );
}