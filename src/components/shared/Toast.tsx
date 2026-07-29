'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore } from '@/store/toast-store';

const icons = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle };
const colors: Record<string,string> = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

export default function ToastContainer(){
  const {toasts, remove} = useToastStore();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-[90vw]">
      {toasts.map(t=>{
        const Icon = icons[t.type as keyof typeof icons] ?? Info;
        return (
          <div key={t.id} className={cn('pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-xl bg-bg-surface/90 text-sm font-medium animate-in slide-in-from-bottom-2 duration-200', colors[t.type] ?? colors.info)}>
            <Icon className="w-4 h-4 shrink-0"/>
            <span>{t.message}</span>
            <button onClick={()=>remove(t.id)} className="ml-2 opacity-60 hover:opacity-100 shrink-0">✕</button>
          </div>
        );
      })}
    </div>
  );
}

export function useToast(){
  const {add} = useToastStore();
  return {
    toast: (type:'success'|'error'|'info'|'warning', msg:string)=>add(type,msg),
  };
}

// Legacy alias for old import names
export function ToastProvider({children}:{children:React.ReactNode}){ return <>{children}<ToastContainer/></>; }