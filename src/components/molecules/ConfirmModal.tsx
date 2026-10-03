import { useEffect, useRef, useState } from 'react';
import { Button } from '../atoms/Button';
import { operationError } from '../../integrations/backend/versioning';
export interface ProcessingConfig { title:string;steps?:string[];duration?:number;hideCancel?:boolean;successMessage?:string;type?:string }
export function ConfirmModal({isOpen,onClose,onConfirm,title,message,confirmText='Confirmar',cancelText='Cancelar',confirmVariant='accent'}:{
 isOpen:boolean;onClose:()=>void;onConfirm:()=>void|Promise<void>;title:string;message:string;confirmText?:string;cancelText?:string;confirmVariant?:'accent'|'danger'|'warning'|'secondary';icon?:React.ReactNode;withDelay?:boolean;processingConfig?:ProcessingConfig
}) {
 const [pending,setPending]=useState(false),[error,setError]=useState('');
 const dialog=useRef<HTMLDivElement>(null);
 useEffect(()=>{
   if(!isOpen)return;
   setError('');
   const previous=document.activeElement as HTMLElement|null;
   const overflow=document.body.style.overflow;
   document.body.style.overflow='hidden';dialog.current?.focus();
   return ()=>{document.body.style.overflow=overflow;previous?.focus();};
 },[isOpen]);
 if(!isOpen)return null;
 return <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 flex items-center justify-center">
   <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title" tabIndex={-1} className="w-full max-w-md rounded-card bg-white dark:bg-inmo-darkcard p-6 shadow-soft text-inmo-secondary dark:text-white" onKeyDown={event=>{
     if(event.key==='Escape' && !pending)onClose();
     if(event.key==='Tab') {const nodes=dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if(!nodes?.length)return; const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey && (document.activeElement===first || document.activeElement===dialog.current)){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}}
   }}>
     <h2 id="confirm-title" className="font-montserrat text-xl font-bold">{title}</h2><p className="my-5 font-inter text-sm">{message}</p>
     {error && <p role="alert" className="text-inmo-danger text-sm mb-4">{error}</p>}
     <div className="flex gap-3"><Button variant="secondary" disabled={pending} onClick={onClose}>{cancelText}</Button><Button variant={confirmVariant} isLoading={pending} onClick={async()=>{
       setPending(true);setError('');
       try {await onConfirm();onClose();}catch(failure){setError(operationError(failure));}finally{setPending(false);}
     }}>{confirmText}</Button></div>
   </div>
 </div>;
}
