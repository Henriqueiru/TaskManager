import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

function App() {
  const [data, setData] = useState('')
  const [contract, setContract] = useState()

  const getData = async () => {
    const data = await contract.greet()
    setData(data)
  }

  const UpdateData = async () => {
    const transaction = await contract.setGreeting(data)
    await transaction.wait()
    getData()
  }
  const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setContract(
        new ethers.Contract(
          '0x5fbdb2315678afecb367f032d93f642f64180aa3',
          Greeter.abi,
          signer
        )
      )
    } else {
      console.log('Please install metamask.')
    }
  }

  useEffect(() => {
    initConnection()
  }, [])

  return (
    <div>
      <button onClick={getData}>Get Data</button>
      <button onClick={UpdateData}>Set Data</button>
      <input
        onChange={e => setData(e.target.value)}
        placeholder="NewGreeting"
      />
      <p>{data}</p>
    </div>
  )
}

export default App
