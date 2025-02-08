import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/events");
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);
    if (localStorage.getItem("token") === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                <h1 className="text-4xl font-bold text-gray-800 mt-10">Please login to view events</h1>
                <Link to="/login" className="mt-6 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition">
                    Login
                </Link>
            </div>
        );
    }

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading events...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mt-10">Upcoming Events</h1>

            <Link to="/events/new" className="mt-6 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition">
                + Create Event
            </Link>

            <div className="w-full max-w-6xl mt-8">
                {events.length === 0 ? (
                    <p className="text-center text-gray-600">No events available.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                        {events.map(event => (
                            <li key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 overflow-hidden">
                                    {event.image ? (
                                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h2>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        <span className="mr-3">📍 {event.location}</span>
                                        <span>🕒 {new Date(event.startDate).toLocaleDateString()}</span>
                                    </p>
                                    <Link to={`/events/${event._id}`} className="inline-block mt-2 text-teal-600 font-medium hover:underline">
                                        View Details →
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EventDashboard;
