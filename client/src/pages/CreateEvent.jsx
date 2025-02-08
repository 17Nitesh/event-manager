import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const userId = localStorage.getItem("userId");

    // Redirect if user is not logged in
    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else if (e.target.name === "startDate" || e.target.name === "endDate") {
            setFormData({ ...formData, [e.target.name]: new Date(e.target.value).toISOString() });
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

    if (!userId) {
        return null; // Prevents rendering while redirecting
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
