import { create } from 'zustand';
export type TType = 'success'|'error'|'info'|'warning';
export type TItem = {id:string; type:TType; message:string;};
type S = { toasts: TItem[]; add: (type:TType,m:string)=>void; remove:(id:string)=>void; };
export const useToastStore = create<S>((set)=>({
  toasts: [],
  add(type,msg){ const id=Math.random().toString(36).slice(2); set(s=>({toasts:[...s.toasts,{id,type,message:msg}]})); setTimeout(()=>set(s=>({toasts:s.toasts.filter(t=>t.id!==id)})),3500); },
  remove(id){ set(s=>({toasts:s.toasts.filter(t=>t.id!==id)})); },
}));