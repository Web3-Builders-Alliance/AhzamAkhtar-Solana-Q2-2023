import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import wallet from './wba-wallet';
import { readFile } from "fs/promises"
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
            const { uri } = await metaplex
        .nfts()
        .uploadMetadata(
            {
                "name": "zonak art",
                "symbol": "ZAN",
                "description": "The zan Rug",
                "seller_fee_basis_points": 500,
                "image": "https://rwsfffvqoqg6pqarc3lvffikpb35ezm5kbvbhmhszuveayifeqyq.arweave.net/jaRSlrB0DefAERbXUpUKeHfSZZ1QahOw8s0qQGEFJDE",
                "external_url": "",
                "edition": 0,
                "attributes": [
                 
                ],
                "properties": {
                  "files": [
                    {
                      "uri": "https://rwsfffvqoqg6pqarc3lvffikpb35ezm5kbvbhmhszuveayifeqyq.arweave.net/jaRSlrB0DefAERbXUpUKeHfSZZ1QahOw8s0qQGEFJDE",
                      "type": "image/png"
                    }
                  ],
                  "category": "image",
                  "creators": [
                    {
                      "address": "AVphMo9JsWV5279Z2Sc1yNC8T6KzJVCcNog6iCY53z2t",
                      "share": 100
                    }
                  ]
                }
              }
        ) 

            //const img = await readFile("../images/generug.png");
            //const metaplexImg = toMetaplexFile(img,"generug.png");
           // const imageURI = await metaplex.storage().upload(metaplexImg)
  
            console.log(uri)
    
        } catch(e) {    
            console.error(`Oops, something went wrong: ${e}`)
        }
    
    
    })();
    
    