export const CREATE_GAME = `
  INSERT INTO games (pot, current_stage) 
  VALUES (0, 'waiting') 
  RETURNING id;
`;

export const ADD_PLAYER = `
  INSERT INTO game_users (game_id, user_id, seat, chips, status)
  VALUES ($1, $2, 
    (SELECT COUNT(*) FROM game_users WHERE game_id = $1) + 1,
    1000,  -- Starting chips amount
    'active'
  )
  RETURNING game_id, user_id, seat;
`;

export const GET_PLAYER_HAND = `
  SELECT cards.* FROM user_hands
  JOIN cards ON user_hands.card_id = cards.id
  WHERE user_hands.game_id = $1 
  AND user_hands.user_id = $2
  ORDER BY user_hands.card_order;
`;

export const UPDATE_GAME_STATE = `
  UPDATE games 
  SET current_stage = $1 
  WHERE id = $2;
`;

export const ALL_PLAYER_DATA = `
  SELECT 
    users.id,
    users.username,
    users.gravatar,
    game_users.seat,
    game_users.chips,
    game_users.current_bet,
    game_users.status,
    game_users.is_current
  FROM users
  JOIN game_users ON users.id = game_users.user_id
  WHERE game_users.game_id = $1
  ORDER BY game_users.seat;
`;

export const DEAL_CARDS = `
  -- First, clear any existing cards
  DELETE FROM user_hands WHERE game_id = $1;
  
  -- Deal 2 cards to each player
  INSERT INTO user_hands (user_id, card_id, game_id, card_order)
  SELECT 
    gu.user_id,
    c.id,
    $1 as game_id,
    ROW_NUMBER() OVER (PARTITION BY gu.user_id ORDER BY RANDOM())
  FROM game_users gu
  CROSS JOIN (
    SELECT id FROM cards 
    WHERE id NOT IN (SELECT card_id FROM user_hands WHERE game_id = $1)
    ORDER BY RANDOM()
    LIMIT (SELECT COUNT(*) * 2 FROM game_users WHERE game_id = $1)
  ) c
  WHERE gu.game_id = $1;
  
  -- Update game stage
  UPDATE games SET current_stage = 'preflop' WHERE id = $1;
`;

export const GET_GAME_DETAILS = `
  SELECT 
    id,
    pot,
    current_stage,
    current_bet,
    minimum_bet,
    winner_id,
    created_at,
    updated_at
  FROM games
  WHERE id = $1;
`;

export const UPDATE_PLAYER_ACTION = `
  UPDATE game_users
  SET 
    status = $1,
    current_bet = current_bet + $2,
    chips = chips - $2
  WHERE game_id = $3 AND user_id = $4;
`;

export const NEXT_PLAYER = `
  UPDATE game_users
  SET is_current = 
    CASE WHEN seat = 
      (SELECT seat FROM game_users 
       WHERE game_id = $1 AND is_current = true)
    THEN false
    WHEN seat = 
      (SELECT LEAST(MAX(seat), 
        (SELECT seat FROM game_users 
         WHERE game_id = $1 AND is_current = true) + 1)
       FROM game_users 
       WHERE game_id = $1)
    THEN true
    ELSE false END
  WHERE game_id = $1;
`;
