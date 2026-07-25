import type { Request, Response } from 'express';
import Lead from '../models/Lead.js';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  budgetRange: z.string().min(1, "Budget range is required"),
  message: z.string().min(1, "Message is required"),
});

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    const lead = new Lead(validatedData);
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: (error as any).errors });
    } else {
      console.error("Error creating lead:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      };
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['New', 'Contacted', 'Closed'].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
    
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }
    
    res.status(200).json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
