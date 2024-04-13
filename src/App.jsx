import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"
import { Wallet } from "./services/near-wallet";
import { EthereumView } from "./components/Ethereum";
import { BitcoinView } from "./components/Bitcoin";

import ethSvg from "/eth-logo.svg"
import btcSvg from "/btc-logo.svg"
import arrowsSvg from "/arrows.svg"

// CONSTANTS
const MPC_CONTRACT = 'multichain-testnet-2.testnet';

// NEAR WALLET
const wallet = new Wallet({ network: 'testnet', createAccessKeyFor: MPC_CONTRACT });

function App() {
  const [selectedOrder, setSelectedOrder] = useState(); // [order: Order
  const [swapType, setSwapType] = useState(true); // [true == "eth-2-btc", false == "btc-2-eth"]
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [status, setStatus] = useState("Please login to request a signature");
  const [chain, setChain] = useState('eth');

  useEffect(() => {
    const initFunction = async () => {
      const isSignedIn = await wallet.startUp();
      setIsSignedIn(isSignedIn);
    }

    initFunction();
  }, []);

  const onAcceptOrder = (order) => {
    console.log("Accepting order...");
    setSelectedOrder(order);
  } 

  // type Order = order: {
  //   id: number;

  //   owner: string; // Lisa NEAR-ETH account
  //   ownerSubaccount: string; // Lisa NEAR-ETH Escrow subaccount
  //   ownerReceiver: string; // Lisa NEAR-BTC account

  //   accepter: string; // Bart NEAR-BTC account
  //   accepterSubaccount: string; // Bart NEAR-BTC Escrow subaccount
  //   accepterReceiver: string; // Bart NEAR-ETH account

  //   ownerAssetType: string;
  //   ownerAssetId: string;
  //   ownerAssetCollectionName: string;

  //   accepterAssetType: string;
  //   accepterAssetId: string;
  //   accepterAssetCollectionName: string;
  // };
  const ordersList = [
    { 
      id: 1,

      owner: "lisa.near.eth",
      ownerSubaccount: "lisa.escrow.eth",
      ownerReceiver: "lisa.near.btc",
      
      accepter: "bart.near.btc",
      accepterSubaccount: "bart.escrow.btc",
      accepterReceiver: "bart.near.eth",

      ownerAssetType: "NFT",
      ownerAssetId: "NFT_1",
      ownerAssetCollectionName: "NFT Collection 1",

      accepterAssetType: "Ordinal",
      accepterAssetId: "Ordinal_1",
      accepterAssetCollectionName: "Ordinal Collection 1"
    },
  ]

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("Creating swap...");
  }

  const onChangeOrder = (field, value) => {
    setSelectedOrder(selectedOrder => ({
      ...selectedOrder,
      [field]: value
    }));
  }

  return (
    <>
      <Navbar wallet={wallet} isSignedIn={isSignedIn}></Navbar>

      <div className="container-fluid mt-5 px-4">
        <div className="row">
          <div className="col-6">
            <h4 className="h4">Orders</h4>
            <div className="overflow-auto" style={{maxHeight: "80vh"}}>
              {ordersList ? ordersList.map((order, index) => (
                <div className="card" key={order.id+index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h5 className="card-title"><i className="fs-6">{order.owner}</i> has</h5>
                      </div>
                      <div className="col"></div>
                      <div className="col">
                        <h5 className="card-title">Wants</h5>
                      </div>
                      <div className="row align-middle">
                        <div className="col text-center">
                          <img src={ethSvg} alt="Ethereum" className="mb-2" style={{ width: "24px"}} />
                        </div>
                        <div className="col text-center"></div>
                        <div className="col text-center">
                          <img src={btcSvg} alt="Bitcoin" className="mb-2" style={{width: "24px"}} />
                        </div>
                      </div>
                      <div className="row align-middle">
                        <div className="col text-center">
                          <img src="https://via.placeholder.com/150" alt="NFT input image" className="card-img-top mb-2" style={{maxWidth: "100px"}} />
                        </div>
                        <div className="col text-center align-middle">
                          <img src={arrowsSvg} alt="Swap arrows img" style={{ width: "50px" }} className="align-middle" />
                        </div>
                        <div className="col text-center">
                          <img src="https://via.placeholder.com/150" alt="NFT input image" className="card-img-top mb-2" style={{maxWidth: "100px"}} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col text-center">
                          <p className="card-text">{order.ownerAssetCollectionName}</p>
                        </div>
                        <div className="col text-center">
                          <button className="btn btn-primary" onClick={() => onAcceptOrder(order)}>
                            Accept
                          </button>
                        </div>
                        <div className="col text-right">
                          <p className="card-text">{order.accepterAssetCollectionName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
          <div className="col-6">
            <h4 className="h4">Create Swap</h4>
            <form className="" onSubmit={onSubmit}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" onChange={() => setSwapType(s => !s)} />
                <label className="form-check-label" htmlFor="switchCheckChecked">
                  <b>{swapType ? "ETH x BTC: " : "BTC x ETH: "}</b>
                  {swapType ? "Exchange NFT (eth) for Ordinal (btc)" : "Exchange Ordinal (btc) for NFT (eth)"}
                </label>
              </div>
              <div className="mt-4">
                <b className="mt-4">{swapType ? "NFT" : "Ordinal"}</b>
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="inputCollectionId">
                    Input{swapType ? " NFT " : " Ordinal "}ID
                  </span>
                  <input
                    type="text" name="inputCollectionId" className="form-control" aria-describedby="inputCollectionId"
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetId : ""}
                    onChange={e => onChangeOrder("ownerAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                  <span className="input-group-text" id="inputCollectionName">
                    Input{swapType ? " NFT " : " Ordinal "}Name
                  </span>
                  <input
                    type="text" name="inputCollectionName" className="form-control" aria-describedby="inputCollectionName"
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetCollectionName : ""}
                    onChange={e => onChangeOrder("ownerAssetCollectionName", e.target.value)}
                    />
                </div>

                <b className="mt-3">{swapType ? "Ordinal" : "NFT"}</b>
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="outputCollection">
                    Receive{swapType ? " Ordinal " : " NFT "}ID
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetId : ""}
                    onChange={e => onChangeOrder("accepterAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                  <span className="input-group-text" id="outputCollection">
                    Receive{swapType ? " Ordinal " : " NFT "}Name
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetCollectionName : ""}
                    onChange={e => onChangeOrder("accepterAssetCollectionName", e.target.value)}
                    />
                </div>

                <div className="input-group input-group-sm my-6">
                  <span className="input-group-text" id="receiverAddress">
                    {swapType ? "BTC " : "ETH "}Receiver Address
                  </span>
                  <input
                    type="text" name="receiverAddress" className="form-control" aria-describedby="receiverAddress"
                    defaultValue={selectedOrder ? selectedOrder.ownerReceiver : ""}
                    onChange={e => onChangeOrder("ownerReceiver", e.target.value)}
                    />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">Create Order</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <h4> 🔗 NEAR Multi Chain </h4>
        <p className="small">
          Safely control accounts on other chains through the NEAR MPC service. Learn more in the <a href="https://docs.near.org/abstraction/chain-signatures"> <b>documentation</b></a>.
        </p>

        {isSignedIn &&
          <div style={{ width: '50%', minWidth: '400px' }}>

            <div className="input-group input-group-sm mt-3 mb-3">
              <input className="form-control text-center" type="text" value={`MPC Contract: ${MPC_CONTRACT}`} disabled />
            </div>

            <div className="input-group input-group-sm my-2 mb-4">
              <span className="text-primary input-group-text" id="chain">Chain</span>
              <select className="form-select" aria-describedby="chain" value={chain} onChange={e => setChain(e.target.value)} >
                <option value="eth"> Ξ Ethereum </option>
                <option value="btc"> ₿ BTC </option>
              </select>
            </div>

            {chain === 'eth' && <EthereumView props={{ setStatus, wallet, MPC_CONTRACT }} />}
            {chain === 'btc' && <BitcoinView props={{ setStatus, wallet, MPC_CONTRACT }} />}
          </div>
        }

        <div className="mt-3 small text-center">
          <span> {status} </span>
        </div>
      </div>
    </>
  )
}

export default App