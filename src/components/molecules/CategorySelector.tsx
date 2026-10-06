import { Layers } from 'lucide-react';
import { CATEGORY_ITEMS, type PropertyCategory } from './CategoryPills';
import { DropdownSelect } from './DropdownSelect';
export interface CategorySelectorProps { activeFilter: PropertyCategory | null; onSelectFilter: (category: PropertyCategory | null) => void; className?: string }
export function CategorySelector({ activeFilter, onSelectFilter, className = '' }: CategorySelectorProps) {
  const Icon = CATEGORY_ITEMS.find(item => item.id === activeFilter)?.Icon ?? Layers;
  return <div className={className}><DropdownSelect compact label="Tipo de inmueble" value={activeFilter ?? ''}
    icon={<span className="w-6 h-6 rounded-full bg-inmo-accent/10 flex items-center justify-center"><Icon className="w-3.5 h-3.5 text-inmo-accent" /></span>}
    options={[{ value: '', label: 'Todos', icon: <Layers className="w-4 h-4 text-inmo-accent" /> }, ...CATEGORY_ITEMS.map(({ id, label, Icon }) => ({ value: id, label, icon: <Icon className="w-4 h-4 text-inmo-accent" /> }))]}
    onChange={value => onSelectFilter(value ? value as PropertyCategory : null)} /></div>;
}
