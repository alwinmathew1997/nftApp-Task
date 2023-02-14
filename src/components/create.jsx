import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Button,
  Row,
  Col,
  Tabs,
  Tab,
  Form,
} from "react-bootstrap/";
import { toast } from "react-toastify";

import config from "../lib/config";
import NFT_ABI from "../Abi/nft.json";
import { IPFSfileAdd, IPFSjson } from "../lib/ipfs";

import Web3 from "web3";
import "@metamask/legacy-web3";

import WAValidator from "multicoin-address-validator";

toast.configure();

let toasterOption = config.toasterOption;

var web3 = new Web3(window.ethereum);

const NFT_ADDRESS = config.nftaddress;

const NFT_CONTRACT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

export default function Create(props) {
  /* Image states */
  const [TokenFile, setTokenFile] = useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = useState("");
  const [TokenFilePreUrl, setTokenFilePreUrl] = useState("");
  const [ipfsimg, setIpfsImg] = useState(null);

  const [ValidateError, setValidateError] = useState({});
  const [ButtonLoader, set_ButtonLoader] = useState(false);

  /* Input states */
  const [Name, set_Name] = useState("");
  const [WalletAddress, set_WalletAddress] = useState("");
  const [Desc, set_Desc] = useState("");

  const handleFileInput = async (e) => {
    let imageFormat = /\.(jpg|jpeg|pdf|png|gif|webp|mp4)$/;
    if (!imageFormat.test(e.target.files[0].name)) {
      toast.warning("File must be JPG PNG,GIF,WEBP,MP4,PDF", toasterOption);
    } else {
      if (e.target && e.target.files) {
        setValidateError("");
        var reader = new FileReader();
        var reader1 = new FileReader();

        var file = e.target.files[0];
        setTokenFile(file);
        reader1.readAsArrayBuffer(file);
        reader1.onloadend = function (e) {
          setIpfsImg(Buffer(reader1.result));
        };
        var url = reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          if (reader.result) {
            setTokenFilePreReader(reader.result);
          }
        }.bind(this);
        setTokenFilePreUrl(e.target.value);
      }
    }
  };

  const InputChange = (e) => {
    if (e && e.target && typeof e.target.value != "undefined" && e.target.id) {
      var value = e.target.value;
      switch (e.target.id) {
        case "Name":
          set_Name(value);
          break;

        case "WalletAddress":
          set_WalletAddress(value);
          break;
        case "Desc":
          set_Desc(value);
          break;
        default:
      }
    }
  };

  async function CreateCertificate() {
    set_ButtonLoader(true);
    if (TokenFilePreUrl === "") {
      toast.warning("Please Select the File", toasterOption);
      set_ButtonLoader(false);
      return false;
    }
    if (Name === "") {
      toast.warning("Please Enter the Name", toasterOption);
      set_ButtonLoader(false);
      return false;
    }

    if (Desc === "") {
      toast.warning("Please Enter the Description!", toasterOption);
      set_ButtonLoader(false);
      return false;
    }
    try {
    
          const formData = new FormData();
          formData.append("file", TokenFile);
          var response = await IPFSfileAdd(formData);
          if (response.status) {
            var iphas = response.IpfsHash;
            console.log(
              "🚀 ~ file: create.jsx ~ line 131 ~ CreateCertificate ~ iphas",
              iphas
            );
            var metajson = {
              name: Name,
              image: config.ipfsurl + iphas,
              description: Desc,
            };
            var metaresponse = await IPFSjson(JSON.stringify(metajson));
            console.log(
              "🚀 ~ file: create.jsx ~ line 140 ~ CreateCertificate ~ metaresponse",
              metaresponse
            );
            if (metaresponse.status) {
              var metahash = metaresponse.IpfsHash;
              var result = await NFT_CONTRACT.methods
                .CreateCertificate(
                  Name,
                  config.ipfsurl + iphas,
                  config.ipfsurl + metahash,
                  // WalletAddress
                  props.Account
                )
                .send({
                  from: props.Account,
                });
              if (result) {
                set_ButtonLoader(false);
                toast.success(
                  "Certificate Created Successfully",
                  toasterOption
                );
                window.location.reload(false);
              }
            } else {
              toast.error("Unable to Process right now!", toasterOption);
            }
          } else {
            toast.error("Unable to Process right now!", toasterOption);
          }
   
    } catch (err) {
      set_ButtonLoader(false);
      console.log(
        "🚀 ~ file: create.jsx ~ line 128 ~ CreateCertificate ~ err",
        err
      );
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col xs={4}></Col>
          <Col xs={4}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  id="Name"
                  onChange={InputChange}
                />
              </Form.Group>
              {/* <Form.Group className="mb-3">
                <Form.Label>Enter Wallet Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Wallet Address"
                  id="WalletAddress"
                  onChange={InputChange}
                />
              </Form.Group> */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Description"
                  id="Desc"
                  onChange={InputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  className="inp_file"
                  name="image"
                  id="image"
                  onChange={handleFileInput}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Button
                  variant="warning"
                  disabled={ButtonLoader}
                  onClick={CreateCertificate}
                >
                  Create
                </Button>
              </Form.Group>
            </Form>
          </Col>

          <Col
            className="d-flex align-items-center justify-content-center"
            xs={4}
          >
            {TokenFilePreReader != "" && (
              <>
                <div className="image_fix">
                  <img
                    src={TokenFilePreReader}
                    id="imgPreview"
                    alt="Collections"
                    className="img-fluid"
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
