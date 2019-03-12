import React, { Component } from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import secp256k1 from 'secp256k1';
import {randomBytes} from 'crypto';
import './App.css';
const createKeccakHash = require('keccak');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      randomNumber:0,
      pubKey:0,
      pubKeyString:0,
      keccak:0,
      address:0,
      minRange:0x1,
      maxRange:0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140,
      maxRangeString:'0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140'
    }
  }

  toHexString = (byteArray) =>{
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

  generateRandomNumber = async ()=>{
    let privKey = randomBytes(32);
    let hexPrivKey = this.toHexString(privKey);
    //privKey = Math.floor(privKey * (this.state.maxRange-1)+1);
    let pubKey =  secp256k1.publicKeyCreate(privKey,false).slice(1);
    let hexPubKey = this.toHexString(pubKey);
    this.setState({randomNumber:hexPrivKey})
    this.setState({pubKeyString:hexPubKey})
    let hashPubKey = await createKeccakHash('keccak256').update(pubKey);
    this.setState({keccak:hashPubKey.digest('hex')})
    let address = this.state.keccak.toString().slice(-40);
    this.setState({address:address});

  }
  render() {
    return (
      <div className="App">
      <p>Minimum for private key: 0x{this.state.minRange.toString(16)} <br/>
      Maximum for private key: 0x{this.state.maxRangeString}
      </p>
        <Button variant='contained'
                onClick={this.generateRandomNumber}
                color='primary'>Click here to generate random number
        </Button>

        <p>Random Number: 0x{this.state.randomNumber.toString(16)}</p>
        <p>Public Key: 0x{this.state.pubKeyString}</p>
        <p>Keccak Hash: 0x{this.state.keccak} </p>
        <p>Address: 0x{this.state.address} </p>
      </div>
    );
  }
}

export default App;
