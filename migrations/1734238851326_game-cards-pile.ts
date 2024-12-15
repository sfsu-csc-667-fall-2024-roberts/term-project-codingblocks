import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("game_cards", {
        pile: {
            type: "integer",
            notNull: true,
            default: 0,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("game_cards", "pile");
}
