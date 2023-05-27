import { Keypair, Connection, Commitment, PublicKey } from "@solana/web3.js";

import { createMint, getMint } from "@solana/spl-token";

import * as bs58 from "bs58";

import wallet from "./wba-wallet";

const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  //initializing the mint
  try {
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6
    );

    console.log(mint.toBase58());
    //output - 5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq

    //checking mint supply (initially it has zero supply)
    const mintInfo = await getMint(connection, mint);
    console.log("Supply", mintInfo);
    //output - Supply {
    //   address: PublicKey [PublicKey(5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq)] {
    //     _bn: <BN: 41610c9db1bce610b1a6ca79d94ddddf73a765e58384c53532b98163033de746>
    //   },
    //   mintAuthority: PublicKey [PublicKey(AVphMo9JsWV5279Z2Sc1yNC8T6KzJVCcNog6iCY53z2t)] {
    //     _bn: <BN: 8d1b5ff5e971ff52dd8fcc784f75a15f9fd4ae5e9d2cbf77223d6b2c4e4b12a1>
    //   },
    //   supply: 0n,
    //   decimals: 6,
    //   isInitialized: true,
    //   freezeAuthority: null,
    //   tlvData: <Buffer >
    //}
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

//The unique identifier of the token is 5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq.
