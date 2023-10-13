const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

// An array to store test job IDs
const testJobIds = [];

/**
 * Before all tests, perform common setup tasks.
 * - Clear companies and users tables
 * - Insert sample data into companies, jobs, and users tables
 */
async function commonBeforeAll() {
  // Delete existing data from companies and users tables
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM users");

  // Insert sample data into companies table
  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  // Insert sample data into jobs table and store their IDs in testJobIds array
  const resultsJobs = await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ('Job1', 100, '0.1', 'c1'),
           ('Job2', 200, '0.2', 'c1'),
           ('Job3', 300, '0', 'c1'),
           ('Job4', NULL, NULL, 'c1')
    RETURNING id`);
  testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.id));

  // Insert sample data into users table
  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  // Insert sample data into applications table
  await db.query(`
        INSERT INTO applications(username, job_id)
        VALUES ('u1', $1)`,
      [testJobIds[0]]);
}

/**
 * Before each test, start a transaction.
 */
async function commonBeforeEach() {
  await db.query("BEGIN");
}

/**
 * After each test, roll back the transaction.
 */
async function commonAfterEach() {
  await db.query("ROLLBACK");
}

/**
 * After all tests, end the database connection.
 */
async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
};
