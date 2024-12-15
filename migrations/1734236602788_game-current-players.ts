import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn("games", {
        current_seat: {
            type: "integer",
            notNull: true,
            default: 1,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("games", "current_seat");
}
