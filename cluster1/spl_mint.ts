import { Connection, Keypair, PublicKey, Commitment } from "@solana/web3.js";

import * as bs58 from "bs58";

import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import wallet from "./wba-wallet";
const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq");

(async () => {
  try {
    //  //Let's mint some. First create an account to hold a balance of the new 5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq token:
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(`Your ata is: ${tokenAccount.address.toBase58()}`);

    // check account balance
    const tokenAccountInfo = await getAccount(connection, tokenAccount.address);
    console.log("tokenAccountInfo.amount", tokenAccountInfo.amount);

    //Mint 100 tokens into the account:
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      tokenAccount.address,
      keypair.publicKey,
      100000000 //// because decimals for the mint are set to 6
    );
    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }

  //Output
  //  Your ata is: cuRktuoDs98y9duEd2kCC275dpbpqviVX5FvsM7vBgk
  // tokenAccountInfo.amount 0n
  // Your mint txid: 3qjJ4xtewiVYJXyedCHFjS5MibSaetQsBDusvq6LgoR1uw5Vc7FxFFQXAFpJNLfEEJGmTA4K9UKQ7qzoXCzgwe3X

  // after runnning it , check on explorer for tokenAccount = cuRktuoDs98y9duEd2kCC275dpbpqviVX5FvsM7vBgk it will
  // show balance 100.000000 because because decimals for the mint are set to 6 on spl_init
})();
