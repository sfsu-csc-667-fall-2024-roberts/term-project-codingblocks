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
