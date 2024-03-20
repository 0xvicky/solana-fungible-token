import {
  Collection,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionDataArgs,
  Creator,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  UpdateMetadataAccountV2InstructionAccounts,
  UpdateMetadataAccountV2InstructionData,
  Uses,
  createMetadataAccountV3,
  updateMetadataAccountV2,
  findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import {
  PublicKey,
  createSignerFromKeypair,
  none,
  signerIdentity,
  some
} from "@metaplex-foundation/umi";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey
} from "@metaplex-foundation/umi-web3js-adapters";

//!This module is used, if user have fungible token deployed without metadata, so metadata can be added and updated in this module.

export function loadWalletKey(keypairFile: string): web3.Keypair {
  const fs = require("fs");
  const loaded = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
  );
  return loaded;
}

const INITIALIZE = false;

async function main() {
  console.log("let's name some tokens in 2024!");
  const myKeypair = loadWalletKey("PATH_TO_YOUR_SECRET_KEY_JSON_FILE");
  //   const mint = new web3.PublicKey("5UmjnxfKkG55E2m6BPAZFaM6hUy6jtEJC9zGgxdqjxKL"); // tokenaddress
  // const mint = new web3.PublicKey("DdAM6DeWutbxVRnnJpyZTqqdp1NvYbbWxjpoSfW8CuFj"); // tokenaddress
  const mint = new web3.PublicKey("FUNGIBLE_TOKEN_ADDRESS"); // tokenaddress

  const umi = createUmi("https://api.devnet.solana.com");
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));

  const ourMetadata = {
    //sample metadata
    // TODO change those values!
    name: "Dr. John",
    symbol: "DRS",
    uri: "https://bafybeid3hsl6zj3sh5t72dxqv5lurecn3hrff2nu2bfr2mzlur4xhyyzfi.ipfs.dweb.link/"
  };
  const onChainData = {
    ...ourMetadata,
    // we don't need that
    sellerFeeBasisPoints: 0,
    creators: none<Creator[]>(),
    collection: none<Collection>(),
    uses: none<Uses>()
  };
  if (INITIALIZE) {
    const accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint: fromWeb3JsPublicKey(mint),
      mintAuthority: signer
    };
    const data: CreateMetadataAccountV3InstructionDataArgs = {
      isMutable: true,
      collectionDetails: null,
      data: onChainData
    };
    const txid = await createMetadataAccountV3(umi, {
      ...accounts,
      ...data
    }).sendAndConfirm(umi);
    console.log(txid);
  } else {
    const data: UpdateMetadataAccountV2InstructionData = {
      data: some(onChainData),
      discriminator: 0,
      isMutable: some(true),
      newUpdateAuthority: none<PublicKey>(),
      primarySaleHappened: none<boolean>()
    };
    const accounts: UpdateMetadataAccountV2InstructionAccounts = {
      metadata: findMetadataPda(umi, {mint: fromWeb3JsPublicKey(mint)}),
      updateAuthority: signer
    };
    const txid = await updateMetadataAccountV2(umi, {
      ...accounts,
      ...data
    }).sendAndConfirm(umi);
    console.log(txid);
  }
}

main();
