import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("games", {
        id: "id",
        pot: {
            type: "integer",
            notNull: true,
        },
        showing: {
            type: "boolean",
            notNull: true,
            default: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("games");
}
