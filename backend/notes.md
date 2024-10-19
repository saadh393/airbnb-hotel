# Bed And Breakfast

## Questions

- ~~A dev branch already exists in my github repo, but Raihan isn't able to pull that branch or access it. Should he create his own dev branch on his end? Or is there a way that he can access the same dev branch that I"m working on~~?

- ~~Rahan pulled my repo and doesn't have a .env file (I'm assuming because it's in my .gitignore). How should we handle this?~~

- ~~With respect to 'get Spot by userId' how can we alias 'User' to be 'Owner' as it is in the example res~~

- ~~Can we change the 'default branch' on Render.com such that we can deploy test from the 'dev' branch instead of Main? This will allow us to test in both local and live environments before pushing to main~~

## Notes

### ~~Change DEFAULT CHARACTER LENGTH of URL ATTRIBUTE on SpotImages MIGRATION FILE~~:


    Eventually we need to modify character length property of the 'URL' attribute in the SpotImage migration file.

    Right now, in our live environment, SpotImage seeding will fail if the URL is longer than 250 characters for the given spotImage. This is very limiting, and we need to change it before the end of the project.

    Right now we have a constraint on the model file, but not on the migration file. Maybe adding the (2048) to replace the default (250) character limit on the migration file will fix this.

    In order to make that change, we first need to modify the migration file. After that, we need to manually drop the database on Render so that it will re-build the database using the updated migration file. Here is the command to

    The command to open the PostgreSQL Database in our terminal is: PGPASSWORD=bpBTOrAC90SK9bmz7icVIeVnBspsvFPl psql -h dpg-cs2mmr0gph6c738688fg-a.oregon-postgres.render.com -U app_academy_projects_hlgc_user app_academy_projects_hlgc

    The command to drop the Database is: DROP SCHEMA bed_and_breakfast_schema CASCADE;

    After we've dropped the database following modification of the migration file, manually re-deploy the bed-and-breakfast web service using the 'Clear build cache and deploy' command from the Render.com GUI.

## Goals

### Route: Create A Spot

#### Notes

- Recall that '/api/spots' is the default route for the spots router. So if we want to post to '/api/spots' we need only post to '/' in practice.

- This route requires authentication

- Error Handling: Consider adding error-handling to the migration and model files by using constraints and validations, instead of trying to create a new error-handler or create the errors manually in route handler.

#### Plan

1. authenticate user
2. retrieve data from request body, save to variable
3.

#### Setup

```js
router.post("/", requireAuth, async (req, res, next) => {

    try {



    } catch(err) {
        next(err);
    };
});
```
---

### Create Additional SpotImages Seeder

#### Git Setup
    Git branch (check branch)
    git checkout dev
    git checkout -b add-extra-spotImages-seeds

    git add .
    git commit -m "message"
    git push origin add-extra-spotImages-seeds

    git checkout dev
    git merge add-extra-spotImages-seeds

    PR from Github (for push to main)

## Sequelize Files and Commands

Generate Model File:

    npx sequelize-cli model:generate --name <ModelName> --attributes <field1>:<datatype1>,<field2>:<datatype2>,<field3>:<datatype3>

Add a blank migration file

    npx sequelize migration:generate --name <name-of-migration-file>

Add a blank seeder file

    npx sequelize-cli seed:generate --name <name-of-seed-file>

Initialize Sequelize:

    npx sequelize-cli init

Run Migrations:

    npx dotenv sequelize db:migrate'

Un-migrate all migrations

    npx dotenv sequelize-cli db:migrate:undo:all

Run all seeder files

    npx dotenv sequelize-cli db:seed:all

Undo All Seeder Files

    npx dotenv sequelize db:seed:undo:all
