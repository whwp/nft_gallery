require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Network, Alchemy } = require("alchemy-sdk");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// defining the Express app
const app = express();
app.use(express.static("public"));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// defining an endpoint to get the NFTs
app.get("/", (req, res, next) => {
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

// defining an endpoint to get the NFTs
app.get("/api", async (req, res, next) => {
  //console.log(req);
  const owner = req.query.owner;

  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  async function Nfts(owner) {
    try {
      //let _nfts = []; //store the complete data of NFTs returned by alchemy SDK, for debug purpose
      let nfts = []; //store the selected data of NFTs returned by alchemy SDK.

      // Get the async iterable for the owner's NFTs.
      const nftsIterable = alchemy.nft.getNftsForOwnerIterator(owner);

      // Iterate over the NFTs and add them to the nfts array.
      for await (const nft of nftsIterable) {
        //_nfts.push(nft);
        nfts.push({
          title: nft["title"],
          thumbnail:
            nft["media"].length > 0 &&
            nft["media"][0].hasOwnProperty("thumbnail")
              ? nft["media"][0]["thumbnail"]
              : null,
          tokenId: nft["tokenId"],
          collectionName: nft["contract"]["name"],
          contractAddress: nft["contract"]["address"],
          tokenType: nft["contract"]["tokenType"],
          openseaFloorPrice: nft["contract"]["openSea"]["floorPrice"],
        });
      }

      // Log the NFTs.
      //console.log("got NFTs: ");
      //console.log(_nfts);
      //console.log(nfts);

      res.send(nfts);
    } catch (error) {
      console.log(error);
      //res.send(error);
      return next(error);
    }
  }

  Nfts(owner);
});

app.listen(process.env.API_PORT || 3000, () => {
  console.log("Server is running.");
});

// Export the Express API
module.exports = app;
