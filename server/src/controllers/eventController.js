import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.model.js";

export const createEvent = async (req, res) => {
    try {
        const { name, location, description, category, startDate, endDate } = req.body;
        const createdBy = req.user._id;

        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const newEvent = await Event.create({
            name,
            location,
            description,
            category,
            startDate,
            endDate,
            createdBy,
            image: imageUrl
        });

        res.status(201).json(newEvent);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
};
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "name email");

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        Object.assign(event, req.body);
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await event.deleteOne();
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};


export const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.atendees.includes(userId)) {
            return res.status(400).json({ message: 'User already joined the event' });
        }

        event.atendees.push(userId);
        await event.save();

        res.status(200).json({ message: 'Successfully joined the event', event });
    } catch (error) {
        res.status(500).json({ message: 'Error joining the event', error });
    }
};

export const leaveEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.atendees.includes(userId)) {
            return res.status(400).json({ message: 'User has not joined this event' });
        }

        event.atendees = event.atendees.filter(attendee => attendee.toString() !== userId.toString());
        await event.save();

        res.status(200).json({ message: 'Successfully left the event', event });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving the event', error });
    }
};
