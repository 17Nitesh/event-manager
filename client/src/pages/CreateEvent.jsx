import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Conference",
        location: "",
        startDate: "",
        endDate: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else if (e.target.name === "startDate" || e.target.name === "endDate") {
            // Convert the datetime-local value to ISO format
            const date = new Date(e.target.value);
            setFormData({ ...formData, [e.target.name]: date.toISOString() });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post("https://event-manager-gi76.onrender.com/api/events", formDataToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            navigate("/events");
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
            <h2 className="text-3xl font-bold text-gray-800">Create New Event</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6 w-full max-w-lg">
                <input type="text" name="name" placeholder="Event Name" onChange={handleChange} className="w-full p-2 border rounded my-2" required />
                <textarea name="description" placeholder="Event Description" onChange={handleChange} className="w-full p-2 border rounded my-2" required></textarea>
                <input type="text" name="location" placeholder="Event Location" onChange={handleChange} className="w-full p-2 border rounded my-2" required />
                <input type="datetime-local" name="startDate" onChange={handleChange} className="w-full p-2 border rounded my-2" required />
                <input type="datetime-local" name="endDate" onChange={handleChange} className="w-full p-2 border rounded my-2" required />
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded my-2" required />

                <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded mt-4 hover:bg-teal-700" disabled={loading}>
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
