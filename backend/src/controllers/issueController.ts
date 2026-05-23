import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Issue from '../models/Issue';

// Get all issues with pagination and filtering
export const getIssues = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = { createdBy: req.user!._id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email');

    const total = await Issue.countDocuments(filter);

    // Get counts by status
    const statusCounts = await Issue.aggregate([
      { $match: { createdBy: req.user!._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {
      Open: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0
    };
    
    statusCounts.forEach(item => {
      counts[item._id as keyof typeof counts] = item.count;
    });

    res.json({
      success: true,
      data: issues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      counts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single issue
export const getIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      createdBy: req.user!._id
    }).populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create issue
export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issue = await Issue.create({
      ...req.body,
      createdBy: req.user!._id
    });

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update issue
export const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    let issue = await Issue.findOne({
      _id: req.params.id,
      createdBy: req.user!._id
    });

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete issue
export const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      createdBy: req.user!._id
    });

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await issue.deleteOne();

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};