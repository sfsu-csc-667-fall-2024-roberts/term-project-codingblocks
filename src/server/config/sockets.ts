import { Server } from "http";
import type { Express, RequestHandler } from "express";
import { Server as SocketIoServer, Socket } from "socket.io";

let io: SocketIoServer | undefined;

const bindSession = async (socket: Socket) => {
    const { request } = socket;

    const {
        user: { id: userId } = {},
        roomId,
        // @ts-expect-error
    } = request.session;

    socket.join(`user-${userId}`);
    socket.join(`chat-${roomId}`);
    socket.join(`game-${roomId}`);

    socket.use((_, next) => {
        // @ts-expect-error
        request.session.reload((error) => {
            if (error) {
                socket.disconnect();
            } else {
                next();
            }
        });
    });
};

export default function (
    server: Server,
    app: Express,
    sessionMiddleware: RequestHandler,
): SocketIoServer {
    if (io === undefined) {
        io = new SocketIoServer(server);

        app.set("io", io);
        io.engine.use(sessionMiddleware);

        io.on("connection", async (socket) => {
            await bindSession(socket);

            // @ts-expect-error
            console.log(`client connected (${socket.request.session.id})`);

            socket.on("disconnect", () => {
                console.log(
                    // @ts-expect-error
                    `client disconnected (${socket.request.session.id})`,
                );
            });
        });
    }

    return io;
}
