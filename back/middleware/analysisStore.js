import duckdb from "duckdb";
const { Database } = duckdb;
import { v4 as uuidv4 } from "uuid";
import { getCache, setCache } from "./Redis.js";

const db = new Database(":memory:");

// Store the flat data in Redis
export const createAndStoreDataModel = async (flatData) => {
  const dataId = uuidv4();
  await setCache(`data-model-data:${dataId}`, flatData, 3600);
  return dataId;
};

// Get cached data and generate a table name
export const getDataModelAndTableName = async (dataId) => {
  const cachedData = await getCache(`data-model-data:${dataId}`);
  if (!cachedData) return { flatData: null, tableName: null };
  const tableName = `analysis_${dataId.replace(/-/g, "_")}`;
  return { flatData: cachedData, tableName };
};

// ✅ Fully fixed filtered data function
export const getFilteredData = (flatData, filters) => {
  return new Promise(async (resolve, reject) => {
    if (!flatData || flatData.length === 0)
      return reject(new Error("No data found for filtering."));

    // Return full dataset if no filters
    if (!filters || filters.length === 0) {
      console.log("⚡ No filters provided → returning full dataset");
      return resolve(flatData);
    }

    const tempTableName = `temp_analysis_${uuidv4().replace(/-/g, "_")}`;
    const columns = Object.keys(flatData[0]);
    const columnDefinitions = columns.map((col) => `"${col}" VARCHAR`).join(", ");

    const con = db.connect();

    try {
      // 1️⃣ Create temporary table
      await con.run(`CREATE TABLE ${tempTableName} (${columnDefinitions});`);

      // 2️⃣ Insert all rows at once using VALUES
      const valuesStr = flatData
        .map(
          (row) =>
            `(${columns
              .map((col) => `'${String(row[col]).replace(/'/g, "''")}'`)
              .join(", ")})`
        )
        .join(", ");

      await con.run(`INSERT INTO ${tempTableName} VALUES ${valuesStr};`);

      // 3️⃣ Build WHERE clause safely (case-insensitive & trimmed)
      const whereClause = filters
        .map(
          (f) =>
            `LOWER(TRIM("${f.field}")) = LOWER(TRIM('${String(f.value).replace(
              /'/g,
              "''"
            )}'))`
        )
        .join(" AND ");

      const query = `SELECT * FROM ${tempTableName} ${
        whereClause ? "WHERE " + whereClause : ""
      };`;

      console.log("Running DuckDB query:", query);

      // 4️⃣ Execute query
      con.all(query, (err, result) => {
        if (err) {
          console.error("DuckDB query error:", err);
          return reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    } finally {
      con.close();
    }
  });
};
