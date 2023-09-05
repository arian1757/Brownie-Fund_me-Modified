import { ethers } from "./ethers-5.6.esm.min.js" 
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById ("connectButton" )
const withdrawButton = document.getElementById("withdrawButton" )
const fundButton = document.getElementById("fundButton" )
const balanceButton = document.getElementById ( "balanceButton" )
const purposedfundButton = document.getElementById ( "fundButtonPurpose" )
const ValaueAmountButton = document.getElementById ( "ValueAmount" )
const FoundersLength = document.getElementById ( "foundersNumbers" )
const FoundersRank = document.getElementById ( "foundersRank" )
const EmergencyStart = document.getElementById ( "EmergencyFund" )
const StatusFund = document.getElementById ( "EmergencyFundStatus" )
const EmergencyFund = document.getElementById ( "EmergencyFunding" )
const fundingData = document.getElementById ( "Fundingdata" )
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
purposedfundButton.onclick = fund
balanceButton.onclick = getBalance

FoundersLength.onclick = getFounders
FoundersRank.onclick = getFoundersRank
EmergencyStart.onclick = StartEmergency
StatusFund.onclick = StatusEmergencyFund
EmergencyFund.onclick = fundEmergency
fundingData.onclick = fundingstatus
ValaueAmountButton.onclick = getAmount

async function connect () {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum. request ({ method: "eth_requestAccounts" })
        } catch (error) {
            console. log (error)
        }
        connectButton. innerHTML = "Connected"
        const accounts = await ethereum.request({method: "eth_accounts" })
        console.log (accounts)
        } else {
        connectButton. innerHTML = "Please install MetaMasK"
    }
    }
async function fund() {
        const ethAmount = document.getElementById( "ethAmount" ).value
        const additionalValue = document.getElementById("additionalValue").value
        console.log (`Funding with ${ethAmount}...`)
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi, signer)
            if (additionalValue){
                try {
                    const transactionResponse = await contract.fundWithPurpose(additionalValue,{
                    value: ethers.utils.parseEther(ethAmount),
                    })
                await listenForTransactionMine (transactionResponse, provider)
                }   catch (error) {
                    console.log (error)
                  }

            } else {
                try {
                    const transactionResponse = await contract.fund({
                    value: ethers.utils.parseEther(ethAmount),
                    
                })
                await listenForTransactionMine (transactionResponse, provider)
            }   catch (error) {
                console.log (error)
              }
                
                }
            } else {
            fundButton.innerHTML = "Please install MetaMask"
            }
        }
    function listenForTransactionMine(transactionResponse, provider){
        console.log(`Mining ${transactionResponse.hash}`)
        return new Promise((resolve, reject)=> {
        try {
            provider.once(transactionResponse.hash, (TransactionReceipt) => {
                console.log(`Completed with ${TransactionReceipt.confirmations} confirmations`)
            })
            resolve()
        
        } catch (error) {
            reject(error)

        }
    })
}

async function withdraw(){
    console.log(`withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider (window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }

    } else {
        fundButton.innerHTML = "Please install MetaMask"   
    }

}
async function getBalance(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider (window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}
async function getAmount(){
    if (typeof window.ethereum !== "undefined") {
        const Address = document.getElementById( "Address" ).value
        
        try {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi,signer)
            
            const supported = await contract.getAddressToAmountFunded(Address)
            console.log(supported)
            console.log(ethers.utils.formatEther(supported))
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}
async function getFounders(){
    if (typeof window.ethereum !== "undefined") {
        
        try {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi,signer)
            
            const quantity = await contract.getFundersCount()
            console.log(ethers.utils.formatUnits(quantity, 0))
            
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}

async function getFoundersRank(){
    if (typeof window.ethereum !== "undefined") {
        

        try {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi,signer)
            
            const Rank = await contract.getFunderRank(signer.getAddress())
            console.log(ethers.utils.formatUnits(Rank, 0))
            
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}

async function StartEmergency(){
    if (typeof window.ethereum !== "undefined") {
        const money = document.getElementById( "money" ).value
        const Eth = ethers.utils.parseEther(money)
        const goal = document.getElementById( "goal" ).value
        
        try {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi,signer)
            
            const transactionResponse = await contract.startEmergencyFund(goal,Eth)
            listenForTransactionMine(transactionResponse, provider)
            
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}
async function StatusEmergencyFund(){
    if (typeof window.ethereum !== "undefined") {
        
        try {
            const provider = new ethers.providers.Web3Provider (window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract (contractAddress, abi,signer)
            
            const status = await contract.getStatusEmergencyFund()
            console.log('the available amount is '+(ethers.utils.formatUnits(status[0], 0)))
            console.log('the  goal is '+(ethers.utils.formatEther(status[1], 0)))
            
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Please install MetaMask'
    }

}
async function fundEmergency() {
    const ethAmount = document.getElementById( "ethAmount" ).value
    
    console.log (`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider (window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract (contractAddress, abi, signer)
            try {
                const transactionResponse = await contract.emergencyFund({
                value: ethers.utils.parseEther(ethAmount),
                
            })
            await listenForTransactionMine (transactionResponse, provider)
        }   catch (error) {
            console.log (error)
          }
            
            
        } else {
        fundButton.innerHTML = "Please install MetaMask"
        }
    }
    async function fundingstatus(){
        if (typeof window.ethereum !== "undefined") {
            
            try {
                const provider = new ethers.providers.Web3Provider (window.ethereum)
                const signer = provider.getSigner()
                const contract = new ethers.Contract (contractAddress, abi,signer)
                
                const status = await contract.getStatusFund()
                console.log('the education amount is '+(ethers.utils.formatEther(status[0], 0)))
                console.log('the  podcasts is '+(ethers.utils.formatEther(status[1], 0)))
                console.log('the  others is '+(ethers.utils.formatEther(status[2], 0)))
                
            } catch (error) {
                console.log(error)
            }
        } else {
            balanceButton.innerHTML = 'Please install MetaMask'
    }
}
