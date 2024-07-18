import { ContractRunner } from "ethers";
import { Address } from "viem";

export type Web3ContextType = {
  account?: Address;
  chainId?: number;
  isConnected?: boolean;
  library?: ContractRunner;
  estokkYamContract: any;
  tokens: any;
  properties: any;
};

export type OfferContextType = {
  offerContents: any;
}

export type UtilContextType = {
  accessToken: string;
  ethPrice: EthPriceType;
  setEthPrice: (price: EthPriceType) => void;
}

export type EthPriceType = {
  open: Number,
  close: Number,
  high: Number,
  low: Number
}