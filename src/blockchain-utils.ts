import crypto from "crypto";
import algosdk from "algosdk";
import { algodClient, MASTER_ACCOUNT } from "./config";

/**
 * Generates a nonce and hashes the combined string arguments.
 * @param {...string} args - Any number of string arguments.
 * @returns {{ nonce: string, hash: string }} - The generated nonce and hash.
 */
export function generateNonceAndHash(...args: string[]): {
  nonce: string;
  hash: string;
} {
  if (args.length === 0) {
    throw new Error("At least one string argument is required.");
  }

  // Generate a random nonce (16 bytes, hex encoded)
  const nonce = crypto.randomBytes(16).toString("hex");

  // Concatenate the arguments with the nonce
  const combinedString = nonce + args.join("");

  // Compute SHA-256 hash
  const hash = crypto.createHash("sha256").update(combinedString).digest("hex");

  return { nonce, hash };
}

export async function makeHashTransaction(hash: string) {
  const params = await algodClient.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: MASTER_ACCOUNT.addr,
    receiver: MASTER_ACCOUNT.addr,
    amount: 0,
    note: encodeNote(hash),
    suggestedParams: params,
  });
  const signedTxn = txn.signTxn(MASTER_ACCOUNT.sk);
  await algodClient.sendRawTransaction(signedTxn).do();
  await algosdk.waitForConfirmation(algodClient, txn.txID(), 3);
  return txn.txID();
}

export const encodeNote = (text: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
};

export const createCertificate = async (
  name: string,
  sport: string,
  university: string,
  teamName: string,
  position: string,
  tournamentName: string,
  tournamentVenue: string,
  eventStart: string,
  eventEnd: string,
  certificateNo: string
) => {
  const { nonce, hash } = generateNonceAndHash(
    name.toUpperCase(),
    sport.toUpperCase(),
    university.toUpperCase(),
    teamName.toUpperCase(),
    position.toUpperCase(),
    tournamentName.toUpperCase(),
    tournamentVenue.toUpperCase(),
    eventStart.toUpperCase(),
    eventEnd.toUpperCase(),
    certificateNo.toUpperCase()
  );
  const txid = await makeHashTransaction(hash);
  return { txid, nonce, hash };
};
