import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGraceGuard } from '../lib/sync-guard.js';

describe('createGraceGuard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts clean (not dirty)', () => {
    const guard = createGraceGuard(4000);
    expect(guard.isDirty()).toBe(false);
  });

  it('is dirty immediately after markDirty()', () => {
    const guard = createGraceGuard(4000);
    guard.markDirty();
    expect(guard.isDirty()).toBe(true);
  });

  it('stays dirty until the grace window elapses', () => {
    const guard = createGraceGuard(4000);
    guard.markDirty();
    vi.advanceTimersByTime(3999);
    expect(guard.isDirty()).toBe(true);
  });

  it('is no longer dirty once the grace window elapses', () => {
    const guard = createGraceGuard(4000);
    guard.markDirty();
    vi.advanceTimersByTime(4001);
    expect(guard.isDirty()).toBe(false);
  });

  it('clear() ends the dirty window immediately, even mid-window', () => {
    const guard = createGraceGuard(4000);
    guard.markDirty();
    vi.advanceTimersByTime(1000);
    guard.clear();
    expect(guard.isDirty()).toBe(false);
  });

  it('independent guard instances do not share state', () => {
    const a = createGraceGuard(4000);
    const b = createGraceGuard(4000);
    a.markDirty();
    expect(a.isDirty()).toBe(true);
    expect(b.isDirty()).toBe(false);
  });
});
