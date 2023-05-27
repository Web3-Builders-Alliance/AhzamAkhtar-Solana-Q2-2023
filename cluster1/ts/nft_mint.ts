import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import wallet from './wba-wallet';
import * as bs58 from "bs58";



// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

// Create a devnet connection
const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
    }));




(async () => {
    try {
        const { nft } = await metaplex.nfts().create(
            {
                uri: "https://v74boriqcgyk3qy6rhq6olwraphrym4a4ozn2trlbasus4ata6kq.arweave.net/r_gXRRARsK3DHonh5y7RA88cM4Djst1OKwglSXATB5U",
                name: "zonak art",
                symbol : "ZAN",
                creators: [{address: keypair.publicKey,
                    share: 100,}],
                sellerFeeBasisPoints: 500,
                isMutable: true
            }
        )
        console.log(nft.address)

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }


})();
