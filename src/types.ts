import React from 'react';

export type Screen = 'dashboard' | 'projects' | 'tasks' | 'team' | 'profile' | 'login';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Planning';
  tasksCompleted: number;
  totalTasks: number;
  members: User[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  assignees: User[];
  isOverdue?: boolean;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@taskflow.com',
    role: 'Admin',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQW6hw69iSe-tlJnvjnK3B4-vbsZvcYlhAp2TvQjTYSjeUAC7a6B6-y8QXZ6F0q3A9LebhVcldRl04AQNCwcfIlxpxY0wZzWS4iMBGj_9WWn_DUk_g4OJxeDXW_FgT7xMutKc-3BegTZRoM38jDHqPlLEGIrF07sjWP-O1PSqGlEnl-tD9OwECJp4HMwxOKyMugq6E0h-cf1NtzJnIXiQ1Ys6wq1l69y07-OHqLYyVb890t18onqV3rnmZgqGubu6a18vrvnnw2g',
  },
  {
    id: '2',
    name: 'Marcus Kim',
    email: 'marcus.k@taskflow.com',
    role: 'Member',
    avatar: '', // Initial avatar
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david.c@taskflow.com',
    role: 'Member',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxhs_czmGEgBgQIahxKRCfF98EAH-gCR7-1FgKWIN3zne1nnlwOkya_nntJaEBVeoqCewqNmSZEUn3MYGwwpajEIicDHvWSzcuF_WYFXat9HzFsfd5NHFuPM7GBJPJhbR-g_yMoeutuOB04QUizSbtqedJNuBPdxOxBclvIm087vJDoK6p_Ign_Kly0PCfvxRk_3T_cUPUVj0sHmHEBFEqVfVOk1vvxo76esX77Lwn9iak46WjUuuw2Z5ju_PQbP5dn40X7mFchQ',
  },
  {
    id: '4',
    name: 'Elena Rodriguez',
    email: 'elena.r@taskflow.com',
    role: 'Member',
    avatar: '',
  },
];

export const CURRENT_USER: User = MOCK_USERS[0];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Q3 Customer Portal Revamp',
    description: 'Redesigning the main customer dashboard to improve self-service capabilities and reduce support ticket volume by 15%.',
    status: 'On Track',
    tasksCompleted: 24,
    totalTasks: 36,
    members: MOCK_USERS.slice(0, 3),
  },
  {
    id: 'p2',
    title: 'Infrastructure Migration',
    description: 'Migrating core databases from legacy on-premise servers to AWS cloud infrastructure to improve scalability.',
    status: 'At Risk',
    tasksCompleted: 12,
    totalTasks: 85,
    members: [MOCK_USERS[0], MOCK_USERS[2]],
  },
  {
    id: 'p3',
    title: 'Mobile App V2.5 Release',
    description: 'Scoping requirements and designing new features for the upcoming minor release of the iOS and Android applications.',
    status: 'Planning',
    tasksCompleted: 0,
    totalTasks: 15,
    members: [MOCK_USERS[1]],
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design System Audit & Review',
    description: 'Review current components against new brand guidelines and document required updates.',
    status: 'To Do',
    dueDate: 'Oct 24',
    assignees: [MOCK_USERS[1]],
  },
  {
    id: 't2',
    title: 'Prepare Q3 Performance Report',
    description: 'Collate metrics for the quarterly board meeting.',
    status: 'To Do',
    dueDate: 'Yesterday',
    assignees: [MOCK_USERS[0], MOCK_USERS[2]],
    isOverdue: true,
  },
  {
    id: 't3',
    title: 'Implement User Authentication Flow',
    description: 'Integrate SSO and update login forms to match the new minimal UI.',
    status: 'In Progress',
    dueDate: 'Oct 26',
    assignees: [MOCK_USERS[3]],
  },
  {
    id: 't4',
    title: 'Draft Marketing Copy for Landing Page',
    description: 'Write copy for the new homepage.',
    status: 'Done',
    dueDate: 'Oct 20',
    assignees: [MOCK_USERS[0]],
  },
];
