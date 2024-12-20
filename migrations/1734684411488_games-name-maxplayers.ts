import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("games", {
        lobby_name: {
            type: "varchar(100)",
            notNull: true,
            default: "lobby",
        },
        max_players: {
            type: "integer",
            notNull: true,
            default: 4,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("games", "lobby_name");
    pgm.dropColumn("games", "max_players");
}
