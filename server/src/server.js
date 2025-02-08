import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import Event from "./models/Event.model.js";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://event-manager-pied-theta.vercel.app",
    },
});

// Live Attendee Counts
const attendeeCounts = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Update attendee count and notify clients
    const updateAttendees = async (eventId) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                console.error(`Event ${eventId} not found.`);
                return;
            }
            attendeeCounts[eventId] = event.atendees.length;
            io.to(eventId).emit("update_attendee_count", { eventId, count: attendeeCounts[eventId] });
            console.log(`Updated attendee count for ${eventId}: ${attendeeCounts[eventId]}`);
        } catch (error) {
            console.error("Error updating attendees:", error);
        }
    };

    // Join Event
    socket.on("join_event", async ({ eventId, userId }) => {
        console.log(`User ${userId} attempting to join event ${eventId}`);

        if (!mongoose.Types.ObjectId.isValid(eventId) || !userId) {
            console.error("Invalid eventId or userId.");
            return;
        }

        const event = await Event.findById(eventId);
        if (!event) {
            console.error(`Event ${eventId} not found.`);
            return;
        }

        if (!event.atendees.includes(userId)) {
            event.atendees.push(userId);
            await event.save();
        }

        socket.join(eventId);
        await updateAttendees(eventId);
        console.log(`User ${userId} joined event ${eventId}`);
    });

    // Leave Event
    socket.on("leave_event", async ({ eventId, userId }) => {
        console.log(`User ${userId} attempting to leave event ${eventId}`);

        if (!mongoose.Types.ObjectId.isValid(eventId) || !userId) {
            console.error("Invalid eventId or userId.");
            return;
        }

        const event = await Event.findById(eventId);
        if (!event) {
            console.error(`Event ${eventId} not found.`);
            return;
        }

        event.atendees = event.atendees.filter(id => id.toString() !== userId.toString());
        await event.save();

        socket.leave(eventId);
        await updateAttendees(eventId);

        console.log(`User ${userId} left event ${eventId}`);
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
