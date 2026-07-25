import { Router } from 'express';
import { createLead, getLeads, updateLeadStatus } from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createLead);
router.get('/', protect, getLeads);
router.patch('/:id', protect, updateLeadStatus);

export default router;
