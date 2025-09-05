-- AlterTable
ALTER TABLE "PublicFormShare" ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled Form';
