import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { appRouter, createContext, createExpressMiddleware } from "trpc";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 }));
app.use(morgan("dev"));

function getBaseUrl() {
	if (process.env.FRONTEND_URL) {
		return `https://${process.env.FRONTEND_URL}`;
	}
	// assume localhost
	return `http://localhost:${process.env.NEXT_PUBLIC_CLIENT_PORT}`;
}

const allowedOrigins = [getBaseUrl(), "http://localhost:3000"];
app.disable("x-powered-by");
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) {
				return callback(null, true);
			}
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg = "The CORS policy for this site does not allow access from the specified Origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
		methods: ["GET", "POST"],
	}),
);
app.use(cookieParser());

app.get("/test", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.use("/auth", authRouter);

app.use(
	"/api/trpc",
	createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

app.listen(parseInt(process.env.PORT ?? "3001"), () =>
	console.log(
		`🚀 Server ready at: ${
			process.env.FRONTEND_URL ? process.env.FRONTEND_URL : `http://localhost:${process.env.PORT ?? 3001}`
		}`,
	),
);
