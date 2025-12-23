-- DropIndex
DROP INDEX "sessoes_session_id_usuario_id_dispositivo_hash_expira_em_idx";

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");

-- CreateIndex
CREATE INDEX "sessoes_expira_em_idx" ON "sessoes"("expira_em");

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_dispositivo_hash_expira_em_idx" ON "sessoes"("usuario_id", "dispositivo_hash", "expira_em");
