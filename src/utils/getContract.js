// client/src/utils/getContract.js
import { Contract, BrowserProvider } from "ethers";
import DeNews from "../abi/DeNews.json";
import { CONTRACT_ADDRESS } from "./config";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, DeNews.abi, signer);
};
