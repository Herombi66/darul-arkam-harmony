export interface AdmissionStats {
  totalInquiries: number;
  pendingApplications: number;
  admissionRate: number;
  seatsFilled: number;
  totalSeats: number;
}

export interface FunnelData {
  name: string;
  value: number;
}

export interface ApplicationsByGrade {
  name: string;
  value: number;
}

export interface RecentApplication {
  id: string;
  studentName: string;
  grade: string;
  status: 'Pending' | 'Under Review' | 'Admitted' | 'Rejected';
  dateApplied: string;
}