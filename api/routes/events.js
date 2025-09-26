import { Router } from 'express';
import { listEvents, showEvent } from '../controllers/eventsController.js';

const router = Router();

// GET /api/events
router.get('/', listEvents);

// GET /api/events/:id
router.get('/:id', showEvent);

export default router;
