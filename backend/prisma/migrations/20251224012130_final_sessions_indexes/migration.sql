/*
  Warnings:

  - Added the required column `data_atualizacao` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "data_atualizacao" TIMESTAMPTZ(6) NOT NULL;
