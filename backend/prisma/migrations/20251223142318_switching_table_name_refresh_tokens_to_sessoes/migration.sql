/*
  Warnings:

  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_usuario_id_fkey";

-- DropTable
DROP TABLE "refresh_tokens";

-- CreateTable
CREATE TABLE "sessoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "session_id" UUID NOT NULL,
    "lembre_me" BOOLEAN NOT NULL DEFAULT false,
    "dispositivo_nome" VARCHAR(100) NOT NULL,
    "dispositivo_hash" VARCHAR(64) NOT NULL,
    "data_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_em" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_unico" ON "sessoes"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_session_id_key" ON "sessoes"("session_id");

-- CreateIndex
CREATE INDEX "sessoes_session_id_usuario_id_dispositivo_hash_expira_em_idx" ON "sessoes"("session_id", "usuario_id", "dispositivo_hash", "expira_em");

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
