import express from 'express';
import Joi from 'joi';
import Task from '../models/Task';
import Project from '../models/Project';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

const taskSchema = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().allow(''),
  status: Joi.string().valid('Todo', 'In-Progress', 'Completed'),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
  dueDate: Joi.date().allow(null, ''),
  assignee: Joi.string().allow(null, ''),
  projectId: Joi.string().required()
});

// Get tasks for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query;
    let query: any = {};

    if (projectId) {
      query.project = projectId;
    } else {
      const projects = await Project.find({
        $or: [{ owner: req.user.id }, { members: req.user.id }]
      });
      const projectIds = projects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status, priority, dueDate, assignee, projectId } = req.body;
    
    // Verify project access
    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      assignee: assignee || null,
      project: projectId
    });

    await task.save();
    const populatedTask = await task.populate('assignee project', 'name email avatar');
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to initialize task' });
  }
});

// Update task
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Verify project access
    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied: You do not have permission to update this task' });
    }

    const updates = req.body;
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee'];
    
    allowedUpdates.forEach(update => {
      if (updates[update] !== undefined) {
        (task as any)[update] = updates[update];
      }
    });

    await task.save();
    const populatedTask = await task.populate('assignee project', 'name email avatar');
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;
