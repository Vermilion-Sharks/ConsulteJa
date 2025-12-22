/*
  Warnings:

  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(64)`.

*/
-- DropIndex
DROP INDEX "refresh_tokens_session_id_idx";

-- AlterTable
ALTER TABLE "apis" ALTER COLUMN "data_atualizacao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "produtos" ALTER COLUMN "data_atualizacao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(64);

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_usuario_id_expira_em_idx" ON "refresh_tokens"("session_id", "usuario_id", "expira_em");
