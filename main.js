const {BlockChain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('6ba3258c2268204f22ea35d3f30575e8ff96e5f2fc1f1a48fe4ee3fefb1b4479');
const myWalletAddress = myKey.getPublic('hex');

let konkukCoin = new BlockChain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
konkukCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
konkukCoin.minePendingTransactions(myWalletAddress);

console.log('\nBlance of xavier is', konkukCoin.getBlanceOfAddress(myWalletAddress));

console.log('\n Starting the miner...');
konkukCoin.minePendingTransactions(myWalletAddress);

console.log('\nBlance of xavier is', konkukCoin.getBlanceOfAddress(myWalletAddress));