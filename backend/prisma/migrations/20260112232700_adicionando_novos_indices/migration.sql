-- CreateIndex
CREATE INDEX "produtos_cj_api_id_marca_idx" ON "produtos"("cj_api_id", "marca");

-- CreateIndex
CREATE INDEX "produtos_cj_api_id_nome_idx" ON "produtos"("cj_api_id", "nome");

-- CreateIndex
CREATE INDEX "produtos_cj_api_id_descricao_idx" ON "produtos"("cj_api_id", "descricao");
