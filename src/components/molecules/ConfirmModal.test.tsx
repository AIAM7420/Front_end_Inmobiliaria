import { cleanup,fireEvent,render,screen } from '@testing-library/react';
import { afterEach,expect,it,vi } from 'vitest';
import { ConfirmModal } from './ConfirmModal';
afterEach(cleanup);
it('does not report success or close while the real operation is pending or fails',async()=>{
 let fail!:(error:Error)=>void;
 const operation=new Promise<void>((_,reject)=>{fail=reject;});
 const close=vi.fn();
 render(<ConfirmModal isOpen onClose={close} onConfirm={()=>operation} title="Publicar" message="Se verificará la publicación." />);
 fireEvent.click(screen.getByRole('button',{name:'Confirmar'}));
 expect(close).not.toHaveBeenCalled();
 expect((screen.getByRole('button',{name:'Procesando...'}) as HTMLButtonElement).disabled).toBe(true);
 fail(new Error('No hay fotografía confirmada.'));
 await screen.findByText('No hay fotografía confirmada.');
 expect(close).not.toHaveBeenCalled();
});
