using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WordsApi.Migrations
{
    /// <inheritdoc />
    public partial class sqlitelocal_migration_784 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Words",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Hun = table.Column<string>(type: "TEXT", nullable: true),
                    Eng = table.Column<string>(type: "TEXT", nullable: true),
                    SuccessCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Words", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Words");
        }
    }
}
