import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userId");
        if (token) {
            navigate("/events");
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 px-6">
            <div className="max-w-3xl text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
                    Manage Your Events Seamlessly
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Create, manage, and join events with real-time updates. Organize meetups, webinars, and more with ease.
                </p>

                <div className="mt-8 space-x-4">
                    <Link
                        to="/register"
                        className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition-all"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-3 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-100 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>

            <div className="mt-12">
                <img
                    src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Event Management"
                    className="rounded-lg shadow-lg sm:h-[40vh] md:max-w-lg"
                />
            </div>
        </div>
    );
};

export default Home;
