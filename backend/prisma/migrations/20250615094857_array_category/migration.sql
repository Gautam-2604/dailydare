/*
  Warnings:

  - The `Category` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "Category",
ADD COLUMN     "Category" TEXT[];
