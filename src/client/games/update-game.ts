import { GameState } from "../types";

export const updateGame = (gameState: GameState) => {
    const { players, player, gameDetails, communityCards } = gameState;

    if (gameDetails.current_stage === "showdown") {
        window.location.href = `/games/${window.location.pathname.split("/").pop()}/winner`;
        return;
    }

    const gameInfo = document.querySelector(".game-info");

    if (gameInfo) {
        const allParagraphs = gameInfo.querySelectorAll("p");
        if (gameDetails && allParagraphs.length >= 2) {
            allParagraphs[0].textContent = `Current Stage: ${gameDetails.current_stage}`;
            allParagraphs[1].textContent = `Pot: $${gameDetails.pot}`;
        }

        const startForm = gameInfo.querySelector("form");
        if (startForm) {
            startForm.style.display =
                gameDetails.current_stage === "waiting" ? "block" : "none";
        }
    }

    const communityCardsSection = document.querySelector(".community-cards");
    if (communityCardsSection) {
        const noCardsMessage = communityCardsSection.querySelector("p");

        if (!communityCards || communityCards.length === 0) {
            if (!noCardsMessage) {
                communityCardsSection.innerHTML = `
                    <h2>Community Cards</h2>
                    <p>No community cards yet</p>
                `;
            }
        } else {
            communityCardsSection.innerHTML = `
                <h2>Community Cards</h2>
                <div class="cards">
                    ${communityCards
                        .map(
                            (card) => `
                    <div class="card">${card.value} of ${card.suit}</div>
                    `,
                        )
                        .join("")}
                </div>
            `;
        }
    }

    const playersList = document.querySelector(".players-list");
    if (playersList) {
        const allPlayers = [...players, player];
        playersList.innerHTML = allPlayers
            .map(
                (p) => `
                <div class="player ${p.is_current ? "current-turn" : ""}">
                    <p>Player: ${p.username}</p>
                    <p>Chips: $${p.chips}</p>
                    <p>Status: ${p.status}</p>
                    ${p.current_bet > 0 ? `<p>Current Bet: $${p.current_bet}</p>` : ""}
                </div>
            `,
            )
            .join("");
    }

    const playerHandSection = document.querySelector(".player-hand");
    if (playerHandSection) {
        if (!player.hand || player.hand.length === 0) {
            playerHandSection.innerHTML = `
                <h2>Your Hand</h2>
                <p>Waiting for cards to be dealt...</p>
            `;
        } else {
            playerHandSection.innerHTML = `
                <h2>Your Hand</h2>
                <div class="cards">
                    ${player.hand
                        .map(
                            (card) => `
                    <div class="card">${card.value} of ${card.suit}</div>
                    `,
                        )
                        .join("")}
                </div>
            `;
        }
    }
};
