/*
  Warnings:

  - You are about to alter the column `api_key` on the `apis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "apis" ADD COLUMN     "data_desativacao" TIMESTAMPTZ(6),
ADD COLUMN     "ultimo_uso" TIMESTAMPTZ(6),
ALTER COLUMN "api_key" SET DATA TYPE VARCHAR(64);
