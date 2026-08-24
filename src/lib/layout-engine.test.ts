import { describe, it, expect } from 'vitest';
import { generateLayout } from './layout-engine';

describe('Auto-Layout Engine', () => {
  it('should assign Scientific template to Science category content', () => {
    const layout = generateLayout('Abstract: Methodological analysis of quantum biology.', 'Science');
    expect(layout.template).toBe('Scientific');
    expect(layout.columnCount).toBe(2);
  });

  it('should assign Interview template when interview Q&A format is detected', () => {
    const layout = generateLayout('Q: What inspired this breakthrough? Interviewer: Let us discuss.');
    expect(layout.template).toBe('Interview');
    expect(layout.quoteStyle).toBe('callout');
  });

  it('should assign Feature template for long-form content', () => {
    const longText = 'word '.repeat(1200);
    const layout = generateLayout(longText, 'Technology');
    expect(layout.template).toBe('Feature');
    expect(layout.enableDropCap).toBe(true);
  });

  it('should default to Standard layout for short generic articles', () => {
    const layout = generateLayout('A brief notice on upcoming astronomical observations.');
    expect(layout.template).toBe('Standard');
    expect(layout.columnCount).toBe(1);
  });
});
