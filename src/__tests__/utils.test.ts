import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', { b: true, c: false })).toBe('a b');
    expect(cn('p-4', 'p-2')).toBe('p-2'); // tailwind-merge in action
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });
});
