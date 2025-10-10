import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum function', () => {
  it('should return the correct sum of two numbers', () => {
    // Arrange: Define inputs
    const a = 5;
    const b = 10;

    // Act: Call the function
    const result = sum(a, b);

    // Assert: Check if the result is what you expect
    expect(result).toBe(15);
  });
});