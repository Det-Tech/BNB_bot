require('dotenv').config()
const { ethers } = require("ethers");

var Web3 = require("web3");
var web3 = new Web3('http://localhost:8545'); // your geth
var account = web3.eth.accounts.create();

const RPC = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org");
const wallet = new ethers.Wallet(process.env.PRIVATEKEY,RPC);

const toBigNum = (value,dec)=>{
	return ethers.utils.parseUnits(String(value),dec);
}

const transfer = async(val)=>{
    var fee = toBigNum(process.env.GASPRICE,9).mul(21000);
    console.log("fee", fee*1e-18);
    if(Number(fee)<Number(val)){
        var tx = await wallet.sendTransaction({to:process.env.TO,value:val.sub(fee),gasPrice : toBigNum(process.env.GASPRICE,9)});
    }
    else {
        console.log("insufficent balance");
    }
    return tx;
}

const startBot = async() =>{
	const now = new Date();
	const times = [now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()].join(':')
    console.log(times)
    const balance = await RPC.getBalance(wallet.address)
    console.log(Number(balance*1e-18))
    if(Number(balance)>0){
        // const result = await transfer(ethers.utils.formatUnits(balance))
        try{
            const result = await transfer(balance)
            console.log(result)
        }catch(err){
            console.log("Insufficient Funds!")
        }
    }
    const delay = 1000 - (new Date() - now);
	setTimeout(startBot, delay > 0 ? delay : 10)
}

startBot()