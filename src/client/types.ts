export type Card = {
    id: number;
    value: string;
    suit: string;
};

export type Player = {
    id: number;
    username: string;
    chips: number;
    status: string;
    current_bet: number;
    is_current: boolean;
    hand?: Card[];
};

export type GameDetails = {
    current_stage: string;
    pot: number;
    current_bet: number;
    winner_id?: number;
};

export type GameState = {
    players: Player[];
    player: Player & { hand: Card[] };
    gameDetails: GameDetails;
    communityCards: Card[];
};
