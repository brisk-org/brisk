import { ConnectionOptions } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const production = process.env.NODE_ENV === "production";

const connection: ConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, "/src/entities/*.{ts,js}")],
  migrations: [path.join(__dirname, "/src/migrations/*.{ts,js}")],
  subscribers: [path.join(__dirname, "/src/subscribers/*.{ts,js}")],
  ssl: false,
  cli: {
    entitiesDir: "/src/entities",
    migrationsDir: "./src/migrations",
    subscribersDir: "/src/subscriber",
  },
  synchronize: !production,
  logging: false,
};

export default connection;
