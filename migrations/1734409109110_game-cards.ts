import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("community_cards", {
        game_id: {
            type: "integer",
            notNull: true,
            references: "games(id)",
        },
        card_id: {
            type: "integer",
            notNull: true,
            references: "cards(id)",
        },
        stage: {
            type: "varchar(10)",
            check: "stage IN ('flop', 'turn', 'river')",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("community_cards");
}
