import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, getEventById, getEvents, joinEvent, leaveEvent, updateEvent } from '../controllers/eventController.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getEvents);

router.get('/:id', getEventById);

router.post(
    "/",
    protect,
    uploadMiddleware,
    createEvent
);
router.put('/:id', protect, updateEvent);

router.delete('/:id', protect, deleteEvent);

router.post("/:eventId/join", protect, joinEvent);
router.post("/:eventId/leave", protect, leaveEvent);

export default router;