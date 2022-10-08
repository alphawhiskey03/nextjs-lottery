import { ConnectButton } from "@web3uikit/web3";
const Header = () => {
  return (
    <div className="border-b-2 p-5 flex flex-row">
      <h1 className="py-4 py-5 font-bold text-3xl">Decentralized lotto</h1>
      <div className="ml-auto py-2 px-4">
        
      <ConnectButton moralisAuth={true} />
      </div>
    </div>
  );
};
export default Header;
