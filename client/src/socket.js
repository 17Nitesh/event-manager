import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Change this when deployed

export default socket;
