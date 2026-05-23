export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  severity?: 'Minor' | 'Major' | 'Critical';
  assignedTo?: User;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface IssuesResponse {
  success: boolean;
  data: Issue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  counts: {
    Open: number;
    'In Progress': number;
    Resolved: number;
    Closed: number;
  };
}

export interface ApiError {
  message: string;
  errors?: any[];
}