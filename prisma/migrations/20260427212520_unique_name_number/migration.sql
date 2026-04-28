/*
  Warnings:

  - A unique constraint covering the columns `[name,number]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_name_number_key" ON "Player"("name", "number");
