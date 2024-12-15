export const CREATE_GAME = `
  INSERT INTO games (pot) VALUES (0) RETURNING id;
`;

export const ADD_PLAYER = `
  INSERT INTO game_users (game_id, user_id, seat)
  VALUES ($1, $2, (SELECT COUNT(*) FROM game_users WHERE game_id = $1) + 1)
  RETURNING game_id, user_id, seat;
`;

export const GET_PLAYER_HAND = `
  SELECT cards.* FROM user_hands
  JOIN cards ON user_hands.card_id = cards.id
  WHERE user_hands.game_id = $1 AND user_hands.user_id = $2
  ORDER BY user_hands.card_order;
`;

export const DRAW_CARD = `
  UPDATE user_hands
  SET card_id = (
    SELECT id FROM cards
    WHERE id NOT IN (
      SELECT card_id FROM user_hands WHERE game_id = $1
    )
    LIMIT 1
  )
  WHERE game_id = $1 AND user_id = $2
  RETURNING card_id;
`;

export const UPDATE_GAME_STATE = `
  UPDATE games SET showing = $1 WHERE id = $2;
`;

/**
 * Player data that is viewable by all players
 */
const playPileTopSubquery = (field: string) => `
SELECT ${field} 
FROM game_cards, cards 
WHERE game_cards.user_id=users.id 
  AND game_cards.game_id=$1 
  AND game_cards.card_id=cards.id 
  AND pile=-1 
ORDER BY position DESC LIMIT 1
`;

const PLAY_PILE_COUNT = `
SELECT COUNT(*)
FROM game_cards
WHERE game_id = $1 
  AND pile=-1
  AND users.id = game_cards.user_id`;

const discardPileSubquery = (pile: number) => `
  SELECT cards.value FROM game_cards, cards
  WHERE game_cards.user_id=users.id 
    AND game_cards.game_id=$1 
    AND game_cards.card_id=cards.id 
    AND pile=${pile}
  ORDER BY position DESC`;

export const IS_CURRENT = `
  SELECT games.current_seat = game_users.seat AS is_current_player
    FROM games, game_users
    WHERE games.id = $1
    AND game_users.user_id = $2
    AND game_users.game_id = games.id`;

export const ALL_PLAYER_DATA = `
SELECT 
  users.id, 
  users.username, 
  users.gravatar, 
  game_users.seat, 
  game_users.last_draw_turn,
  (
    SELECT games.current_seat = game_users.seat 
    FROM games, game_users
    WHERE games.id = $1
    AND game_users.user_id = users.id
    AND game_users.game_id = games.id
  ) AS is_current,
  (${playPileTopSubquery("cards.value")}) AS play_pile_top,
  (${playPileTopSubquery("cards.id")}) AS play_pile_top_id,
  (${PLAY_PILE_COUNT})::INTEGER AS play_pile_count,
  array(${discardPileSubquery(1)}) AS pile_1,
  array(${discardPileSubquery(2)}) AS pile_2,
  array(${discardPileSubquery(3)}) AS pile_3,
  array(${discardPileSubquery(4)}) AS pile_4
FROM users, game_users
WHERE users.id = game_users.user_id AND game_users.game_id = $1
`;

export const DEAL_CARDS = `
  INSERT INTO user_hands (user_id, card_id, game_id, card_order)
  SELECT game_users.user_id, cards.id, $1, ROW_NUMBER() OVER ()
  FROM cards
  CROSS JOIN game_users
  WHERE game_users.game_id = $1
  AND cards.id NOT IN (SELECT card_id FROM user_hands WHERE game_id = $1);
`;

export const PLAY_CARD = `
  DELETE FROM user_hands
  WHERE card_id = $1 AND game_id = $2;
`;

export const SHUFFLE_DISCARD_PILE = `
  UPDATE user_hands
  SET card_order = ROW_NUMBER() OVER ()
  WHERE game_id = $1 AND user_id = -2;
`;

export const GET_GAME_DETAILS = `
  SELECT id, pot, showing AS currentTurn
  FROM games
  WHERE id = $1;
`;

export const GET_LAST_DRAW_TURN = `
SELECT last_draw_turn 
FROM game_users 
WHERE game_id=$1 
  AND user_id=$2`;

export const UPDATE_PLAYER_DRAW_TURN = `
UPDATE game_users 
SET last_draw_turn = (SELECT turn FROM games WHERE id=$1) 
WHERE game_id=$1 
  AND user_id=$2`;
