const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool } = require('@neondatabase/serverless');

console.log("PrismaNeon constructor length:", PrismaNeon.length);
try {
  const adapter = new PrismaNeon({ url: "postgresql://..." });
  console.log("Created with options object");
} catch(e) {
  console.log("Failed with options object", e.message);
}
