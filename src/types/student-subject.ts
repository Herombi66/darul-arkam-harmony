export type SubjectStatus = 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'all';

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher: string;
  progress: number;
  grade: string;
  lastTest: string;
  nextClass: string;
  assignments: number;
  status: SubjectStatus;
}

export type SortField = 'name' | 'progress' | 'grade';
export type SortOrder = 'asc' | 'desc';

export interface SubjectFilters {
  search: string;
  status: SubjectStatus;
}
