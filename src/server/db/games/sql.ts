export const CREATE_GAME = `
  INSERT INTO games (pot, current_stage, lobby_name, max_players) 
  VALUES (0, 'waiting', $1, $2) 
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
  SELECT cards.*, user_hands.card_order
  FROM user_hands
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
  DELETE FROM user_hands WHERE game_id = $1;
  
  WITH numbered_players AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY seat) * 2 - 1 as first_card,
      ROW_NUMBER() OVER (ORDER BY seat) * 2 as second_card
    FROM game_users
    WHERE game_id = $1
  ),
  available_cards AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY RANDOM()) as card_number
    FROM cards 
    WHERE id NOT IN (SELECT card_id FROM user_hands WHERE game_id = $1)
    ORDER BY RANDOM()
    LIMIT (SELECT COUNT(*) * 2 FROM game_users WHERE game_id = $1)
  )
  INSERT INTO user_hands (user_id, card_id, game_id, card_order)
  SELECT 
    p.user_id,
    c.id,
    $1 as game_id,
    CASE 
      WHEN c.card_number = p.first_card THEN 1
      WHEN c.card_number = p.second_card THEN 2
    END as card_order
  FROM numbered_players p
  JOIN available_cards c ON 
    c.card_number = p.first_card OR 
    c.card_number = p.second_card;
  
  UPDATE games SET current_stage = 'preflop' WHERE id = $1;
  
  UPDATE game_users
  SET is_current = (seat = 1)
  WHERE game_id = $1;
`;

export const GET_GAME_DETAILS = `
  SELECT 
    id,
    pot,
    current_stage,
    current_bet,
    minimum_bet,
    winner_id,
    lobby_name,
    max_players,
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
  UPDATE games
  SET current_seat = 
    CASE 
      WHEN current_seat = (SELECT MAX(seat) FROM game_users WHERE game_id = $1)
      THEN (SELECT MIN(seat) FROM game_users WHERE game_id = $1)
      ELSE (SELECT MIN(seat) FROM game_users WHERE game_id = $1 AND seat > current_seat)
    END
  WHERE id = $1;
`;

export const IS_CURRENT = `
  SELECT games.current_seat = game_users.seat AS is_current_player
    FROM games, game_users
    WHERE games.id = $1
    AND game_users.user_id = $2
    AND game_users.game_id = games.id`;

export const CHECK_ROUND_COMPLETE = `
  SELECT CASE 
    WHEN COUNT(DISTINCT current_bet) = 1 
    AND COUNT(*) = COUNT(CASE WHEN status = 'active' THEN 1 END)
    THEN true 
    ELSE false 
  END as is_round_complete
  FROM game_users 
  WHERE game_id = $1 
  AND status = 'active';
`;

export const DEAL_COMMUNITY_CARDS = `
  WITH available_cards AS (
    SELECT id 
    FROM cards 
    WHERE id NOT IN (
      SELECT card_id FROM user_hands WHERE game_id = $1
      UNION
      SELECT card_id FROM community_cards WHERE game_id = $1
    )
    ORDER BY RANDOM()
    LIMIT 
      CASE 
        WHEN $2 = 'flop' THEN 3
        WHEN $2 IN ('turn', 'river') THEN 1
        ELSE 0
      END
  )
  INSERT INTO community_cards (game_id, card_id, stage)
  SELECT $1, id, $2
  FROM available_cards;
`;

export const GET_COMMUNITY_CARDS = `
  SELECT cards.id, cards.value, cards.suit, community_cards.stage
  FROM community_cards
  JOIN cards ON community_cards.card_id = cards.id
  WHERE game_id = $1
  ORDER BY 
    CASE community_cards.stage
      WHEN 'flop' THEN 1
      WHEN 'turn' THEN 2
      WHEN 'river' THEN 3
    END;
`;

export const GET_HIGHEST_BET = `
  SELECT COALESCE(MAX(current_bet), 0) as highest_bet
  FROM game_users
  WHERE game_id = $1 AND status != 'folded';
`;

export const UPDATE_POT = `
  UPDATE games
  SET pot = pot + $1
  WHERE id = $2;
`;

export const GET_CURRENT_POT = `
  SELECT pot
  FROM games
  WHERE id = $1;
`;

export const AVAILABLE_GAMES = `
  SELECT 
    g.id,
    g.pot,
    g.current_stage,
    g.created_at,
    g.lobby_name,
    g.max_players,
    COUNT(gu.user_id) as player_count,
    COUNT(*) OVER() as total_count
  FROM games g
  LEFT JOIN game_users gu ON g.id = gu.game_id
  WHERE g.current_stage != 'showdown'
  GROUP BY g.id
  HAVING COUNT(gu.user_id) < g.max_players
  ORDER BY g.created_at DESC
  LIMIT $1 
  OFFSET $2;
`;

export const GET_RANDOM_GAME = `
  SELECT id 
  FROM games g
  WHERE g.current_stage != 'showdown'
  AND (
    SELECT COUNT(*) 
    FROM game_users gu 
    WHERE gu.game_id = g.id
  ) < g.max_players
  ORDER BY RANDOM()
  LIMIT 1;
`;
