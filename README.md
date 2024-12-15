[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=16613009)

# CSC 667/867 Fall 2024 Term Project

## Team Members

-   John Carter
-   Karina Alvarado Mendoza
-   Randale Reyes
-   Sulav Jung Hamal

## PostgreSQL Instructions

### Installation

download from here and follow install instructions for your system

[PostgreSQL Download](https://www.postgresql.org/download/)

### Creating and Accessing DB

easiest way to do this is through postgresql built-in cli:

reference: [postgresql cheatsheet](https://tomcam.github.io/postgres/)

```shell
# for mac
psql postgres

# for windows terminal
psql -U postgres
```

Create the database (you could use any name u want but for this
example ill stick with pgdb)

```sql
CREATE DATABASE pgdb;
```

Create user + password (u can use anything) and grant privileges

```sql
CREATE USER codingblocks with PASSWORD 'student';
GRANT ALL PRIVILEGES ON DATABASE pgdb TO codingblocks;
```

### Set-up Local Environment

finally, to connect the web server to the database, we need to add an entry
in the `.env` file at the root directory of the project

```ini
# database connection
DATABASE_URL=postgres://codingblocks:student:5432/pgdb
```

### setting up the db for the webapp

to actually have the webapp communicate with the db, we still need to setup the schema, tables, etc
run  this command in the root dir of the project
```shell
npm run db:migrate
```

you should get an final message that migrations are completed.
to test, register and login through the webapp
