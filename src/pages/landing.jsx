import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Button,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap/";
import { toast } from "react-toastify";

import config from "../lib/config";
import NFT_ABI from "../Abi/nft.json";

import Web3 from "web3";
import "@metamask/legacy-web3";

import Create from "../components/create";

toast.configure();

let toasterOption = config.toasterOption;

var web3 = new Web3(window.ethereum);

const NFT_ADDRESS = config.nftaddress;

const NFT_CONTRACT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

export default function Landing() {
  /* Account Related */
  const [UserAccountAddr, setUserAccountAddr] = useState("");
  const [WalletConnected, setWalletConnected] = useState(false);
  const [UserAccountBal, setUserAccountBal] = useState(0);
  const [Accounts, Set_Accounts] = useState("");
  const [VerifiedUser, set_VerifiedUser] = useState(false);

  useEffect(() => {
    CheckConnected();
  }, []);

  async function CheckConnected() {
    if (localStorage.getItem("Walletconnected")) {
      await window.ethereum
        .enable()
        .then(async function () {
          const web3 = new Web3(window.web3.currentProvider);
          if (
            window.web3.currentProvider.networkVersion === config.networkVersion
          ) {
            if (window.web3.currentProvider.isMetaMask === true) {
              if (
                window.web3 &&
                window.web3.eth &&
                window.web3.eth.defaultAccount
              ) {
                var currAddr = window.web3.eth.defaultAccount;
                setUserAccountAddr(currAddr);
                setWalletConnected(true);
                var result = await web3.eth.getAccounts();
                var setacc = result[0];
                Set_Accounts(setacc);
                localStorage.setItem("Walletconnected", true);
                await web3.eth.getBalance(setacc).then(async (val) => {
                  var balance = val / config.decimalvalues;
                  setUserAccountBal(balance);
                });
              }
            }
          }
        })
        .catch((e) => {});
    }
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts) {
        ConnectWallet();
      } else {
        localStorage.removeItem("Walletconnected");
        window.location.reload(false);
      }
    });
  }

  async function ConnectWallet() {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      try {
        if (typeof web3 !== "undefined") {
          // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          await window.ethereum
            .enable()
            .then(async function () {
              const web3 = new Web3(window.web3.currentProvider);
              if (
                window.web3.currentProvider.networkVersion ===
                config.networkVersion
              ) {
                if (window.web3.currentProvider.isMetaMask === true) {
                  if (
                    window.web3 &&
                    window.web3.eth &&
                    window.web3.eth.defaultAccount
                  ) {
                    var currAddr = window.web3.eth.defaultAccount;
                    setUserAccountAddr(currAddr);
                    setWalletConnected(true);
                    var result = await web3.eth.getAccounts();
                    var setacc = result[0];
                    Set_Accounts(setacc);
                    localStorage.setItem("Walletconnected", true);
                    web3.eth.getBalance(setacc).then((val) => {
                      var balance = val / config.decimalvalues;
                      setUserAccountBal(balance);
                    });
                    window.location.reload(false);
                  }
                }
              } else {
                setWalletConnected(false);
                toast.warning(
                  "Please Connect With Goerli Network",
                  toasterOption
                );
              }
            })
            .catch((e) => {});
        } else {
          setWalletConnected(false);
          toast.warning("Please Add Metamask External", toasterOption);
        }
      } catch (err) {
        setWalletConnected(false);
      }
    } else {
      setWalletConnected(false);
      toast.warning("Please Add Metamask External", toasterOption);
    }
  }


  return (
    <>
      <Navbar variant="dark">
        <Container>
          <Navbar.Brand>
            <h3>NFTs</h3>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {!WalletConnected && (
                <Button variant="warning" onClick={ConnectWallet}>
                  Connect Wallet
                </Button>
              )}
              {WalletConnected && <Button variant="success">{Accounts}</Button>}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <Container>
        <Tabs
          defaultActiveKey="profile"
          id="justify-tab-example"
          className="my-4"
          justify
        >
       
            <Tab eventKey="profile" title="Create NFT">
              <Create Account={Accounts} />
            </Tab>
           
        </Tabs>
      </Container>
    </>
  );
}
