-- DropIndex
DROP INDEX "refresh_tokens_session_id_usuario_id_expira_em_idx";

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_usuario_id_dispositivo_hash_expir_idx" ON "refresh_tokens"("session_id", "usuario_id", "dispositivo_hash", "expira_em");
