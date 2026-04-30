import express from 'express';
import Joi from 'joi';
import Project from '../models/Project';
import Task from '../models/Task';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

const projectSchema = Joi.object({
  name: Joi.string().required().min(3),
  description: Joi.string().allow(''),
  members: Joi.array().items(Joi.string())
});

// Get all projects for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).populate('owner members', 'name email avatar role');
    res.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Create project (Admin only)
router.post('/', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { error } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, description, members } = req.body;
    
    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: members || []
    });
    
    await project.save();
    
    const populatedProject = await project.populate('owner members', 'name email avatar role');
    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to initialize project stream' });
  }
});

// Update project (Admin only)
router.patch('/:id', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
       return res.status(403).json({ message: 'Access denied' });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (members) project.members = members;

    await project.save();
    const populatedProject = await project.populate('owner members', 'name email avatar role');
    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete project (Admin only)
router.delete('/:id', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project owner can delete this stream' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    await Project.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Project stream and associated tasks terminated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
