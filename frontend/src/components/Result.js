import { useState, useEffect, useMemo } from "react";

import { COLUMNS } from "./Columns";
import TableContainer from "./TableContainer";

export default function Result({
  address,
  isFirstLoading,
  isValidAddress,
  updateResult,
  setUpdateResult,
}) {
  const [accountNFTs, SetAccountNFTs] = useState([]);
  const [isTableLoading, SetIsTableLoading] = useState([true]);
  const columns = useMemo(() => COLUMNS, []);

  async function getNftsForOwner(owner) {
    SetIsTableLoading(true);

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    try {
      console.log("port = " + process.env.REACT_APP_API_PORT);
      const url =
        process.env.REACT_APP_BACKEND_SERVER_URL +
        ":" +
        process.env.REACT_APP_API_PORT +
        "/api?" +
        new URLSearchParams({
          owner: owner,
        });
      console.log("fetch: " + url);
      const response = await fetch(url, requestOptions);
      console.log("Response status: " + response.status);
      const res = await response.json();
      if (response.ok) {
        SetAccountNFTs(res);
      } else {
        console.log(res);
        SetAccountNFTs([]);
      }
      //console.log(res);
    } catch (error) {
      console.log(error);
      SetAccountNFTs([]);
    }

    SetIsTableLoading(false);
  }

  useEffect(() => {
    if (isFirstLoading || !updateResult) {
      return;
    }
    getNftsForOwner(address);
    setUpdateResult(false);
  }, [updateResult]);

  return (
    <div>
      <br />
      {!isFirstLoading && !isTableLoading ? (
        <div className="text-left">
          Account {address} has {accountNFTs.length} NFTs
        </div>
      ) : (
        <br />
      )}
      <TableContainer
        columns={columns}
        data={accountNFTs}
        isFirstLoading={isFirstLoading}
        isTableLoading={isTableLoading}
        isValidAddress={isValidAddress}
      />
    </div>
  );
}
