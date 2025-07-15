import { BrowserProvider, Contract } from "ethers";
import DeNews from "../abi/DeNews.json";
import { CONTRACT_ADDRESS } from "./config";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  // First request account access from MetaMask
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, DeNews.abi, signer);
};
