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
 return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
   <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={()=>{if(!pending)onClose();}} />
   <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title" tabIndex={-1} className="relative bg-white dark:bg-inmo-darkcard w-full max-w-md rounded-[24px] shadow-2xl overflow-y-auto max-h-[calc(100dvh-2rem)] animate-in fade-in zoom-in-95 duration-300 text-inmo-secondary dark:text-white" onKeyDown={event=>{
     if(event.key==='Escape' && !pending)onClose();
     if(event.key==='Tab') {const nodes=dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if(!nodes?.length){event.preventDefault();return;} const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey && (document.activeElement===first || document.activeElement===dialog.current)){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}}
   }}>
     <div className="p-6 md:p-8 flex flex-col text-left">
     <h3 id="confirm-title" className="font-montserrat font-bold text-[22px] text-inmo-secondary dark:text-white mb-3">{title}</h3><p className="font-inter text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-8">{message}</p>
     {error && <p role="alert" className="text-inmo-danger text-sm mb-4">{error}</p>}
     <div className="flex flex-row w-full justify-end gap-3"><Button variant="secondary" disabled={pending} onClick={onClose} className="px-6 py-2.5 !rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-inmo-darkbg dark:hover:bg-white/10 dark:text-gray-300 border-none font-bold">{cancelText}</Button><Button variant={confirmVariant} isLoading={pending} className="px-6 py-2.5 !rounded-full font-bold shadow-sm" onClick={async()=>{
       setPending(true);setError('');
       try {await onConfirm();onClose();}catch(failure){setError(operationError(failure));}finally{setPending(false);}
     }}>{confirmText}</Button></div>
     </div>
   </div>
 </div>;
}
