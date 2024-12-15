import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("games", {
        turn: {
            type: "integer",
            default: 0,
        },
    });

    pgm.addColumn("game_users", {
        last_draw_turn: {
            type: "integer",
            default: -1,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("games", "turn");
    pgm.dropColumn("game_users", "last_draw_turn");
}
