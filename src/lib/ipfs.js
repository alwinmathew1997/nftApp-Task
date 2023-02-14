import axios from "axios";

export const IPFSfileAdd = async (data) => {
  try {
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: data,
      headers: {
        pinata_api_key: `e4da4524e13b38b51108`,
        pinata_secret_api_key: `22a438340433effc64096adfba0f2f32ec376f656b285008688bd085945233f5`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (resFile.status === 200) {
      return {
        IpfsHash: resFile.data.IpfsHash,
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (err) {
    console.log("🚀 ~ file: ipfs.js ~ line 18 ~ IPFSfileAdd ~ err", err);
    return {
      status: false,
    };
  }
};

export const IPFSjson = async (data) => {
  try {
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
        pinata_api_key: `e4da4524e13b38b51108`,
        pinata_secret_api_key: `22a438340433effc64096adfba0f2f32ec376f656b285008688bd085945233f5`,
        "Content-Type": "application/json",
      },
    });
    if (resFile.status === 200) {
      return {
        IpfsHash: resFile.data.IpfsHash,
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (err) {
    console.log("🚀 ~ file: ipfs.js ~ line 18 ~ IPFSfileAdd ~ err", err);
    return {
      status: false,
    };
  }
};

export const GetNFTSforAddress = async (address) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key":
          "5gSVwhzys4ko6iU88LAInNtF6g4TOWAGWN7eHwAPopQ6z26wAR6KUw0IoCD0hMlL",
      },
    };

    let Data = await fetch(
      "https://deep-index.moralis.io/api/v2/"+address+"/nft?chain=mumbai&format=decimal&token_addresses=",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => { return err});
    if (Data && Data.result && Data.result.length > 0) {
      return {
        tokens: Data.result,
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (err) {
    console.log("🚀 ~ file: ipfs.js ~ line 102 ~ GetNFTSforAddress ~ err", err);
  }
};
