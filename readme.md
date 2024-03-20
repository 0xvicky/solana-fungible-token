Steps to initialize and install the modules required:

1. mkdir mint-fungible-spl
cd mint-fungible-spl

2. npm init --yes

3. tsc --init

4. Open tsconfig.json and uncomment (or add) this to your file:
   "resolveJsonModule": true

5. npm i @solana/web3.js @metaplex-foundation/umi @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-candy-machine bs58

6. ts-node wallet.ts (To generate keypairs)

7. ts-node mint.ts (To deploy and mint the fungible token along with metadata to the provided account)

8. ts-node metadata.ts (To add or update metadata of existing fungible token)