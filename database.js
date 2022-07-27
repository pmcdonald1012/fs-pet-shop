import pg from "pg";
//create a new pool instance, connect it to database and to our localhost/port.
export const pool = new pg.Pool({
    database: 'petshop',
    host: 'localhost',
    port: 5432,
});

//export pool to be used in another file
