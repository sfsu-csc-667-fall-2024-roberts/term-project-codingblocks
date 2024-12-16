import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType("game_stage", [
        "dealing",
        "waiting",
        "flop",
        "turn",
        "river",
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
