import { NextResponse } from "next/server";
import { Pool } from "pg";
import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

// Generate temporary IAM auth token
const signer = new Signer({
  hostname: process.env.PGHOST!,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER!,
  region: process.env.AWS_REGION,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
    clientConfig: { region: process.env.AWS_REGION },
  }),
});

// PostgreSQL pool using temporary token
const pool = new Pool({
  host: process.env.PGHOST!,
  user: process.env.PGUSER!,
  database: process.env.PGDATABASE!,
  password: () => signer.getAuthToken(),
  port: Number(process.env.PGPORT),
  ssl: { rejectUnauthorized: false },
});

export async function POST() {
  try {
    // Create tables if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS trials (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        delay INT NOT NULL,
        reaction_time INT NOT NULL
      );
    `);

    return NextResponse.json({ status: "success", message: "Tables created" });
  } catch (err) {
    console.error("DB init error:", err);
    return NextResponse.json({ status: "error", message: (err as Error).message });
  } finally {
    await pool.end();
  }
}
