import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DropdownSelect } from './DropdownSelect';

afterEach(cleanup);
const options = [{ value: '', label: 'Todos' }, { value: 'NORTE', label: 'Norte', disabled: true }, { value: 'SUR', label: 'Sur' }, { value: 'OESTE', label: 'Oeste' }];

it('navigates enabled options with keyboard and selects without moving focus', () => {
  const change = vi.fn(); render(<DropdownSelect label="Sector" value="" options={options} onChange={change} />);
  const combo = screen.getByRole('combobox'); combo.focus();
  fireEvent.keyDown(combo, { key: 'ArrowDown' });
  fireEvent.keyDown(combo, { key: 'ArrowDown' });
  expect(combo.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Sur' }).id);
  fireEvent.keyDown(combo, { key: 'Enter' });
  expect(change).toHaveBeenCalledWith('SUR');
  expect(screen.queryByRole('listbox')).toBeNull(); expect(document.activeElement).toBe(combo);
});

it('supports typeahead and Escape without committing a selection', () => {
  const change = vi.fn(); render(<DropdownSelect label="Sector" value="SUR" options={options} onChange={change} />);
  const combo = screen.getByRole('combobox'); combo.focus(); fireEvent.keyDown(combo, { key: 'o' });
  expect(combo.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Oeste' }).id);
  fireEvent.keyDown(combo, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull(); expect(change).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(combo);
});

it('closes on outside pointer and Tab; disabled choices cannot be selected', () => {
  const change = vi.fn(); render(<><DropdownSelect label="Sector" value="" options={options} onChange={change} /><button>Exterior</button></>);
  const combo = screen.getByRole('combobox'); fireEvent.click(combo);
  fireEvent.click(screen.getByRole('option', { name: 'Norte' })); expect(change).not.toHaveBeenCalled();
  fireEvent.pointerDown(screen.getByRole('button', { name: 'Exterior' })); expect(screen.queryByRole('listbox')).toBeNull();
  fireEvent.click(combo); fireEvent.keyDown(combo, { key: 'Tab' }); expect(screen.queryByRole('listbox')).toBeNull();
});
