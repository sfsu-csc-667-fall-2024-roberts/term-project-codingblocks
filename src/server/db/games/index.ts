import db from "../connection";
import {
    CREATE_GAME,
    ADD_PLAYER,
    GET_PLAYER_HAND,
    UPDATE_GAME_STATE,
    ALL_PLAYER_DATA,
    DEAL_CARDS,
    GET_GAME_DETAILS,
    UPDATE_PLAYER_ACTION,
    NEXT_PLAYER,
    IS_CURRENT,
    CHECK_ROUND_COMPLETE,
    GET_COMMUNITY_CARDS,
    DEAL_COMMUNITY_CARDS,
} from "./sql";

type GameStage = "waiting" | "preflop" | "flop" | "turn" | "river" | "showdown";

const createGame = async (): Promise<{ id: number }> => {
    return await db.one(CREATE_GAME);
};

const getCommunityCards = async (gameId: number, stage: GameStage) => {
    return db.any(GET_COMMUNITY_CARDS, [gameId, stage]);
};

const get = async (gameId: number, playerId: number) => {
    const gameDetails = await getGameDetails(gameId);
    const players = await getPlayers(gameId);
    const playerHand = await db.any(GET_PLAYER_HAND, [gameId, playerId]);
    const communityCards = await getCommunityCards(
        gameId,
        gameDetails.current_stage,
    );

    return {
        gameDetails,
        players,
        playerHand,
        communityCards,
    };
};

const getGameDetails = async (gameId: number) => {
    return await db.one(GET_GAME_DETAILS, [gameId]);
};

type Player = {
    id: number;
    username: string;
    gravatar: string;
    seat: number;
    chips: number;
    current_bet: number;
    status: "active" | "folded" | "allin";
    is_current: boolean;
};

const getPlayers = async (gameId: number): Promise<Player[]> => {
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

const dealCards = async (gameId: number) => {
    return await db.none(DEAL_CARDS, [gameId]);
};

const updateGameState = async (
    gameId: number,
    stage: "waiting" | "preflop" | "flop" | "turn" | "river" | "showdown",
) => {
    return db.none(UPDATE_GAME_STATE, [stage, gameId]);
};

const playerAction = async (
    gameId: number,
    userId: number,
    action: "active" | "folded" | "allin",
    betAmount: number = 0,
) => {
    return db.none(UPDATE_PLAYER_ACTION, [action, betAmount, gameId, userId]);
};

const isCurrentPlayer = async (
    gameId: number,
    userId: number,
): Promise<{ is_current_player: boolean }> => {
    return await db.one(IS_CURRENT, [gameId, userId]);
};

const nextPlayer = async (gameId: number) => {
    return db.none(NEXT_PLAYER, [gameId]);
};

const isRoundComplete = async (gameId: number): Promise<boolean> => {
    const { is_round_complete } = await db.one(CHECK_ROUND_COMPLETE, [gameId]);
    return is_round_complete;
};

const dealCommunityCards = async (gameId: number, stage: GameStage) => {
    return db.none(DEAL_COMMUNITY_CARDS, [gameId, stage]);
};

export default {
    createGame,
    get,
    getGameDetails,
    getPlayers,
    joinGame,
    getPlayerHand,
    updateGameState,
    dealCards,
    playerAction,
    isCurrentPlayer,
    nextPlayer,
    isRoundComplete,
    dealCommunityCards,
    getCommunityCards,
};
