import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address , BN  } from "@project-serum/anchor"
import {WbaVault , IDL} from "../cluster1/wba_valult"
import wallet from "./wba-wallet"

import * as bs58 from "bs58";
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";


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

const vaultState = new PublicKey("6bUESuRxjczLzQjWEmYBbYymHd9KeLofJQLRbEsjYt1A")

const vault_auth_seeds = [Buffer.from("auth"),vaultState.toBuffer()];
const vaultAuth = PublicKey.findProgramAddressSync(
    vault_auth_seeds ,
    program.programId
)[0];

//const vault_seeds = [Buffer.from("vault") , vaultAuth.toBuffer()];
//const vault = PublicKey.findProgramAddressSync(vault_seeds , program.programId)[0];

(async () => {
    try {

        const mint = new PublicKey("5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq");

        let ownerata = await getOrCreateAssociatedTokenAccount(
            connection,
             keypair,
             mint,
             keypair.publicKey
        )

        let vaultata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            vaultAuth,
            true
        )

        const txhash = await program.methods
        . depositSpl(new BN(0.01 * LAMPORTS_PER_SOL))
        .accounts({
           owner : keypair.publicKey,
           vaultState : vaultState,
           vaultAuth,
           systemProgram : SystemProgram.programId,
           ownerAta : ownerata.address,
           vaultAta : vaultata.address,
           tokenMint : mint,
           tokenProgram : TOKEN_PROGRAM_ID
        })
        .signers([
            keypair,
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();