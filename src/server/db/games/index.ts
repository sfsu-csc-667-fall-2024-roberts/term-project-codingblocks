import db from "../connection";
import {
  CREATE_GAME,
  ADD_PLAYER,
  GET_PLAYER_HAND,
  DRAW_CARD,
  UPDATE_GAME_STATE,
} from "./sql";

export const createGame = async (): Promise<{ id: number }> => {
  return await db.one(CREATE_GAME);
};

export const joinGame = async (gameId: number, userId: number): Promise<{ game_id: number; user_id: number; seat: number }> => {
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
