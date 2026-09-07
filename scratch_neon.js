const { parse } = require('pg-connection-string');

const url = "postgresql://neondb_owner:npg_TIbE2lkCFtA9@ep-shiny-queen-aoup8zkf.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30";
console.log(parse(url));
