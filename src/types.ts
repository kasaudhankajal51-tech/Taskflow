import React from 'react';

export type Screen = 'dashboard' | 'projects' | 'tasks' | 'team' | 'profile' | 'login';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatar?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In-Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignee?: User;
  project: Project | string;
  createdAt: string;
}
