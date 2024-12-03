DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS user_hands;
DROP TABLE IF EXISTS game_users;
DROP TABLE IF EXISTS hand_rankings;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

DROP SEQUENCE IF EXISTS hand_rankings_id_seq;
DROP SEQUENCE IF EXISTS users_id_seq;
DROP SEQUENCE IF EXISTS cards_id_seq;
DROP SEQUENCE IF EXISTS games_id_seq;

DROP TYPE IF EXISTS hands;
DROP TYPE IF EXISTS suits;

CREATE TYPE suits AS ENUM ('hearts', 'diamonds', 'clubs', 'spades');
CREATE TYPE hands AS ENUM ('high_card', 'pair', 'two_pair', 'three_of_kind', 'straight', 'flush', 'full_house', 'four_of_kind', 'straight_flush', 'royal_flush');

CREATE SEQUENCE IF NOT EXISTS hand_rankings_id_seq;
CREATE TABLE IF NOT EXISTS hand_rankings (
    id bigint NOT NULL PRIMARY KEY DEFAULT nextval('hand_rankings_id_seq'),
    rank integer NOT NULL,
    name hands NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE TABLE IF NOT EXISTS users (
    id bigint NOT NULL PRIMARY KEY DEFAULT nextval('users_id_seq'),
    username varchar(100) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS cards_id_seq;
CREATE TABLE IF NOT EXISTS cards (
    id bigint NOT NULL PRIMARY KEY DEFAULT nextval('cards_id_seq'),
    face_value integer NOT NULL,
    value varchar(2) NOT NULL,
    suit suits NOT NULL
);

CREATE TABLE IF NOT EXISTS user_hands (
    user_id bigint NOT NULL,
    card_id bigint NOT NULL,
    game_id bigint NOT NULL,
    card_order integer NOT NULL,
    PRIMARY KEY (user_id, card_id, game_id)
);

CREATE TABLE IF NOT EXISTS game_users (
    game_id bigint NOT NULL,
    user_id bigint NOT NULL,
    is_current boolean NOT NULL DEFAULT false,
    seat integer NOT NULL,
    PRIMARY KEY (game_id, user_id)
);

CREATE SEQUENCE IF NOT EXISTS games_id_seq;
CREATE TABLE IF NOT EXISTS games (
    id bigint NOT NULL PRIMARY KEY DEFAULT nextval('games_id_seq'),
    pot integer NOT NULL,
    showing boolean NOT NULL DEFAULT false
);

ALTER TABLE game_users ADD CONSTRAINT game_users_game_id_fk FOREIGN KEY (game_id) REFERENCES games (id);
ALTER TABLE game_users ADD CONSTRAINT game_users_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_hands ADD CONSTRAINT user_hands_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_hands ADD CONSTRAINT user_hands_game_id_fk FOREIGN KEY (game_id) REFERENCES games (id);
ALTER TABLE user_hands ADD CONSTRAINT user_hands_card_id_fk FOREIGN KEY (card_id) REFERENCES cards (id);

CREATE INDEX idx_game_users_user_id ON game_users(user_id);
CREATE INDEX idx_user_hands_game_id ON user_hands(game_id);
CREATE INDEX idx_user_hands_card_id ON user_hands(card_id);


