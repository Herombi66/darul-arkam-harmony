import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import StudentSubjects from './StudentSubjects';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock DashboardSidebar to avoid Router/Auth context issues
vi.mock('@/components/DashboardSidebar', () => ({
  default: () => <div data-testid="dashboard-sidebar">Sidebar</div>
}));

// Mock the hook to control data state
vi.mock('@/hooks/use-student-subjects', () => ({
  useStudentSubjects: () => ({
    subjects: [
      {
        id: 1,
        name: 'Mathematics',
        code: 'MTH201',
        teacher: 'Mr. Ibrahim',
        progress: 85,
        grade: 'A',
        lastTest: '92%',
        nextClass: 'Tomorrow 8:00 AM',
        assignments: 2,
        status: 'excellent'
      },
      {
        id: 2,
        name: 'Physics',
        code: 'PHY201',
        teacher: 'Mrs. Fatima',
        progress: 65,
        grade: 'C',
        lastTest: '60%',
        nextClass: 'Monday 10:00 AM',
        assignments: 0,
        status: 'satisfactory'
      }
    ],
    allSubjects: [], // simplified for mock
    isLoading: false,
    error: null,
    stats: {
      average: 75,
      totalSubjects: 2,
      excellentCount: 1,
      pendingAssignments: 2
    },
    filters: { search: '', status: 'all' },
    setFilters: vi.fn(),
    sortConfig: { field: 'name', order: 'asc' },
    setSortConfig: vi.fn(),
    pagination: {
      page: 1,
      setPage: vi.fn(),
      totalPages: 1,
      totalItems: 2
    },
    refresh: vi.fn()
  })
}));

describe('StudentSubjects Component', () => {
  it('renders page title and stats', () => {
    render(<StudentSubjects />);
    
    expect(screen.getByText('My Subjects')).toBeInTheDocument();
    expect(screen.getByText('2 Enrolled')).toBeInTheDocument();
    
    // Check Stats
    expect(screen.getByText('Overall Average')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Total Subjects')).toBeInTheDocument();
  });

  it('renders subject cards', () => {
    render(<StudentSubjects />);
    
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('MTH201')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();
  });

  it('opens details dialog when "View Details" is clicked', async () => {
    const user = userEvent.setup();
    render(<StudentSubjects />);
    
    const viewButtons = screen.getAllByText('View Details');
    await user.click(viewButtons[0]);

    // Check if dialog content appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Instructor')).toBeInTheDocument();
    // Use within to find text inside the dialog, as it also exists on the card behind the dialog
    expect(within(dialog).getByText('Mr. Ibrahim')).toBeInTheDocument();
  });

  it('renders search and filter controls', () => {
    render(<StudentSubjects />);
    
    expect(screen.getByPlaceholderText('Search subjects...')).toBeInTheDocument();
    // Since initial state has values, placeholders are replaced by selected values
    expect(screen.getByText('All Status')).toBeInTheDocument(); 
    expect(screen.getByText('Name')).toBeInTheDocument(); 
  });
});
