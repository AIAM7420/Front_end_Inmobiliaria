export function MetricCard({label,value,icon}:{label:string;value:number|undefined;icon:React.ReactNode}) {
 return <div className="bg-white dark:bg-inmo-darkcard p-4 lg:p-5 rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col items-center justify-center text-center min-h-[120px]">
 <div className="text-inmo-accent mb-2">{icon}</div><span className="font-montserrat font-black text-3xl">{value ?? '—'}</span><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{label}</span></div>;
}
