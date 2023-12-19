import '../styles/service.css';
import { useState} from 'react';
import FileUpload from './FileUpload';
import CardCmp from './CardCmp';
//import {ethers, providers} from 'ethers'; 
const {ethers}= require("ethers");

function Service() {

  const [walletAddress, setWalletAddress]= useState(null);
  const [accounts, setAccounts]= useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [commit, setCommit]= useState('');
  
  
  const getFileContent=(fileContent)=>{

    setFileContent(fileContent);
  
  }


  const getFileName=(fileName)=>{

    setFileName(fileName);
  }
  const getUpdatedCommit=(commit)=>{
    setCommit(commit);
  }
  async function requestAccount(){
    //check the existence of metamask
    if(window.ethereum){
      console.log("MetaMask detected !");
    } else {
      alert("MestaMask isn't detected !! , please install mehtaMask Extention First");

    }

    try{
      const accounts= await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("the Accs:", accounts);
      setWalletAddress(accounts[0]);

    } catch(err){
      console.error(err);
    }
  }

  async function connectWallet(){
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress= "0x7602B4e809A63ABEA2c628CeDd12e827f6b0dBF9" ;
      const ABI= [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_content",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_commit",
              "type": "string"
            }
          ],
          "name": "updateFileHash",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_newContent",
              "type": "string"
            }
          ],
          "name": "checkDataIntegrity",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "Hash",
                  "type": "bytes32"
                },
                {
                  "internalType": "string",
                  "name": "previous_commit",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "current_commit",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                }
              ],
              "internalType": "struct VerifyDataIntegrity.Details",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "details",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "Hash",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "previous_commit",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "current_commit",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "FileHash",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "Hash",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "previous_commit",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "current_commit",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ] ;

      const contract= new ethers.Contract(contractAddress,ABI,signer);
      return contract ;
     

    } catch(err){
      console.error(err);
    }
    }
    
  }

  async function updateFileHash(){
    try{
      const contract = await connectWallet();
    if (contract) {
      const name = await contract.name();
      console.log("Contract name is:", name);

      const updateFH = await contract.updateFileHash(fileName,fileContent, commit);
        await updateFH.wait(); // Wait for the transaction to be mined
        console.log("Hash updated successfully for this url:", fileName, "             and  this is the commit:", commit);

    }} catch(err){
      console.error("the connection to contract error:",err);
    }
  }

  async function verifyIntegrity(){
    try{
      const contract = await connectWallet();
    if (contract) {
      
      const verifyIntegrity = await contract.checkDataIntegrity(fileName, fileContent);
      console.log("the content to verify integrity is :",fileContent, "and url is :", fileName );
      //await verifyIntegrity.wait()
      console.log("Data Integrity Result:", verifyIntegrity);

    }} catch(err){
      console.error("the connection to contract error:",err);
    }
  }

    
    return (
    <div className="SERVICE">
      <header className="Service-header">
        <div>
        <button onClick={requestAccount}>Connect</button>
        <h3>wallet address: {walletAddress}</h3>

        <button onClick={updateFileHash}>update file Hash </button>
        <button onClick={verifyIntegrity}> verifyIntegrity</button>
        </div>

        <FileUpload getContent= {getFileContent} getName= {getFileName} getCommit={getUpdatedCommit} />

      </header>
      <div className='Container'>
      <aside>
        <CardCmp/>
      </aside>
      <main>
        <h2>the Main</h2>
      </main>

      </div>
      <footer>
        <div>the footer</div>
      </footer>
    </div>
  );
}

export default Service;