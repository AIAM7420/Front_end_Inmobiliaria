import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export interface DropdownOption { value: string; label: string; disabled?: boolean; icon?: ReactNode }
export interface DropdownSelectProps {
  label: string; value: string; options: DropdownOption[]; onChange: (value: string) => void;
  icon?: ReactNode; disabled?: boolean; popupOwnerId?: string;
  compact?: boolean;
  glass?: boolean;
}

/** INMO single-choice dropdown. Focus stays on the combobox for keyboard navigation. */
export function DropdownSelect({ label, value, options, onChange, icon, disabled, popupOwnerId, compact = false, glass = false }: DropdownSelectProps) {
  const id = useId(), trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false), [active, setActive] = useState(0);
  const typeahead = useRef({ text: '', at: 0 });
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const selected = options.findIndex(option => option.value === value);
  const close = useCallback(() => setOpen(false), []);
  const show = (index = selected) => { setActive(enabled.includes(index) ? index : enabled[0] ?? 0); setOpen(true); };
  const choose = (index: number) => {
    if (!options[index] || options[index].disabled) return;
    onChange(options[index].value); close(); trigger.current?.focus();
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === 'Tab') { close(); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); event.stopPropagation();
      if (!open) show();
      else { const index = enabled.indexOf(active), delta = event.key === 'ArrowDown' ? 1 : -1; setActive(enabled[(index + delta + enabled.length) % enabled.length] ?? 0); }
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); show(event.key === 'Home' ? enabled[0] : enabled.at(-1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); event.stopPropagation(); if (open) choose(active); else show();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now(), previous = now - typeahead.current.at < 700 ? typeahead.current.text : '';
      const text = previous + event.key.toLocaleLowerCase('es-MX'); typeahead.current = { text, at: now };
      const match = options.findIndex(option => !option.disabled && option.label.toLocaleLowerCase('es-MX').startsWith(text));
      if (match >= 0) show(match);
    }
  };
  return <>
    <button ref={trigger} type="button" role="combobox" aria-label={label} aria-haspopup="listbox"
      aria-expanded={open} aria-controls={open ? id : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined}
      disabled={disabled || enabled.length === 0} onClick={event => { event.currentTarget.focus({ preventScroll: true }); if (open) close(); else show(); }} onKeyDown={keyboard}
      className={`${compact ? 'h-11 px-4 text-xs font-bold bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm' : `h-[70px] px-6 text-lg ${glass ? 'bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm' : 'bg-white dark:bg-inmo-darkcard shadow-soft'}`} w-full rounded-full flex items-center gap-3 text-left font-inter text-inmo-secondary dark:text-white outline-none focus-visible:ring-4 focus-visible:ring-inmo-tertiary dark:focus-visible:ring-inmo-darktertiary disabled:opacity-50 disabled:cursor-not-allowed`}>
      {icon && <span className="shrink-0">{icon}</span>}<span className="min-w-0 flex-1 truncate">{options[selected]?.label ?? label}</span>
      <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <DropdownOptions id={id} ownerId={popupOwnerId} trigger={trigger} label={label} options={options} value={value} active={active} onActive={setActive} onChoose={choose} onClose={close} />}
  </>;
}

function DropdownOptions({ id, ownerId, trigger, label, options, value, active, onActive, onChoose, onClose }: {
  id: string; ownerId?: string; trigger: RefObject<HTMLButtonElement | null>; label: string; options: DropdownOption[];
  value: string; active: number; onActive: (index: number) => void; onChoose: (index: number) => void; onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState({ top: 0, left: 0, width: 0, maxHeight: 240 });
  useLayoutEffect(() => {
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect(); if (!rect) return;
      const below = window.innerHeight - rect.bottom - 16, above = rect.top - 16;
      const up = below < Math.min(240, options.length * 44 + 16) && above > below;
      const height = Math.max(44, Math.min(240, up ? above : below));
      setPlacement({ top: up ? Math.max(8, rect.top - height - 8) : rect.bottom + 8,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)), width: Math.min(rect.width, window.innerWidth - 16), maxHeight: height });
    };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [trigger, options.length]);
  useLayoutEffect(() => { document.getElementById(`${id}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' }); }, [id, active]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) onClose(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [trigger, onClose]);
  return createPortal(<div ref={panel} id={id} role="listbox" aria-label={label} data-inmo-dropdown-owner={ownerId} style={placement}
    className="fixed z-[110] p-2 overflow-y-auto overscroll-contain rounded-3xl bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl border border-gray-100 dark:border-inmo-darktertiary shadow-xl font-inter">
    {options.map((option, index) => <button key={option.value} id={`${id}-option-${index}`} type="button" role="option" aria-selected={option.value === value}
      tabIndex={-1} disabled={option.disabled} onPointerDown={event => { if (event.pointerType !== 'touch') event.preventDefault(); }} onPointerMove={event => { if (event.pointerType !== 'touch') onActive(index); }} onClick={() => onChoose(index)}
      className={`w-full min-h-11 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-left text-sm transition-colors disabled:opacity-50 ${option.value === value ? 'bg-inmo-accent/10 text-inmo-accent font-bold' : 'text-inmo-secondary dark:text-white'} ${active === index ? 'ring-2 ring-inmo-accent/40 bg-gray-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
      {option.icon}<span className="flex-1">{option.label}</span>{option.value === value && <Check className="w-4 h-4 shrink-0 text-inmo-accent" />}
    </button>)}
  </div>, document.body);
}
