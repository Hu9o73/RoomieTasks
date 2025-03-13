export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'completed';
    recurring: 'one-time' | 'daily' | 'weekly' | 'monthly';
    householdId: number;
    createdBy: number;
    assignedTo: number;
    createdAt?: Date;
    updatedAt?: Date;
    household?: {
      id: number;
      name: string;
    };
    creator?: {
      id: number;
      firstName: string;
      lastName: string;
      nickname?: string;
    };
    assignee?: {
      id: number;
      firstName: string;
      lastName: string;
      nickname?: string;
    };
  }