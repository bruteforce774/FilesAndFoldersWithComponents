import { describe, it, expect } from 'vitest';

// Simple helper function to test
function isFile(item: { content?: string }) {
  return item.content !== undefined;
}

describe('Helper Functions', () => {
  it('should identify a file by presence of content property', () => {
    const file = { id: 1, name: 'test.txt', content: 'hello' }
    expect(isFile(file)).toBe(true);
  })

  it ('should identify a folder by absence of content property', () => {
    const folder = { id: 2, name: 'MyFolder' }
    expect(isFile(folder)).toBe(false);
  })
})
