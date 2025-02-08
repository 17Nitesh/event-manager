import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { MapPin, Calendar, Users, Trash } from "lucide-react";

const EventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [isJoined, setIsJoined] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchEvent = async () => {
        try {
            const { data } = await axios.get(`https://event-manager-gi76.onrender.com/api/events/${id}`);
            console.log("Fetched event data:", data);
            setEvent(data);
            setAttendeeCount(data.atendees.length);
            setIsJoined(data.atendees.some(attendee => attendee.toString() === userId));
            setIsOwner(data.createdBy._id === userId);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    useEffect(() => {
        if (!token) return;

        // Initial fetch
        fetchEvent();

        // Socket event handler
        const handleAttendeeUpdate = (data) => {
            console.log("Received socket update:", data);
            fetchEvent(); // Refetch entire event data when count updates
        };

        // Set up socket listener
        socket.on("update_attendee_count", handleAttendeeUpdate);

        return () => {
            socket.off("update_attendee_count", handleAttendeeUpdate);
        };
    }, [id, userId, token]);

    const handleJoinLeave = async () => {
        if (!token) {
            alert("Please log in to join this event.");
            return;
        }

        try {
            if (isJoined) {
                console.log("Attempting to leave event");
                await axios.post(`https://event-manager-gi76.onrender.com/api/events/${id}/leave`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Successfully left event");
                socket.emit("leave_event", { eventId: id, userId });
            } else {
                console.log("Attempting to join event");
                await axios.post(`https://event-manager-gi76.onrender.com/api/events/${id}/join`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Successfully joined event");
                socket.emit("join_event", { eventId: id, userId });
            }

            // Wait briefly then fetch updated data
            setTimeout(fetchEvent, 100);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await axios.delete(`https://event-manager-gi76.onrender.com/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Event deleted successfully!");
            navigate("/events");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    if (!token) {
        return <p>Please <Link to="/login" className="text-blue-500">log in</Link> to view this event.</p>;
    }

    if (!event) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-md rounded-lg">
            <img src={event.image} alt={event.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <div className="flex items-center gap-4 mt-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{new Date(event.startDate).toLocaleString()}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-blue-600 font-medium">
                <Users size={20} />
                <span>Live Attendees: {attendeeCount}</span>
            </div>

            {isOwner ? (
                <div className="mt-6 flex gap-4">

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2"
                    >
                        <Trash size={18} /> Delete Event
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleJoinLeave}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    {isJoined ? "Leave Event" : "Join Event"}
                </button>
            )}
        </div>
    );
};

export default EventPage;
