export const NFTCard = ({nft}) => {
    const tokenId = (nft.id.tokenId).slice(-5)
    const address = (nft.contract.address).slice(0,4) + "..." + (nft.contract.address).slice(-4)
    
    return(
        <div className="w-1/4 flex flex-col">
            <div className="rounded-md">
                <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    <h2 className="text-md text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600">Id: {tokenId}</p>
                    <p className="text-gray-600" >{address}</p>
                </div>
                <div className="flex-grow mt-2">
                    <button className={"bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"}
                    onClick={()=>{
                        navigator.clipboard.writeText(nft.contract.address)
                    }}
                    >COPY
                    </button>
                </div>
            </div>
        </div>
    )
}