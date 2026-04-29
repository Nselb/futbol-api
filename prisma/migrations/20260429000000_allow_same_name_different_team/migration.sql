-- DropIndex
DROP INDEX "Player_name_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_number_teamId_key" ON "Player"("name", "number", "teamId");
