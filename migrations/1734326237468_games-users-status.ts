import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType("user_status", ["active", "folded", "all-in"]);

    pgm.addColumn("game_users", {
        status: {
            type: "user_status",
            notNull: true,
            default: "active",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn("game_users", "status");
    pgm.dropType("user_status");
}
