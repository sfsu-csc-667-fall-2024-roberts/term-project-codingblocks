import express from "express";

const router = express.Router();

router.post("/:roomId", (request, response) => {
    const { roomId } = request.params;
    const { message } = request.body;

    // @ts-expect-error TODO: Define the session type for the user object
    const { email, gravatar } = request.session.user;

    request.app.get("io").to(`game-${roomId}`).emit(`message:${roomId}`, {
        message,
        gravatar,
        sender: email,
        timestamp: new Date(),
    });

    response.status(200).send();
});

export default router;
