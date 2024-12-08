import db from "../connection";
import {
    CREATE_GAME,
    ADD_PLAYER,
    GET_PLAYER_HAND,
    DRAW_CARD,
    UPDATE_GAME_STATE,
    ALL_PLAYER_DATA,
} from "./sql";

export const createGame = async (): Promise<{ id: number }> => {
    return await db.one(CREATE_GAME);
};

export const get = async (gameId: number, playerId: number) => {
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

export const getPlayers = async (
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

export const joinGame = async (
    gameId: number,
    userId: number,
): Promise<{ game_id: number; user_id: number; seat: number }> => {
    return await db.one(ADD_PLAYER, [gameId, userId]);
};

export const getPlayerHand = async (gameId: number, userId: number) => {
    return await db.any(GET_PLAYER_HAND, [gameId, userId]);
};

export const drawCard = async (gameId: number, userId: number) => {
    return await db.one(DRAW_CARD, [gameId, userId]);
};

export const updateGameState = async (gameId: number, showing: boolean) => {
    return db.none(UPDATE_GAME_STATE, [showing, gameId]);
};
