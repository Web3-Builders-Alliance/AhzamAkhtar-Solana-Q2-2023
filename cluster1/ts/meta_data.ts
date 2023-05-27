import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import * as bs58 from "bs58";
import wallet from "./wba-wallet";
const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq");

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
  Buffer.from("metadata"),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

(async () => {
  try {
    let tx = new Transaction().add(
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadata_pda,
          mint: mint,
          mintAuthority: keypair.publicKey,
          payer: keypair.publicKey,
          updateAuthority: keypair.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name: "Something cooking token",
              symbol: "cooking",
              uri: "https://fnt7ekvmo3hbc5tommi67k6q5a4lz7wk67rtzza7hasnasg2qxqa.arweave.net/K2fyKqx2zhF2bmMR76vQ6Di8_sr34zzkHzgk0EjaheA?ext=png",
              sellerFeeBasisPoints: 100,
              creators: [
                { address: keypair.publicKey, verified: true, share: 100 },
              ],
              collection: null,
              uses: null,
            },
            isMutable: true,
            collectionDetails: null,
          },
        }
      )
    );

    let txhash = await sendAndConfirmTransaction(connection, tx, [keypair]);
    console.log("Success ...!!", txhash);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

// Output - 5WmvoCkL5MeGLywPtytG8r7ULhDbgrA3XrSJhFzBh1GuVuAeEWPWwjkGDNaFeZ6gPCXaDKLtSibz2p634nr1izQD
// After you check 5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq on explorer you will find that the name has been updataed from unknow to something cool
