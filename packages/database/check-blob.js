require('dotenv').config({ path: __dirname + '/../../.env' });
const { list } = require('@vercel/blob');

async function main() {
  const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  console.log("Total blobs:", blobs.length);
  console.log("Sample blob:", blobs[0]);
}

main().catch(console.error);
