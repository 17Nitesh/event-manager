import { io } from "socket.io-client";

const socket = io("https://event-manager-gi76.onrender.com"); // ✅ Change this when deployed

export default socket;
