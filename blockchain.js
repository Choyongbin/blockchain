const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
}
class Block {
    constructor(timestamp, transactions, previousHash= ' '){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash +this.timestamp+JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    constructor(){
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 4;
      this.pendingTransactions = [];
      this.miningReward = 100;
   }
   
    createGenesisBlock(){
      return new Block("01/01/2018", "Genesis Block", "0");
   }
   
    getLastestBlock() {
      return this.chain[this.chain.length - 1];
   }

   minePendingTransactions(miningRewardAddress){
       let block = new Block(Date.now(), this.pendingTransactions);
       block.mineBlock(this.difficulty)
       console.log('Block successfully mined: ');
       this.chain.push(block);

       this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
       ];
   }

   createTransaction(transaction){
       this.pendingTransactions.push(transaction);
   }

   getBlanceOfAddress(address){
       let balance = 0;

       for(const block of this.chain){
           for(const trans of block.transactions){
               if(trans.fromAddress === address){
                   balance -= trans.amount;
               }

               if(trans.toAddress === address){
                   balance += trans.amount;
               }
           }
       }

       return balance;
   }
   /*
    addBlock(newBlock) {
      newBlock.previousHash = this.getLastestBlock().hash;
      newBlock.mineBlock(this.difficulty);
      this.chain.push(newBlock);
   }
   */
    isChainVaild() {

        for(let i = 1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                console.log(currentBlock.hash);
                console.log(currentBlock.calculateHash());
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                console.log(currentBlock.previousHash);
                console.log(previousBlock.hash);
                return false;
            }
        }
      return true;
   }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;