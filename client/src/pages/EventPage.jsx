import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { MapPin, Calendar, Users } from "lucide-react";

const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [isJoined, setIsJoined] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(data);
                setAttendeeCount(data.attendees.length);
                setIsJoined(data.attendees.includes(userId));
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
        socket.emit("joinEvent", { eventId: id, userId });

        socket.on("attendeeUpdate", ({ eventId, count }) => {
            if (eventId === id) setAttendeeCount(count);
        });

        return () => {
            socket.emit("leaveEvent", { eventId: id, userId });
            socket.off("attendeeUpdate");
        };
    }, [id, userId]);

    const handleJoinLeave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (isJoined) {
                await axios.post(`http://localhost:5000/api/events/${id}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
                socket.emit("leaveEvent", { eventId: id, userId });
                setIsJoined(false);
            } else {
                await axios.post(`http://localhost:5000/api/events/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
                socket.emit("joinEvent", { eventId: id, userId });
                setIsJoined(true);
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-md rounded-lg">
            <img src={event.image} alt={event.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <div className="flex items-center gap-4 mt-4 text-gray-500">
                <div className="flex items-center gap-2"><MapPin size={18} /><span>{event.location}</span></div>
                <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(event.startDate).toLocaleString()}</span></div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-blue-600 font-medium">
                <Users size={20} /><span>Live Attendees: {attendeeCount}</span>
            </div>
            <button onClick={handleJoinLeave} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">{isJoined ? "Leave Event" : "Join Event"}</button>
        </div>
    );
};

export default EventPage;
