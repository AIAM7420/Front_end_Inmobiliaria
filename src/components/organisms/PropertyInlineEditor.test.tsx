import { afterEach,expect,it,vi } from 'vitest';
import { cleanup,fireEvent,render,screen,waitFor } from '@testing-library/react';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { AxiosAdapter } from 'axios';
import { api } from '../../integrations/backend/axios.config';
import { PropertyInlineEditor } from './PropertyInlineEditor';
vi.mock('../views/asesor/PropertyLocationMap',()=>({PropertyLocationMap:()=>null}));
const original=api.defaults.adapter;
afterEach(()=>{cleanup();api.defaults.adapter=original;});
const initial={
 id:'9007199254740993',asesor_id:'1',tipo_id:'1',operacion_id:'1',zona_id:'1',titulo:'Casa original',descripcion:'Una descripción suficientemente extensa para la publicación de esta propiedad de prueba.',
 direccion:'Calle privada 10',codigo_postal:'37000',latitud:'21.1234567',longitud:'-101.1234567',precio:'1500000.00',moneda:'MXN',habitaciones:3,banos:'2.0',superficie_terreno:'120.00',superficie_construccion:'90.00',amenidad_ids:[],
 estado_publicacion:'REGISTRADA',visible:false,disponible:true,motivo_no_disponibilidad:null,comparte_comision:false,porcentaje_comision:null,version:1,actualizada_at:'2026-10-02T00:00:00Z'
};
it('keeps the draft after 412 and only retries after fetching and explicitly reviewing the latest version',async()=>{
 let version=1;
 const sent:string[]=[];
 const adapter:AxiosAdapter=async config=>{
  const response={config,status:200,statusText:'OK',headers:{},data:initial};
  if(config.url?.startsWith('/catalogos/'))return {...response,data:[{id:'1',codigo:'VENTA',nombre:'Prueba'}]};
  if(config.method==='patch'){
   sent.push(String(config.headers.get('If-Match')));
   if(sent.length===1){version=2;throw new AxiosError('Conflict',undefined,config,undefined,{...response,status:412,data:{code:'VERSION_OBSOLETA',title:'Conflicto',trace_id:'test'}});}
   return {...response,data:{...initial,titulo:'Mi cambio local',version:3}};
  }
  return {...response,data:{...initial,version,titulo:version===2?'Cambio de otra persona':initial.titulo}};
 };
 api.defaults.adapter=adapter;
 const onSave=vi.fn();
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}})}><PropertyInlineEditor propertyId={initial.id} onSave={onSave} onCancel={()=>{}} /></QueryClientProvider>);
 const title=await screen.findByLabelText('Título');
 fireEvent.change(title,{target:{value:'Mi cambio local'}});
 fireEvent.click(screen.getByRole('button',{name:'Guardar cambios'}));
 await screen.findByText(/Tu formulario se conserva/);
 expect((title as HTMLInputElement).value).toBe('Mi cambio local');
 expect((screen.getByRole('button',{name:'Guardar cambios'}) as HTMLButtonElement).disabled).toBe(true);
 expect(sent).toEqual(['"v1"']);
 fireEvent.click(screen.getByRole('button',{name:'Revisar versión actual'}));
 await screen.findByText(/Cambio de otra persona/);
 expect((title as HTMLInputElement).value).toBe('Mi cambio local');
 expect(sent).toHaveLength(1);
 fireEvent.click(screen.getByRole('button',{name:'He revisado; conservar mis cambios'}));
 fireEvent.click(screen.getByRole('button',{name:'Guardar cambios'}));
 await waitFor(()=>expect(onSave).toHaveBeenCalledOnce());
 expect(sent).toEqual(['"v1"','"v2"']);
});
