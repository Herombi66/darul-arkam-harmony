import { useState, useEffect, useMemo, useCallback } from 'react';
import { Subject, SubjectStatus, SubjectFilters, SortField, SortOrder } from '@/types/student-subject';
import { useAuth } from '@/contexts/AuthContext';

export function useStudentSubjects() {
  const { token } = useAuth();
  const [data, setData] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [filters, setFilters] = useState<SubjectFilters>({ search: '', status: 'all' });
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({ field: 'name', order: 'asc' });

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await fetch(`${backendUrl}/api/student/subjects`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch subjects: ${res.statusText}`);
      }

      const json = await res.json();
      // Ensure we handle the { data: [...] } structure from Laravel
      const subjects = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      setData(subjects);
    } catch (err) {
      console.error(err);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived State: Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return data.filter(subject => {
      const matchesSearch = 
        subject.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        subject.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        subject.teacher.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || subject.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const field = sortConfig.field;
      const order = sortConfig.order === 'asc' ? 1 : -1;

      if (field === 'name') {
        return a.name.localeCompare(b.name) * order;
      }
      if (field === 'progress') {
        return (a.progress - b.progress) * order;
      }
      if (field === 'grade') {
        // Simple grade comparison (A > B > C...)
        return a.grade.localeCompare(b.grade) * order; 
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Statistics
  const stats = useMemo(() => {
    if (data.length === 0) return { average: 0, totalSubjects: 0, excellentCount: 0, pendingAssignments: 0 };
    
    const totalProgress = data.reduce((acc, curr) => acc + curr.progress, 0);
    const excellent = data.filter(s => s.status === 'excellent').length;
    const assignments = data.reduce((acc, curr) => acc + curr.assignments, 0);

    return {
      average: Math.round(totalProgress / data.length),
      totalSubjects: data.length,
      excellentCount: excellent,
      pendingAssignments: assignments
    };
  }, [data]);

  return {
    subjects: paginatedData,
    allSubjects: data, // Exposed if needed for raw access
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    pagination: {
      page,
      setPage,
      totalPages,
      totalItems: sortedData.length
    },
    refresh: fetchData
  };
}
