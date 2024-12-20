import db from "../connection";
import { compareHands, evaluateHand } from "./hand";
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
    GET_HIGHEST_BET,
    GET_CURRENT_POT,
    UPDATE_POT,
    AVAILABLE_GAMES,
    GET_RANDOM_GAME,
} from "./sql";

type GameStage = "waiting" | "preflop" | "flop" | "turn" | "river" | "showdown";

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
    return db.tx(async (t) => {
        const highestBet = await t.one(GET_HIGHEST_BET, [gameId]);
        const currentPlayer = await t.one(
            "SELECT chips, current_bet FROM game_users WHERE game_id = $1 AND user_id = $2",
            [gameId, userId],
        );

        let finalBetAmount = betAmount;

        switch (action) {
            case "active":
                if (betAmount === 0) {
                    if (highestBet.highest_bet > currentPlayer.current_bet) {
                        throw new Error(
                            "Cannot check when there are outstanding bets",
                        );
                    }
                } else {
                    const minimumCallAmount =
                        highestBet.highest_bet - currentPlayer.current_bet;

                    if (betAmount < minimumCallAmount) {
                        if (betAmount === currentPlayer.chips) {
                            action = "allin";
                        } else {
                            throw new Error(
                                "Bet amount must be at least the minimum call amount",
                            );
                        }
                    }
                }
                break;

            case "allin":
                finalBetAmount = currentPlayer.chips;
                break;

            case "folded":
                finalBetAmount = 0;
                break;
        }

        if (finalBetAmount > currentPlayer.chips) {
            throw new Error("Not enough chips");
        }

        await t.none(UPDATE_PLAYER_ACTION, [
            action,
            finalBetAmount,
            gameId,
            userId,
        ]);

        if (finalBetAmount > 0) {
            await t.none(UPDATE_POT, [finalBetAmount, gameId]);
        }
    });
};

const isCurrentPlayer = async (
    gameId: number,
    userId: number,
): Promise<{ is_current_player: boolean }> => {
    return await db.one(IS_CURRENT, [gameId, userId]);
};

const nextPlayer = async (gameId: number) => {
    return db.tx(async (t) => {
        const { current_seat } = await t.one(
            "SELECT current_seat FROM games WHERE id = $1",
            [gameId],
        );

        const players = await t.any(
            `
            SELECT seat, status 
            FROM game_users 
            WHERE game_id = $1 
            ORDER BY seat`,
            [gameId],
        );

        let nextSeat = current_seat;
        let foundActive = false;
        let loopCount = 0;

        while (!foundActive && loopCount < players.length) {
            if (nextSeat >= players[players.length - 1].seat) {
                nextSeat = players[0].seat;
            } else {
                nextSeat =
                    players.find((p) => p.seat > nextSeat)?.seat ||
                    players[0].seat;
            }

            const nextPlayer = players.find((p) => p.seat === nextSeat);
            if (nextPlayer && nextPlayer.status === "active") {
                foundActive = true;
            }

            loopCount++;
        }

        await t.none("UPDATE games SET current_seat = $1 WHERE id = $2", [
            nextSeat,
            gameId,
        ]);
    });
};

const isRoundComplete = async (gameId: number): Promise<boolean> => {
    const { is_round_complete } = await db.one(CHECK_ROUND_COMPLETE, [gameId]);
    return is_round_complete;
};

const dealCommunityCards = async (gameId: number, stage: GameStage) => {
    return db.none(DEAL_COMMUNITY_CARDS, [gameId, stage]);
};

const getHighestBet = async (gameId: number) => {
    return await db.one(GET_HIGHEST_BET, [gameId]);
};

const updatePot = async (gameId: number, amount: number) => {
    return await db.none(UPDATE_POT, [amount, gameId]);
};

const getCurrentPot = async (gameId: number): Promise<number> => {
    const result = await db.one(GET_CURRENT_POT, [gameId]);
    return result.pot;
};

const checkWinner = async (gameId: number): Promise<boolean> => {
    return db
        .tx(async (t) => {
            const activePlayers = await t.any(
                `SELECT user_id 
             FROM game_users 
             WHERE game_id = $1 
             AND status = 'active'`,
                [gameId],
            );

            if (Number(activePlayers.length) === 1) {
                await t.none(
                    `UPDATE games 
                 SET current_stage = 'showdown',
                     winner_id = $1
                 WHERE id = $2`,
                    [activePlayers[0].user_id, gameId],
                );
                return true;
            }

            const gameState = await t.one(
                `SELECT current_stage FROM games WHERE id = $1`,
                [gameId],
            );

            if (gameState.current_stage === "showdown") {
                const communityCards = await t.any(
                    `SELECT c.* 
                 FROM community_cards cc
                 JOIN cards c ON cc.card_id = c.id
                 WHERE cc.game_id = $1
                 ORDER BY cc.stage`,
                    [gameId],
                );

                const playerHands = await Promise.all(
                    activePlayers.map(async (player) => {
                        const playerCards = await t.any(
                            `SELECT c.* 
                         FROM user_hands uh
                         JOIN cards c ON uh.card_id = c.id
                         WHERE uh.game_id = $1 AND uh.user_id = $2
                         ORDER BY uh.card_order`,
                            [gameId, player.user_id],
                        );

                        const evaluation = evaluateHand(
                            playerCards,
                            communityCards,
                        );

                        console.log(evaluation);

                        return {
                            userId: player.user_id,
                            handEval: evaluation,
                        };
                    }),
                );

                const winner = playerHands.reduce((best, current) => {
                    const comparison = compareHands(
                        current.handEval,
                        best.handEval,
                    );
                    return comparison > 0 ? current : best;
                });

                await t.none(
                    `UPDATE games 
                 SET current_stage = 'showdown',
                     winner_id = $1
                 WHERE id = $2`,
                    [winner.userId, gameId],
                );

                return true;
            }

            return false;
        })
        .catch((error) => {
            console.error("Error in checkWinner:", error);
            return false;
        });
};

const getAvailableGames = async (
    page: number = 1,
    gamesPerPage: number = 5,
) => {
    const offset = (page - 1) * gamesPerPage;
    const results = await db.any(AVAILABLE_GAMES, [gamesPerPage, offset]);
    const totalCount =
        results.length > 0 ? parseInt(results[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / gamesPerPage);

    return {
        games: results,
        pagination: {
            currentPage: page,
            totalPages,
            gamesPerPage,
            totalCount,
        },
    };
};

const getRandomGame = async (): Promise<number | null> => {
    const result = await db.oneOrNone(GET_RANDOM_GAME);
    return result ? result.id : null;
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
    getHighestBet,
    updatePot,
    getCurrentPot,
    checkWinner,
    getAvailableGames,
    getRandomGame,
};
