/*
  Warnings:

  - You are about to drop the column `api_id` on the `produtos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cj_api_id,codigo]` on the table `produtos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cj_api_id` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "produtos" DROP CONSTRAINT "produtos_api_id_fkey";

-- DropIndex
DROP INDEX "produtos_api_id_codigo_key";

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "api_id",
ADD COLUMN     "cj_api_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "produtos_cj_api_id_codigo_key" ON "produtos"("cj_api_id", "codigo");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_cj_api_id_fkey" FOREIGN KEY ("cj_api_id") REFERENCES "cj_apis"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
