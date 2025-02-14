import { User, Task, DashboardStats, Alarm } from '../types/models';

export const mockAlarms: Alarm[] = [
  {
    call_id: "987654321",
    caller_number: "+1234567890",
    called_number: "+0987654321",
    start_time: "2025-02-14T10:00:00Z",
    end_time: "2025-02-14T10:15:00Z",
    duration_seconds: 900,
    call_type: "Internazionale",
    carrier: "CarrierX",
    charge_amount: 3.50,
    call_status: "Completata"
  },
  {
    call_id: "987654322",
    caller_number: "+1234567891",
    called_number: "+0987654322",
    start_time: "2025-02-14T09:00:00Z",
    end_time: "2025-02-14T09:10:00Z",
    duration_seconds: 600,
    call_type: "Nazionale",
    carrier: "CarrierY",
    charge_amount: 1.50,
    call_status: "Completata"
  },
  {
    call_id: "987654323",
    caller_number: "+1234567892",
    called_number: "+0987654323",
    start_time: "2025-02-14T08:00:00Z",
    end_time: "2025-02-14T08:05:00Z",
    duration_seconds: 300,
    call_type: "Locale",
    carrier: "CarrierZ",
    charge_amount: 0.50,
    call_status: "Fallita"
  }
];


export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/2.jpg'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/3.jpg'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/4.jpg'
  },
  {
    id: 5,
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/5.jpg'
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/6.jpg'
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'robert@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/1.jpg'
  },
  {
    id: 8,
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/2.jpg'
  },
  {
    id: 9,
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/3.jpg'
  },
  {
    id: 10,
    name: 'Patricia Martin',
    email: 'patricia@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/4.jpg'
  },
  {
    id: 11,
    name: 'Michael Lee',
    email: 'michael@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/5.jpg'
  },
  {
    id: 12,
    name: 'Jennifer White',
    email: 'jennifer@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/6.jpg'
  },
  {
    id: 13,
    name: 'David Miller',
    email: 'david@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/1.jpg'
  },
  {
    id: 14,
    name: 'Elizabeth Clark',
    email: 'elizabeth@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/2.jpg'
  },
  {
    id: 15,
    name: 'Kevin Rodriguez',
    email: 'kevin@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/3.jpg'
  },
  {
    id: 16,
    name: 'Maria Garcia',
    email: 'maria@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/4.jpg'
  },
  {
    id: 17,
    name: 'Steven Moore',
    email: 'steven@example.com',
    role: 'User',
    avatar: '/src/assets/images/avatar/5.jpg'
  },
  {
    id: 18,
    name: 'Laura Taylor',
    email: 'laura@example.com',
    role: 'Admin',
    avatar: '/src/assets/images/avatar/6.jpg'
  }
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Complete Project',
    description: 'Finish the React project implementation',
    status: 'pending',
    userId: 1
  },
  {
    id: 2,
    title: 'Review Code',
    description: 'Review pull requests',
    status: 'completed',
    userId: 2
  }
];

// Function to calculate dynamic dashboard stats
export const getDashboardStats = (): DashboardStats => {
  return {
    revenue: mockUsers.length * 1000,
    sales: mockUsers.length * 2,
    templates: mockUsers.length,
    totalUsers: mockUsers.length
  };
};

export const alarmOptions = {
  callTypes: [
    { value: 'Internazionale', label: 'Internazionale' },
    { value: 'Nazionale', label: 'Nazionale' },
    { value: 'Locale', label: 'Locale' }
  ],
  carriers: [
    { value: 'CarrierX', label: 'CarrierX' },
    { value: 'CarrierY', label: 'CarrierY' },
    { value: 'CarrierZ', label: 'CarrierZ' }
  ],
  statuses: [
    { value: 'Completata', label: 'Completata' },
    { value: 'Fallita', label: 'Fallita' }
  ]
};
