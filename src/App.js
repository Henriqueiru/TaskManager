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
          '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
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
    <div className="page">
      <div className="header">
        <p>Task Manager</p>
        {account != '' ? (
          <p>{account.substring(0, 9)}</p>
        ) : (
          <button className="big_button" onClick={initConnection}>
            Connect
          </button>
        )}
      </div>

      <div className="input_section">
        <div>
          <button className="big_button" onClick={() => createTicket(name)}>
            Create Ticket
          </button>
          <input
            className="input"
            onChange={e => setName(e.target.value)}
            placeholder="Ticket Name"
          />
        </div>
        <button className="big_button" onClick={getTickets}>
          Load data
        </button>
      </div>

      <div className="main">
        <div className="main_col" style={{ backgroundColor: 'lightPink' }}>
          <div className="main_col_heading">Todo</div>
          {tickets.map(item => {
            return <p>{item.name}</p>
          })}
        </div>
        <div className="main_col" style={{ backgroundColor: 'lightBlue' }}>
          <div className="main_col_heading">Busy</div>
          {tickets.map(item => {
            return <p>{item.name}</p>
          })}
        </div>
        <div className="main_col" style={{ backgroundColor: 'lightGreen' }}>
          <div className="main_col_heading">Done</div>
          {tickets.map(item => {
            return <p>{item.name}</p>
          })}
        </div>
      </div>
    </div>
  )
}

export default App
