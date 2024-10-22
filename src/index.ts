import "reflect-metadata";
require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import Context, { Req } from "./constants/Context";
import { Connection, createConnection, getConnection } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import resolvers from "./resolvers";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { createTokens } from "./utils/createTokens";
import { authChecker } from "./functions/authChecker";
// import fileUpload from "express-fileupload";
import connection from "../ormconfig";
// import seed from "./utils/seed";
import cors from "cors";

const app = express();

const main = async function () {
  await createConnection(connection);

  // await seed();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(cookieParser());
  // app.use(fileUpload());

  const httpServer = http.createServer(app);
  const server = new ApolloServer<Context>({
    schema: await buildSchema({
      resolvers,
      dateScalarMode: "timestamp",
      authChecker,
    }),
    // subscriptions: {
    //   path: "/subscriptions",
    //   onConnect: () => console.log("Connected"),
    //   onDisconnect: () => console.log("Disconnect"),
    // },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  //
  // app.use(async (req: any, res, next) => {
  //   const refreshToken = req.cookies["jwt-refresh"];
  //   const accessToken = req.cookies["jwt-access"];
  //   if (!refreshToken && !accessToken) return next();
  //   try {
  //     const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any;
  //     req.user = data;
  //     return next();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   if (!refreshToken) return next();
  //
  //   let data;
  //   try {
  //     data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
  //   } catch {
  //     return next();
  //   }
  //   const user = await User.findOne(data.userId);
  //   if (!user) return next();
  //
  //   const tokens = createTokens(user);
  //
  //   res.cookie("jwt-refresh", tokens.refreshToken);
  //   res.cookie("jwt-access", tokens.accessToken);
  //   next();
  // });

  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req: req as Req,
        res,
        connection: getConnection(),
        pubsub: new PubSub(),
      }),
    }),
  );

  const PORT = process.env.PORT ?? 4000;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, () => {
      console.log(`Server Started at localhost:${PORT}`);
      resolve();
    }),
  );
};

main();
