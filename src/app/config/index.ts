import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// Optional: Validate required environment variables
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is missing in .env file");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is missing in .env file");
}

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,

  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET!,
    RESET_PASSWORD_TOKEN_EXP_IN: process.env.RESET_PASSWORD_TOKEN_EXP_IN || "15m",
    RESET_PASSWORD_LINK: process.env.RESET_PASSWORD_LINK!,
  },
};



 