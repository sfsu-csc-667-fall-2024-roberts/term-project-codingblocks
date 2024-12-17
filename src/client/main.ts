import { io, Socket } from "socket.io-client";

declare global {
    interface Window {
        socket: Socket;
        roomId: number;
    }
}

// declare module "express-session" {
//   interface SessionData {
//     user: {
//       id: number;
//       username: string;
//       email: string;
//       gravatar: string;
//     };
//     roomId: number;
//   }
// }

window.socket = io();
