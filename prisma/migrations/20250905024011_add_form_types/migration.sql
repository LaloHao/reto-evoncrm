/*
  Warnings:

  - The values [contactCreated,contactUpdated,contactDeleted] on the enum `WebhookTrigger` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactPageVisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContactToContactTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('SIMPLE', 'MULTI_STEP');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT_INPUT', 'DATE_INPUT', 'TEXT_AREA');

-- AlterEnum
BEGIN;
CREATE TYPE "WebhookTrigger_new" AS ENUM ('formSubmitted');
ALTER TABLE "Webhook" ALTER COLUMN "triggers" TYPE "WebhookTrigger_new"[] USING ("triggers"::text::"WebhookTrigger_new"[]);
ALTER TYPE "WebhookTrigger" RENAME TO "WebhookTrigger_old";
ALTER TYPE "WebhookTrigger_new" RENAME TO "WebhookTrigger";
DROP TYPE "WebhookTrigger_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ContactActivity" DROP CONSTRAINT "ContactActivity_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactComment" DROP CONSTRAINT "ContactComment_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactComment" DROP CONSTRAINT "ContactComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactNote" DROP CONSTRAINT "ContactNote_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactNote" DROP CONSTRAINT "ContactNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPageVisit" DROP CONSTRAINT "ContactPageVisit_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPageVisit" DROP CONSTRAINT "ContactPageVisit_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactTask" DROP CONSTRAINT "ContactTask_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToContactTag" DROP CONSTRAINT "_ContactToContactTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToContactTag" DROP CONSTRAINT "_ContactToContactTag_B_fkey";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "ContactActivity";

-- DropTable
DROP TABLE "ContactComment";

-- DropTable
DROP TABLE "ContactImage";

-- DropTable
DROP TABLE "ContactNote";

-- DropTable
DROP TABLE "ContactPageVisit";

-- DropTable
DROP TABLE "ContactTag";

-- DropTable
DROP TABLE "ContactTask";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "_ContactToContactTag";

-- DropEnum
DROP TYPE "ContactRecord";

-- DropEnum
DROP TYPE "ContactStage";

-- DropEnum
DROP TYPE "ContactTaskStatus";

-- CreateTable
CREATE TABLE "Form" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "infoTop" TEXT,
    "infoBottom" TEXT,
    "type" "FormType" NOT NULL,
    "steps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicFormShare" (
    "id" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "form" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PublicFormShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_Form_organizationId" ON "Form"("organizationId");

-- CreateIndex
CREATE INDEX "IX_Form_createdBy" ON "Form"("createdBy");

-- CreateIndex
CREATE INDEX "IX_Form_updatedBy" ON "Form"("updatedBy");

-- CreateIndex
CREATE INDEX "IX_PublicFormShare_formId" ON "PublicFormShare"("formId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicFormShare" ADD CONSTRAINT "PublicFormShare_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
