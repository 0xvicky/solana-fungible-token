import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair
} from "@metaplex-foundation/umi";
import {TokenStandard, createAndMint} from "@metaplex-foundation/mpl-token-metadata";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {mplCandyMachine} from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import secret from "./guideSecret.json";

//!This module used to deploy new fungible token along with metadata. First run the wallet.ts file, to generate your keypairs and they will be stored in "guideSecret.json" file, imported above as secret. Or paste your secret key in form of UINT8 Array in guideSecret.json, for deployment.

const umi = createUmi("https://api.devnet.solana.com"); //Replace with your RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret)); //your secret key imported from guideSecret.json
const userWalletSigner = createSignerFromKeypair(umi, userWallet); //Signer instance

const metadata = {
  //sample metadata
  name: "Dr. John",
  symbol: "DRJ",
  uri: "https://bronze-living-turkey-240.mypinata.cloud/ipfs/QmZsaFQTaJ1MqHPWk3BRdUoiuHftpto9xYuWysbKWgZmpH" //URI of your json file containing metadata
};

const initialSupply = 100; //supply of your token

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine());

createAndMint(umi, {
  //Deploy and mint the tokens into the provided account in guideSecret.json
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 8,
  amount: initialSupply,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log(`Successfully minted ${initialSupply} tokens (", mint.publicKey, ")`);
  });
