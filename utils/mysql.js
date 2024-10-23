import mysql from 'mysql2/promise';

if (!process.env.MYSQL_URI) {
  throw new Error('Invalid/Missing environment variable: "MYSQL_URI"');
}

const uri = process.env.MYSQL_URI;
let connection;
let connectionPromise;

if (process.env.NODE_ENV === "development") {
  if (typeof globalWithMysql === "undefined") {
    global.globalWithMysql = {};
  }

  if (!globalWithMysql._mysqlConnectionPromise) {
    connection = mysql.createPool(uri);
    globalWithMysql._mysqlConnectionPromise = connection.getConnection();
  }
  connectionPromise = globalWithMysql._mysqlConnectionPromise;
} else {
  connection = mysql.createPool(uri);
  connectionPromise = connection.getConnection();
}

export default connectionPromise;
