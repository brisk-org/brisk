import "reflect-metadata";
require("dotenv").config();
import express, { Response } from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Context, { Req } from "./constants/Context";
import { createConnection, getConnection } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import resolvers from "./resolvers";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { createTokens } from "./utils/createTokens";
import { authChecker } from "./functions/authChecker";
import fileUpload from "express-fileupload";
import connection from "../ormconfig";

const app = express();

const main = async function () {
  await createConnection(connection);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(fileUpload());
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      dateScalarMode: "timestamp",
      authChecker,
    }),
    context: ({ req, res }: { req: Req; res: Response }): Context => ({
      req,
      res,
      connection: getConnection(),
      pubsub: new PubSub(),
    }),
    subscriptions: {
      path: "/subscriptions",
      onConnect: () => console.log("Connected"),
      onDisconnect: () => console.log("Disconnect"),
    },
  });

  app.use(async (req: any, res, next) => {
    const refreshToken = req.cookies["jwt-refresh"];
    const accessToken = req.cookies["jwt-access"];
    if (!refreshToken && !accessToken) return next();
    try {
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any;
      req.user = data;
      return next();
    } catch (error) {
      console.log(error);
    }
    if (!refreshToken) return next();

    let data;
    try {
      data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
    } catch {
      return next();
    }
    const user = await User.findOne(data.userId);
    if (!user) return next();

    const tokens = createTokens(user);

    res.cookie("jwt-refresh", tokens.refreshToken);
    res.cookie("jwt-access", tokens.accessToken);
    next();
  });
  // app.use((_, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });

  const httpServer = http.createServer(app);
  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);
  const PORT = process.env.PORT ?? 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server Started at localhost:${PORT}`);
  });
};

main();
