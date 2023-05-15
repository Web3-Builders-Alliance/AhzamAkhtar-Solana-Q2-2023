import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
//import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

import * as bs58 from "bs58";
import wallet from "./wba-wallet";
const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq");

// Recipient address
const to = new PublicKey("EZwmRqCe7EzQMvDxX9eqKgCG4oyACMh2Yqg9pp7qookQ");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const from_account = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    // Get the token account of the toWallet address, and if it does not exist, create it

    const to_account = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );
    // Transfer the new token to the "toTokenAccount" we just created

    const txhash = transfer(
      connection,
      keypair,
      from_account.address,
      to_account.address,
      keypair.publicKey,
      1_000_000 * 50
    );

    console.log("Success ! Check", txhash);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

// Output = EZwmRqCe7EzQMvDxX9eqKgCG4oyACMh2Yqg9pp7qookQ
