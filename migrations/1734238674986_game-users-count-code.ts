import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("games", {
        player_count: {
            type: "integer",
            default: 4,
            notNull: true,
        },
        password: {
            type: "text",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns("games", ["player_count", "password"]);
}
