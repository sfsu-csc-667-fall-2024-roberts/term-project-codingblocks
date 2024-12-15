import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    pgm.createTable("game_cards", {
        id: "id",
        game_id: {
            type: "integer",
            notNull: true,
        },
        card_id: {
            type: "integer",
            notNull: true,
        },
        user_id: {
            type: "integer",
            notNull: true,
        },
        position: {
            type: "uuid",
            notNull: true,
        },
        pile: {
            type: "integer",
            notNull: true,
            default: 0,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("game_cards");
}
