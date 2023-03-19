//import logo from "./logo.svg";
//import "./App.css";
import { useState } from "react";
import InputForm from "./components/InputForm";
import Result from "./components/Result";
function App() {
  const [address, setAddress] = useState("");
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [updateResult, setUpdateResult] = useState(false);

  return (
    <div className="App container">
      <h1 className="text-center">NFT Galaxy</h1>
      <p className="text-center">on Ethereum blockchain</p>
      <br />
      <InputForm
        setAddress={setAddress}
        setIsFirstLoading={setIsFirstLoading}
        setIsValidAddress={setIsValidAddress}
        setUpdateResult={setUpdateResult}
      />
      <Result
        address={address}
        isFirstLoading={isFirstLoading}
        isValidAddress={isValidAddress}
        updateResult={updateResult}
        setUpdateResult={setUpdateResult}
      />
    </div>
  );
}

export default App;
