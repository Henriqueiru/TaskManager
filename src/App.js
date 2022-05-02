import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Manager from './artifacts/contracts/Manager.sol/Manager.json'

function App() {
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState(null)
  const [tickets, setTickets] = useState([])

  const getTickets = async () => {
    const res = await contract.getTickets()
    setTickets(res)
  }

  const createTicket = async _name => {
    const transaction = await contract.createTicket(_name)
    await transaction.wait()
    getTickets()
  }

  const updateTicketStatus = async (_index, _status) => {
    const transaction = await contract.updateTicketStatus(_index, _status)
    await transaction.wait()
    getTickets()
  }

  const renameTicket = async _index => {
    let newName = prompt('Please enter new ticket name', '')
    const transaction = await contract.updateTicketStatus(_index, newName)
    await transaction.wait()
    getTickets()
  }

  const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const newSigner = provider.getSigner()
      setAccount(accounts[0])
      setContract(
        new ethers.Contract(
          '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          Manager.abi,
          newSigner
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
      <button onClick={() => createTicket('Test')}>Add ticket</button>
      <button onClick={getTickets}>Load data</button>
    </div>
  )
}

export default App
