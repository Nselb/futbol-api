-- AlterTable
ALTER TABLE "EventMatch" ADD COLUMN     "incomingPlayerId" TEXT;

-- AddForeignKey
ALTER TABLE "EventMatch" ADD CONSTRAINT "EventMatch_incomingPlayerId_fkey" FOREIGN KEY ("incomingPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
