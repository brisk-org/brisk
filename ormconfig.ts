import { ConnectionOptions } from "typeorm";
import path from "path";
const production = process.env.NODE_ENV === "production";
const connection: ConnectionOptions = {
  type: "postgres",
  database: "brisk-systems",
  username: "postgres",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5433,
  entities: [path.join(__dirname, "/src/entities/*.{ts,js}")],
  migrations: [path.join(__dirname, "/src/migrations/*.{ts,js}")],
  subscribers: [path.join(__dirname, "/src/subscribers/*.{ts,js}")],
  cli: {
    entitiesDir: "/src/entities",
    migrationsDir: "/src/migrations",
    subscribersDir: "/src/subscriber",
  },
  synchronize: !production,
  logging: !production,
};

export default connection;
