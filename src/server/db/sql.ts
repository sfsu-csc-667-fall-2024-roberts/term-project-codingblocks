// SQL Queries

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

export const GET_PLAYER_HAND = `
  SELECT cards.face_value, cards.suit
  FROM user_hands
  JOIN cards ON user_hands.card_id = cards.id
  WHERE user_hands.game_id = $1 AND user_hands.user_id = $2
  ORDER BY user_hands.card_order;
`;
