import { Connection, Keypair, SystemProgram, PublicKey} from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address  } from "@project-serum/anchor"
import {WbaVault , IDL} from "../cluster1/wba_valult"
import wallet from "./wba-wallet"

import * as bs58 from "bs58";

//const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const keypair = Keypair.fromSecretKey(
    bs58 .decode(
      wallet
    )
  );

const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("AhzamAkhtar", "utf8");

const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});
// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

const vaultState = Keypair.generate();
console.log(`vaultstate keypair : ${vaultState.publicKey.toBase58()}`);
const vault_auth_seeds = [Buffer.from("auth"),vaultState.publicKey.toBuffer()];
const vaultAuth = PublicKey.findProgramAddressSync(
    vault_auth_seeds ,
    program.programId
)[0];

const vault_seeds = [Buffer.from("vault") , vaultAuth.toBuffer()];
const vault = PublicKey.findProgramAddressSync(vault_seeds , program.programId)[0];

(async () => {
    try {
        const txhash = await program.methods
        . initialize()
        .accounts({
           owner : keypair.publicKey,
           vaultState : vaultState.publicKey,
           vaultAuth,
           vault,
           systemProgram : SystemProgram.programId
        })
        .signers([
            keypair,
            vaultState
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();