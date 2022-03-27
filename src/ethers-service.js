import { ethers, utils } from 'ethers';
import omitDeep from 'omit-deep';

// This code will assume you are using MetaMask.
// It will also assume that you have already done all the connecting to metamask
// this is purely here to show you how the public API hooks together
export const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

export const getAddress = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
}

export const signText = (text) => {
  return ethersProvider.getSigner().signMessage(text);
}

export const signedTypeData = (domain, types, value) => {
    const signer = getSigner();
    // remove the __typedname from the signature!
    return signer._signTypedData(
      omitDeep(domain, '__typename'),
      omitDeep(types, '__typename'),
      omitDeep(value, '__typename')
    );
  }

  export const getAddressFromSigner = () => {
      console.log("hello")
      console.log(ethersProvider.getSigner()._address)
    return ethersProvider.getSigner()._address;
  }

  export const splitSignature = (signature) => {
    return utils.splitSignature(signature)
}

export const getSigner = () => {
    return ethersProvider.getSigner();
}