import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';
afterEach(cleanup);
const touch = (clientX = 0, clientY = 0) => ({ identifier: 1, clientX, clientY });
describe('touch icon actions', () => {
  it('activates one completed tap, focuses its button and suppresses a compatibility click', () => {
    const action = vi.fn();
    render(<IconButton aria-label="Cerrar detalle" onClick={action} />);
    const button = screen.getByRole('button');
    fireEvent.touchStart(button, { touches: [touch()] });
    expect(fireEvent.touchEnd(button, { touches: [], changedTouches: [touch()] })).toBe(false);
    expect(action).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(button);
  });
  it('does not activate while scrolling, pinching or cancelling a gesture', () => {
    const action = vi.fn();
    render(<IconButton aria-label="Cerrar detalle" onClick={action} />);
    const button = screen.getByRole('button');
    fireEvent.touchStart(button, { touches: [touch()] });
    fireEvent.touchMove(button, { touches: [touch(0, 40)] });
    fireEvent.touchEnd(button, { touches: [], changedTouches: [touch()] });
    fireEvent.touchStart(button, { touches: [touch(), { ...touch(), identifier: 2 }] });
    fireEvent.touchEnd(button, { touches: [], changedTouches: [touch()] });
    fireEvent.touchStart(button, { touches: [touch()] });
    fireEvent.touchCancel(button);
    fireEvent.touchEnd(button, { touches: [], changedTouches: [touch()] });
    expect(action).not.toHaveBeenCalled();
  });
  it('preserves disabled/loading protection and ordinary click activation', () => {
    const action = vi.fn();
    const { rerender } = render(<IconButton disabled aria-label="Cerrar detalle" onClick={action} />);
    const button = screen.getByRole('button');
    for (const props of [{ disabled: true }, { isLoading: true }]) {
      rerender(<IconButton {...props} aria-label="Cerrar detalle" onClick={action} />);
      fireEvent.touchStart(button, { touches: [touch()] });
      fireEvent.touchEnd(button, { touches: [], changedTouches: [touch()] });
    }
    expect(action).not.toHaveBeenCalled();
    rerender(<IconButton aria-label="Cerrar detalle" onClick={action} />);
    fireEvent.click(button);
    expect(action).toHaveBeenCalledTimes(1);
  });
});
