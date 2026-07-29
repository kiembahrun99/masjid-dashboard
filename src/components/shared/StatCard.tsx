'use client';

import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/currency';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  trend?: number; // positive = up, negative = down
  format?: 'rupiah' | 'number' | 'text';
  className?: string;
}

export default function StatCard({
  title, value, icon: Icon, iconColor = 'text-primary',
  iconBg = 'bg-primary-soft', trend, format = 'text', className
}: StatCardProps) {
  const displayValue = format === 'rupiah' ? formatRupiah(Number(value), true)
    : format === 'number' ? Number(value).toLocaleString('id-ID')
    : value;

  return (
    <Card className={cn('rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
            trend > 0 ? 'text-success bg-success/10' : trend < 0 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted'
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-0.5 font-medium">{title}</p>
      <p className="text-2xl font-extrabold tabular-nums">{displayValue}</p>
    </Card>
  );
}