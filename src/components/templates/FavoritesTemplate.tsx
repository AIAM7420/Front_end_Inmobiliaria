import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';

export interface FavoritesTemplateProps {}

/** V1 does not expose a favorites resource. Never present catalog items as saved items. */
export function FavoritesTemplate(_props: FavoritesTemplateProps) {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col px-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mt-2 mb-6">
        <h1 className="font-montserrat font-bold text-3xl text-inmo-secondary dark:text-white mb-2">Favoritos</h1>
        <p className="text-gray-500 dark:text-gray-400 font-inter text-sm">Tus propiedades guardadas aparecerán aquí cuando esta función esté disponible.</p>
      </div>
      <section className="bg-white dark:bg-inmo-darkcard rounded-[30px] p-6 md:p-10 shadow-soft max-w-xl border border-gray-100 dark:border-inmo-darktertiary">
        <div className="w-14 h-14 rounded-full bg-inmo-accent/10 text-inmo-accent flex items-center justify-center mb-5">
          <Heart className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <h2 className="font-montserrat text-xl font-bold text-inmo-secondary dark:text-white">Todavía no hay favoritos guardados</h2>
        <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">La API actual no guarda favoritos; puedes explorar las propiedades disponibles.</p>
        <Button onClick={() => navigate('/')} className="px-6 py-3">Explorar propiedades</Button>
      </section>
    </main>
  );
}
