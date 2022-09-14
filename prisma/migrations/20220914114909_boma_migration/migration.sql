-- CreateEnum
CREATE TYPE "State" AS ENUM ('Propose', 'Open', 'Closed');

-- CreateEnum
CREATE TYPE "Permit" AS ENUM ('Read', 'Create', 'Update', 'Delete');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "date" DATE,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Access" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permit" "Permit" NOT NULL,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Access_project_id_user_id_permit_key" ON "Access"("project_id", "user_id", "permit");

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


INSERT INTO "Project"  ( name, state, date) VALUES ( 'Project A', 'Propose', '2022-01-01'),
        ( 'Project B', 'Open', '2022-02-09'),
        ( 'Project C', 'Open', '2022-04-13');

INSERT INTO "Access" (project_id, user_id, permit)
VALUES  (1, 1, 'Read'),
        (1, 1,'Create'),
        (1, 1,'Update'),
        (1, 1,'Delete'),
        (1, 2,'Read'),
        (1, 2,'Create'),
        (1, 3,'Read'),
        (2, 1,'Read'),
        (2, 1,'Create'),
        ( 2, 1,'Update'),
        ( 2, 1,'Delete'),
        ( 2, 2,'Read'),
        ( 2, 2,'Create'),
        ( 2, 2, 'Update'),
        ( 3, 1, 'Read'),
        ( 3, 1, 'Create'),
        ( 3, 1, 'Update'),
        ( 3, 1, 'Delete'),
        ( 3, 2, 'Read'),
        ( 3, 3, 'Read'),
        ( 3, 3, 'Create'),
        ( 3, 3, 'Update'),
        ( 3, 3, 'Delete');