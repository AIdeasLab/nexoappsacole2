export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  laborValue: number;
}

export interface AIdeasLabTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}