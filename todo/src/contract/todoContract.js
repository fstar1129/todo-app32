
import todoAbi from '../abis/todoAbi.json';
import {ethers} from 'ethers';

export const  getTodoContract = (signer) => {
        return  new ethers.Contract("0xdA4D655470BE238cD8037284541F1Cb2201642be", todoAbi, signer)
}
