import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("cards", {
        id: "id",
        value: {
            type: "integer",
            notNull: true,
        },
    });

    // 12 * 1 - 12
    const cards: number[] = [];
    for (let i = 1; i <= 12; i++) {
        cards.push(i);
    }
    const allCards = cards
        .flatMap(() => {
            return cards;
        })
        .map((card) => `(${card})`)
        .join(", ");

    pgm.sql(`INSERT INTO cards (value) VALUES ${allCards}`);
    // 18 wild cards
    pgm.sql(
        `INSERT INTO cards (value) VALUES ${Array(18).fill("(0)").join(", ")}`,
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("cards");
}
