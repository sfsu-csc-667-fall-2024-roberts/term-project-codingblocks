import { updateGame } from "./games/index";

const gameId = window.location.pathname.split("/").pop();

window.socket.on(`game:${gameId}:updated`, (game) => {
    updateGame(game);
});

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
            await fetch(`/games/${gameId}/action`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    amount,
                }),
            });
        }) as EventListener);
    }
});
