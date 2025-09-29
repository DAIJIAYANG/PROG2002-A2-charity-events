import { Router } from 'express';
import { listEvents, showEvent } from '../controllers/eventsController.js';

const router = Router();

// GET /api/events -> list events (supports filters)
router.get('/', listEvents);

// GET /api/events/:id -> single event by id
router.get('/:id', showEvent);

export default router;
