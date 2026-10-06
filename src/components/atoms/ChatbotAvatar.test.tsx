/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChatbotAvatar } from './ChatbotAvatar';

describe('ChatbotAvatar', () => {
  it('renders correctly with default classes and accessibility attributes', () => {
    const { container } = render(<ChatbotAvatar className="w-8 h-8" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.classList.contains('inmo-chatbot-avatar')).toBe(true);

    const circle = svg?.querySelector('circle');
    expect(circle).toBeDefined();
    expect(circle?.classList.contains('fill-inmo-secondary')).toBe(true);
    expect(circle?.classList.contains('dark:fill-inmo-primary')).toBe(true);

    const rects = svg?.querySelectorAll('rect');
    expect(rects?.length).toBe(2);
    rects?.forEach(rect => {
      expect(rect.classList.contains('fill-inmo-primary')).toBe(true);
      expect(rect.classList.contains('dark:fill-inmo-secondary')).toBe(true);
    });
  });

  it('supports forced hover and idle states', () => {
    const { container: hoverContainer } = render(<ChatbotAvatar isHovered={true} />);
    expect(hoverContainer.querySelector('svg')?.classList.contains('is-forced-hover')).toBe(true);

    const { container: idleContainer } = render(<ChatbotAvatar isHovered={false} />);
    expect(idleContainer.querySelector('svg')?.classList.contains('is-forced-idle')).toBe(true);
  });

  it('supports thinking state', () => {
    const { container: thinkingContainer } = render(<ChatbotAvatar isThinking={true} />);
    expect(thinkingContainer.querySelector('svg')?.classList.contains('is-forced-hover')).toBe(true);
  });
});
