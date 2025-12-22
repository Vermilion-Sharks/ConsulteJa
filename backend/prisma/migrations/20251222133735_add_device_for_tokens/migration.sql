/*
  Warnings:

  - Added the required column `dispositivo_hash` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dispositivo_nome` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "dispositivo_hash" VARCHAR(64) NOT NULL,
ADD COLUMN     "dispositivo_nome" VARCHAR(100) NOT NULL;
