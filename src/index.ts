import "reflect-metadata";
require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { buildSchema } from "type-graphql";
import Context, { Req } from "./constants/Context";
import { Connection, createConnection, getConnection } from "typeorm";
// import { PubSub } from "graphql-subscriptions";
import { createPubSub, PubSub } from "graphql-yoga";
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

import { WebSocketServer } from "ws";

import { useServer } from "graphql-ws/lib/use/ws";
const app = express();

export const pubSub = createPubSub<{}>();

const main = async function () {
  await createConnection(connection);

  // await seed();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(cookieParser());
  //
  // app.use(fileUpload());
  //
  //

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.

    server: httpServer,

    // Pass a different path here if app.use

    // serves expressMiddleware at a different path

    path: "/subscriptions",
  });

  const schema = await buildSchema({
    resolvers,
    // dateScalarMode: "timestamp",

    authChecker,
    pubSub,
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer<Context>({
    schema,
    // subscriptions: {
    //   path: "/subscriptions",
    //   onConnect: () => console.log("Connected"),
    //   onDisconnect: () => console.log("Disconnect"),
    // },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({
            footer: false,
            embed: {
              endpointIsEditable: true,
            },
          }),
    ],
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
        pubsub: pubSub,
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
