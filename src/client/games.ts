import { updateGame } from "./games/index";

const gameId = window.location.pathname.split("/").pop();

window.socket.on(`game:${gameId}:updated`, (game) => {
    updateGame(game);
});

// todo i dont want a form maybe?
document.addEventListener("DOMContentLoaded", () => {
    const actionForm = document.querySelector(".action-form");
    if (actionForm) {
        actionForm.addEventListener("submit", (async (e: Event) => {
            e.preventDefault();
            // so muchyhhh casttiiinnhngggt
            const submitEvent = e as SubmitEvent;
            const form = submitEvent.target as HTMLFormElement;
            const formData = new FormData(form);
            const submitter = submitEvent.submitter as HTMLButtonElement | null;
            const action = submitter?.value;
            const amount = formData.get("amount")
                ? Number(formData.get("amount"))
                : 0;

            console.log({
                action,
                amount,
                submitter,
            });

            try {
                const response = await fetch(`/games/${gameId}/action`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action,
                        amount,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Action failed");
                }

                const result = await response.json();
                if (result.redirect) {
                    window.location.href = result.redirect;
                }
            } catch (error) {
                console.error("Error:", error);
                if (error instanceof Error) {
                    alert(error.message);
                }
            }
        }) as EventListener);
    }
});
