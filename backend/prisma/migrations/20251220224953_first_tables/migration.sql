-- CreateTable
CREATE TABLE "apis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "api_key" VARCHAR(255) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "usuario_id" UUID NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" VARCHAR(13) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "marca" VARCHAR(70) NOT NULL,
    "descricao" VARCHAR(300) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "imagem" VARCHAR(255),
    "importado" BOOLEAN NOT NULL DEFAULT false,
    "api_id" UUID NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apis_api_key_key" ON "apis"("api_key");

-- CreateIndex
CREATE INDEX "apis_usuario_id_idx" ON "apis"("usuario_id");

-- CreateIndex
CREATE INDEX "produtos_api_id_idx" ON "produtos"("api_id");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_api_id_codigo_key" ON "produtos"("api_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "apis" ADD CONSTRAINT "apis_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_api_id_fkey" FOREIGN KEY ("api_id") REFERENCES "apis"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
