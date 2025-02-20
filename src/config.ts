import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const ALGOD_TOKEN = process.env.ALGOD_TOKEN || "a".repeat(64);
export const ALGOD_URL =
  process.env.ALGOD_URL || "https://testnet-idx.4160.nodely.dev";
export const ALGOD_PORT = Number(process.env.ALGOD_PORT) || 443;

if (!process.env.MASTER_WALLET_MNEMONIC) {
  throw new Error("MASTER_WALLET_MNEMONIC environment variable is required.");
}
export const algodClient = new algosdk.Algodv2(
  ALGOD_TOKEN,
  ALGOD_URL,
  ALGOD_PORT
);
export const MASTER_ACCOUNT = algosdk.mnemonicToSecretKey(
  process.env.MASTER_WALLET_MNEMONIC
);
export const MONGO_URI = process.env.MONGO_URI || "";

// azure
export const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
export const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME;
export const AZURE_ACCOUNT_KEY = process.env.AZURE_ACCOUNT_KEY;
