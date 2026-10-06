import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { FilterDropdown } from './FilterDropdown';

vi.mock('../../context/AppContext', () => ({ useAppContext: () => ({ globalFilters: { tipo_id: '7', precio_max: '1000000' } }) }));
vi.mock('../../integrations/backend/hooks/useProperties', () => ({ useGetCatalog: () => ({ data: [{ id: '1', nombre: 'León', codigo: 'LEON' }] }) }));
afterEach(cleanup);

function Example({ apply }: { apply: (criteria: unknown) => void }) {
  const [open, setOpen] = useState(false);
  return <><header><button onClick={() => setOpen(true)}>Abrir filtros</button><FilterDropdown isOpen={open} onClose={() => setOpen(false)} onApply={apply} /></header><button>Exterior</button></>;
}

it('portals filters outside the navbar and preserves the shared type and price', () => {
  const apply = vi.fn(); render(<Example apply={apply} />);
  const button = screen.getByRole('button', { name: 'Abrir filtros' }); button.focus(); fireEvent.click(button);
  const dialog = screen.getByRole('dialog');
  expect(dialog.closest('header')).toBeNull();
  fireEvent.click(screen.getByRole('combobox', { name: 'Sector' }));
  const option = screen.getByRole('option', { name: 'Zona oeste' });
  fireEvent.pointerDown(option); fireEvent.click(option);
  expect(screen.getByRole('dialog')).toBe(dialog);
  fireEvent.click(screen.getByRole('button', { name: 'Buscar propiedades' }));
  expect(apply).toHaveBeenCalledWith({ tipo_id: '7', precio_max: '1000000', sector: 'OESTE' });
});

it('closes with Escape and returns focus to the filter trigger', () => {
  render(<Example apply={vi.fn()} />);
  const button = screen.getByRole('button', { name: 'Abrir filtros' }); button.focus(); fireEvent.click(button);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull(); expect(document.activeElement).toBe(button);
});

it('first Escape closes only the nested options, second closes filters', () => {
  render(<Example apply={vi.fn()} />);
  const trigger = screen.getByRole('button', { name: 'Abrir filtros' }); trigger.focus(); fireEvent.click(trigger);
  const combo = screen.getByRole('combobox', { name: 'Sector' }); combo.focus(); fireEvent.click(combo);
  fireEvent.keyDown(combo, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull(); expect(screen.getByRole('dialog')).toBeTruthy();
  fireEvent.keyDown(combo, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull(); expect(document.activeElement).toBe(trigger);
});

it('closes on an outside pointer without expanding its parent', () => {
  render(<Example apply={vi.fn()} />);
  const button = screen.getByRole('button', { name: 'Abrir filtros' }); button.focus(); fireEvent.click(button);
  fireEvent.pointerDown(screen.getByRole('button', { name: 'Exterior' }));
  expect(screen.queryByRole('dialog')).toBeNull();
});
