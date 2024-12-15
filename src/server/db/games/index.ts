import db from "../connection";
import {
    CREATE_GAME,
    ADD_PLAYER,
    GET_PLAYER_HAND,
    DRAW_CARD,
    UPDATE_GAME_STATE,
    ALL_PLAYER_DATA,
    DEAL_CARDS,
    PLAY_CARD,
    SHUFFLE_DISCARD_PILE,
    GET_GAME_DETAILS,
} from "./sql";

const createGame = async (): Promise<{ id: number }> => {
    return await db.one(CREATE_GAME);
};

const get = async (gameId: number, playerId: number) => {
    const currentSeat = await db.one(
        "SELECT current_seat FROM games WHERE id=$1",
        gameId,
    );
    const players = await getPlayers(gameId);
    const playerHand = await db.any(GET_PLAYER_HAND, [playerId, gameId, 0, 8]);

    return {
        currentSeat,
        players,
        playerHand,
    };
};

const getGameDetails = async (gameId: number) => {
    return await db.one(GET_GAME_DETAILS, [gameId]);
};

const getPlayers = async (
    gameId: number,
): Promise<
    {
        gravatar: string;
        id: number;
        is_current: boolean;
        last_draw_turn: number;
        pile_1: number[];
        pile_2: number[];
        pile_3: number[];
        pile_4: number[];
        play_pile_top: number;
        play_pile_top_id: number;
        play_pile_count: number;
        seat: number;
        username: string;
    }[]
> => {
    return await db.any(ALL_PLAYER_DATA, [gameId]);
};

const joinGame = async (
    gameId: number,
    userId: number,
): Promise<{ game_id: number; user_id: number; seat: number }> => {
    return await db.one(ADD_PLAYER, [gameId, userId]);
};

const getPlayerHand = async (gameId: number, userId: number) => {
    return await db.any(GET_PLAYER_HAND, [gameId, userId]);
};

const drawCard = async (gameId: number, userId: number) => {
    return await db.one(DRAW_CARD, [gameId, userId]);
};

const updateGameState = async (gameId: number, showing: boolean) => {
    return db.none(UPDATE_GAME_STATE, [showing, gameId]);
};

const dealCards = async (gameId: number) => {
    return await db.none(DEAL_CARDS, [gameId]);
};

const playCard = async (gameId: number, cardId: number) => {
    return await db.none(PLAY_CARD, [cardId, gameId]);
};

const shuffleDiscardPile = async (gameId: number) => {
    return await db.none(SHUFFLE_DISCARD_PILE, [gameId]);
};

export default {
    createGame,
    get,
    getGameDetails,
    getPlayers,
    joinGame,
    getPlayerHand,
    drawCard,
    updateGameState,
    dealCards,
    playCard,
    shuffleDiscardPile,
};
