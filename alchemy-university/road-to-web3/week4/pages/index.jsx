import { NFTCard } from '../components/nftCard'
import { useState } from 'react'

const Home = () => {
  
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false);
  const [nextPage, setNextPage] = useState("")

  const topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  const fetchNFTs = async() => {
   let nfts

    console.log("fetching nfts");
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_api_key}/getNFTs/`;
    var requestOptions = {
        method: 'GET'
      };
     
    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }
  
    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
      setNextPage(nfts.pageKey)
    }
    
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
        setNextPage(nfts.nextToken)
      }
    }
  }

  const fetchNextPage = async () => {
    var requestOptions = {
      method: 'GET'
    };
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_api_key}/getNFTs/`;
    const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${nextPage}`;
    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    setNFTs(nfts.ownedNfts)
    setNextPage(nfts.pageKey)
  }

  const fetchNextPageCollection = async () => {
    if (fetchForCollection) {
      var requestOptions = {
        method: 'GET'
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${nextPage}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      setNFTs(nfts.nfts)
      setNextPage(nfts.nextToken)   
    }
  }

  return (
      
      <div className="flex flex-col items-center justify-center p-0 gap-y-3 space-y-0">
        <div className="flex flex-col w-full justify-center items-center gap-y-2 bg-violet-400 border-double border-4 border-sky-500">
          <input className={"mt-2 border-solid border-2 border-sky-500"} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
          <input className={"border-solid border-2 border-sky-500"} onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
          <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
          <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5 mb-6"} 
          onClick={() => {
              if (fetchForCollection) {
                fetchNFTsForCollection()
              } else {
                fetchNFTs()
              }  
            }
          }>Let's go! 
          </button>
        </div>
        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
          {
            NFTs.length && NFTs.map((nft,index) => {
              return (
                  <NFTCard nft={nft} key={index} />
              )
            })
          }
        </div>
      <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick ={() =>{
            if (fetchForCollection) {
              fetchNextPageCollection()
            } else {
              fetchNextPage()
            }
            topFunction()
          }
          }>NEXT
        </button>
      </div>
  )
}


export default Home




