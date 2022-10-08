import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddress, abi } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";
import { AiFillBell } from "react-icons/ai";
const LottoEntrance = () => {
  const { chainId: chaindIdHex, isWeb3Enabled, web3 } = useMoralis();
  const chainId = parseInt(chaindIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayer, setNumPlayer] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const [disableEnterLotto, setDisableEnterLotto] = useState(false);
  const lottoAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const dispatch = useNotification();

  const {
    runContractFunction: enterLotto,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lottoAddress,
    functionName: "enterLotto",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lottoAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lottoAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lottoAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUI = async () => {
    const entranceFeeFromContract = (await getEntranceFee()).toString();
    const numPlayersFromContract = (await getNumberOfPlayers()).toString();
    const recentWinnerFromContract = (await getRecentWinner()).toString();

    setEntranceFee(entranceFeeFromContract);
    setNumPlayer(numPlayersFromContract);
    setRecentWinner(recentWinnerFromContract);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      listenForWinnerToBePicked();
    }
  }, [isWeb3Enabled]);

  async function listenForWinnerToBePicked() {
    const lotto = new ethers.Contract(lottoAddress, abi, web3);
    console.log("Waiting for a winner ...");
    await new Promise((resolve, reject) => {
      lotto.once("WinnerPicked", async () => {
        console.log("We got a winner!");
        try {
          await updateUI();
          resolve();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };
  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "transaction complete",
      title: "Tx notification",
      position: "topR",
      icon: <AiFillBell />,
    });
  };
  return (
    <>
      {lottoAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto rounded"
            onClick={async function () {
              await enterLotto({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching? (
              <div className="animate-spin spinner-border h-4 w-4 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lotto</div>
            )}
          </button>
          <div>Entrance fee : {ethers.utils.formatUnits(entranceFee)} ETH</div>
          <div>Number of players :  {numPlayer} Players</div>
          <div>Recent winner: {recentWinner}</div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default LottoEntrance;
