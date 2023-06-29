import pg from "pg";

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }
    const pool = new pg.Pool({
        connectionString: "postgresql://postgres:senha5432@localhost:5432/petshop"
    });
    global.connection = pool;

    return pool.connect();
}

export {
    connect
}