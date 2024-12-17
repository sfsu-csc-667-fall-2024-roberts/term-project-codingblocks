export type Card = {
    id: number;
    value: number;
};

export type Player = {
    gravatar: string;
    hand: Card[];
    id: number;
    is_current: boolean;
    last_draw_turn: number;
    seat: number;
    username: string;
};

export type GameState = {
    players: Omit<Player, "hand">[];
    player: Player;
};
