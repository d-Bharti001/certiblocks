import React, { Component, createContext, useContext } from 'react'
import CertiContract from '../contracts/CertiContract.json'
import Web3 from 'web3'

const networks = {
  '1': 'Ethereum Main Network',
  '3': 'Ropsten Test Network',
  '4': 'Rinkeby Test Network',
  '5': 'Goerli Test Network',
  '42': 'Kovan Test Network',
  '5777': 'Local Ganache Network',
}

const expectedNetworkId = '42'  // Kovan Test Network

export const courses = [
  'Python',
  'C++',
  'Java',
  'Advanced Statistics',
  'Data Science',
  'Machine Learning',
  'Data Structures and Algorithms'
]

export function getDateFromTimestamp(timestamp) {
  if (timestamp.length === 10)
    timestamp += '000'
  let t = new Date(Number.parseInt(timestamp))
  return t.toDateString()
}

const BackendContext = createContext()

export function useBackend() {
  return useContext(BackendContext)
}

class BackendProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      metamask: null,
      account: null,
      contract: null,
      loading: false,
      error: '',
    }
  }

  resetState = () => {
    this.setState({
      web3: null,
      metamask: null,
      account: null,
      contract: null,
      loading: false,
      error: '',
    })
  }

  handleAccountChanged = (accounts) => {
    this.setState({ account: accounts[0] })
  }

  componentDidUpdate(prevProps, prevState) {
    // Subscribe to events
    if (this.state.metamask && this.state.metamask !== prevState.metamask) {
      this.state.metamask.on('chainChanged', this.resetState)
      this.state.metamask.on('accountsChanged', this.handleAccountChanged)
      this.state.metamask.on('disconnect', this.resetState)
    }
  }

  componentWillUnmount() {
    // Unsubscribe to events
    if (this.state.metamask) {
      this.state.metamask.removeListener('chainChanged', this.resetState)
      this.state.metamask.removeListener('accountsChanged', this.handleAccountChanged)
      this.state.metamask.removeListener('disconnect', this.resetState)
    }
  }

  connectMetamask = async () => {
    try {
      this.setState({ loading: true, error: '' })
      let { ethereum } = window
      if (ethereum && ethereum.isMetaMask) {
        let selectedNetwork = await ethereum.request({ method: 'net_version' })
        if (selectedNetwork !== expectedNetworkId) {
          this.setState({ loading: false, error: `Please switch to ${networks[expectedNetworkId]}` })
          return
        }
        if (CertiContract.networks[expectedNetworkId]) {
          let web3 = new Web3(ethereum)
          let contract = new web3.eth.Contract(CertiContract.abi, CertiContract.networks[expectedNetworkId].address)
          let accounts = await ethereum.request({ method: 'eth_requestAccounts' })
          let account = accounts[0]
          window.web3 = web3
          this.setState({
            loading: false,
            web3,
            metamask: ethereum,
            account,
            contract,
          })
        }
        else {
          this.setState({ loading: false, error: `Contract not deployed to ${networks[expectedNetworkId]}` })
          return
        }
      }
      else {
        this.setState({ loading: false, error: 'Metamask not detected' })
        return
      }
    }
    catch (err) {
      this.setState({ loading: false, error: 'Some error occurred.' })
      return
    }
  }

  checkIfRegistered = async (addr) => {
    try {
      let result = await this.state.contract.methods.checkIfRegistered(addr).call({ from: this.state.account })
      return result
    } catch (error) {
      throw error
    }
  }

  registerNewAuthority = async (addr) => {
    try {
      await this.state.contract.methods.registerNewAuthority(addr).send({ from: this.state.account })
    } catch (error) {
      throw error
    }
  }

  certifyStudent = async (studAddr, marks, totalMarks, courseName, studName) => {
    try {
      let t = new Date().getTime().toString();
      t += Math.floor(Math.random() * 20);
      let certificateId = this.state.web3.utils.keccak256(t);
      await this.state.contract.methods.certify(
        certificateId,
        studAddr,
        marks,
        totalMarks,
        courseName,
        studName)
        .send({ from: this.state.account })
      return certificateId
    } catch (error) {
      throw error
    }
  }

  getCertificateInfoById = async (certId) => {
    try {
      if (!this.state.web3.utils.isHexStrict(certId) || certId.length > 66) {
        throw new Error('Invalid ID')
      }
      let result = await this.state.contract.methods.certificateInfo(certId).call()
      if (/0x0{64}/i.test(result.certificateId)) {
        throw new Error('Certificate not issued')
      }
      return {
        certificateId: result.certificateId,
        studentAddr: result.studentAddr,
        certProviderAddr: result.certProviderAddr,
        studentName: result.studentName,
        courseName: result.courseName,
        marks: result.marks,
        totalMarks: result.totalMarks,
        timestamp: result.timestamp,
      }
    } catch (error) {
      throw error
    }
  }

  getPastCertificates = async (providerAddr, studAddr) => {
    try {
      let result = await this.state.contract.getPastEvents('CertificateGenerated', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: { providerAddr, studAddr }
      })
      return result.map(event => (
        {
          studAddr: event.returnValues.studAddr,
          providerAddr: event.returnValues.providerAddr,
          certId: event.returnValues.certId,
          courseName: event.returnValues.courseName,
          timestamp: event.returnValues.timestamp,
        }
      )).sort((a, b) => (b.timestamp - a.timestamp))
    } catch (error) {
      throw error
    }
  }

  render() {
    return (
      <BackendContext.Provider value={{
        ...this.state,
        connectMetamask: this.connectMetamask,
        checkIfRegistered: this.checkIfRegistered,
        registerNewAuthority: this.registerNewAuthority,
        certifyStudent: this.certifyStudent,
        getCertificateInfoById: this.getCertificateInfoById,
        getPastCertificates: this.getPastCertificates,
      }}>
        {this.props.children}
      </BackendContext.Provider>
    )
  }
}

export default BackendProvider
