import { renderHook, act, waitFor } from '@testing-library/react';
import { useStudentSubjects } from './use-student-subjects';
import { describe, it, expect, vi } from 'vitest';

describe('useStudentSubjects', () => {
  it('should return initial state', async () => {
    const { result } = renderHook(() => useStudentSubjects());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.subjects).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subjects.length).toBeGreaterThan(0);
    expect(result.current.allSubjects.length).toBeGreaterThan(0);
  });

  it('should filter subjects by search term', async () => {
    const { result } = renderHook(() => useStudentSubjects());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setFilters({ ...result.current.filters, search: 'Math' });
    });

    // Should find Mathematics
    expect(result.current.subjects.length).toBeGreaterThan(0);
    expect(result.current.subjects[0].name).toContain('Math');
  });

  it('should filter subjects by status', async () => {
    const { result } = renderHook(() => useStudentSubjects());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setFilters({ ...result.current.filters, status: 'excellent' });
    });

    result.current.subjects.forEach(subject => {
      expect(subject.status).toBe('excellent');
    });
  });

  it('should sort subjects', async () => {
    const { result } = renderHook(() => useStudentSubjects());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSortConfig({ field: 'progress', order: 'desc' });
    });

    const progressValues = result.current.subjects.map(s => s.progress);
    const sortedProgress = [...progressValues].sort((a, b) => b - a);
    
    expect(progressValues).toEqual(sortedProgress);
  });

  it('should calculate statistics correctly', async () => {
    const { result } = renderHook(() => useStudentSubjects());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const { stats, allSubjects } = result.current;
    
    expect(stats.totalSubjects).toBe(allSubjects.length);
    
    const excellentCount = allSubjects.filter(s => s.status === 'excellent').length;
    expect(stats.excellentCount).toBe(excellentCount);
  });
});
