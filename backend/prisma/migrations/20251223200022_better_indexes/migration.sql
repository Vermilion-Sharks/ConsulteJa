-- DropIndex
DROP INDEX "sessoes_expira_em_idx";

-- DropIndex
DROP INDEX "sessoes_usuario_id_dispositivo_hash_expira_em_idx";

-- DropIndex
DROP INDEX "sessoes_usuario_id_idx";

-- CreateIndex
CREATE INDEX "sessoes_token_session_id_usuario_id_dispositivo_hash_expira_idx" ON "sessoes"("token", "session_id", "usuario_id", "dispositivo_hash", "expira_em");

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_data_criacao_idx" ON "sessoes"("usuario_id", "data_criacao" DESC);
