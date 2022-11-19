import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import bs58 from "bs58";

import {
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { FC, ReactNode, useMemo } from "react";

import { actions, NodeWallet } from "@metaplex/js";

require("./App.css");
require("@solana/wallet-adapter-react-ui/styles.css");
let thelamports = 0;
let theWallet = "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9";
function getWallet() {}
const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};

export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  async function uploadToArweave() {}

  async function onClick() {
    if (!publicKey) throw new WalletNotConnectedError();
    connection.getBalance(publicKey).then((bal) => {
      console.log(bal / LAMPORTS_PER_SOL);
    });

    console.log(publicKey.toBase58());

    // let secretKey: Uint8Array = Uint8Array.from([
    //   "3Mhpf1kqaKxiesDVwi65dZj5gnozgZdxNehoUmoW6YohdoQRNJR8Wd14PWrd7AD9sHfVPJArP4x7PMnhBFXgH6va",
    // ]);
    let secretKey = bs58.decode(
      "3Mhpf1kqaKxiesDVwi65dZj5gnozgZdxNehoUmoW6YohdoQRNJR8Wd14PWrd7AD9sHfVPJArP4x7PMnhBFXgH6va"
    );

    const mintNFTResponse = await actions.mintNFT({
      connection,
      wallet: new NodeWallet(Keypair.fromSecretKey(secretKey)),
      uri: "https://www.arweave.net/1r-ImuiIxFl18UQolAoBnwLDMVcjkVAHruhtsaBpA7U?ext=json",
      maxSupply: 1,
    });
  }
  //https://www.arweave.net/E549DU2gkzyb3ho-9c5Z5tnW7v7nlPHdkRZlOlTh6ds?ext=json

  return (
    <div className="App bg-yellow-50">
      <div className="w-72 h-72 bg-yellow-400 rounded-full absolute -left-24 -top-16">

      </div>
      <div className="min-w-full h-screen">
        <div className="flex flex-col w-full h-full justify-center items-center ">
          <WalletMultiButton />
          <div className="text-white font-semibold mt-5">
            <button className="bg-green-600 w-44 py-5 hover:opacity-80 tranistion duration-300" onClick={onClick}>
              Mint NFT{" "}
            </button>
            <button className="bg-blue-600 w-44 py-5 hover:opacity-80 tranistion duration-300" onClick={uploadToArweave}>
              Upload to Arweave
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
