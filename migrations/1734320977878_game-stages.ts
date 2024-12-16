import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType("game_stage", [
        "waiting",
        "preflop", // before turn 3 cards
        "flop", // after
        "turn",
        "river",
        "showdown",
    ]);

    pgm.addColumn("games", {
        stage: {
            type: "game_stage",
            notNull: true,
            default: "waiting",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("games", "stage");
    pgm.dropType("game_stage");
}
