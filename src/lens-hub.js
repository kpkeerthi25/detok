import { getSigner} from './ethers-service';
import { ethers, utils } from 'ethers';
import abi from './abi.json'
// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
export const lensHub = new ethers.Contract(
    "0xd7B3481De00995046C7850bCe9a5196B7605c367",
    abi,
  getSigner()
)