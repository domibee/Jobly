const { BadRequestError } = require("../expressError");

/** 
 * Updates the database partially. Data can include keys and their corresponding values.
 * 
 * - `dataToUpdate`: An object containing the data to be updated.
 * - `jsToSql`: A function used to convert JS data of the column name and index into an SQL query.
 * 
 * Throws a `BadRequestError` if no data is found.
 * 
 * - `keys`: An array of keys extracted from the `dataToUpdate`.
 * - `cols`: An array of strings in the format '"column_name"=$1' representing the columns to be updated.
 * - `setCols`: A comma-separated string of `cols` for use in an SQL query's SET clause.
 * - `values`: An array of values extracted from the `dataToUpdate` to be used in the SQL query.
 * 
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
