/*
  Warnings:

  - Added the required column `Category` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "Category" TEXT NOT NULL;
