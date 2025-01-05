import mysql from "mysql2";

export const db = mysql
  .createPool({
    user: "user",
    password: "user_password",
    host: "localhost",
    port: "3306",
    database: "salesmanagementproject",
  })
  .promise();
