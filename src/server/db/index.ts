import db from "./connection";
import {
    DEAL_CARDS,
    PLAY_CARD,
    SHUFFLE_DISCARD_PILE,
    GET_GAME_DETAILS,
    GET_PLAYER_HAND,
} from "./sql";

export const getGameDetails = async (gameId: number) => {
    try {
        return await db.one(GET_GAME_DETAILS, [gameId]);
    } catch (error) {
        console.error(`Error fetching game details: ${error.message}`);
        throw error;
    }
};

export const dealCards = async (gameId: number) => {
    try {
        return await db.none(DEAL_CARDS, [gameId]);
    } catch (error) {
        console.error(`Error dealing cards: ${error.message}`);
        throw error;
    }
};

export const playCard = async (gameId: number, cardId: number) => {
    try {
        return await db.none(PLAY_CARD, [cardId, gameId]);
    } catch (error) {
        console.error(`Error playing card: ${error.message}`);
        throw error;
    }
};

export const shuffleDiscardPile = async (gameId: number) => {
    try {
        return await db.none(SHUFFLE_DISCARD_PILE, [gameId]);
    } catch (error) {
        console.error(`Error shuffling discard pile: ${error.message}`);
        throw error;
    }
};

export const getPlayerHand = async (gameId: number, userId: number) => {
    try {
        return await db.any(GET_PLAYER_HAND, [gameId, userId]);
    } catch (error) {
        console.error(`Error fetching player hand: ${error.message}`);
        throw error;
    }
};
