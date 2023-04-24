## NFT Indexer
- Now that you've learned about the ERC-721 token standard, we've packaged up a skeleton application written using [Vite + React](https://vitejs.dev/guide/).
- Here at AU, we love using an awesome front-end component library called [Chakra UI](https://chakra-ui.com/). This app uses a bunch of Chakra!
> First time hearing of Chakra? We recommend reading [this article](https://www.freecodecamp.org/news/why-should-you-start-using-chakraui/#:~:text=Chakra%20UI%20is%20a%20component,with%20some%20other%20libraries%20too.) explaining ChakraUI and why it's a very powerful tool for front-end developers to learn!
- This skeleton application uses the [Alchemy SDK](https://www.alchemy.com/sdk) in order **to instantly return ALL the NFTs owned by an address**. Woah!
- Thanks to the Alchemy SDK, you can do this **blazingly fast**.
    - This is because the Alchemy SDK is rigged directly to Alchemy's own [``getNFTs`` endpoint](https://docs.alchemy.com/reference/getnfts).
- This is an extremely powerful API!
    - Can you imagine what a headache it would be to acquire ALL of the NFTs of an address otherwise?? You would need to manually:
        1. go through EVERY block in the blockchain
        1. go through EVERY tx in every block,
        1. index each tx,
        1. see whether the tx involves any ERC-721 specific events
        1. then, build up your own database
- That’s super difficult and time-consuming!!
- Thanks to Alchemy's [Enhanced APIs](https://www.alchemy.com/enhanced-apis), this is no longer a burden on the developer.
- Set this app up and see for yourself, you'll be able to query anyone's entire NFT collection in a few seconds flat!
- The NFT indexer app you will set up below uses a powerful combination of the following Alchemy Enhanced API endpoints:
    - [``getNfts``](https://docs.alchemy.com/reference/getnfts)
    - [``getNftMetadata``](https://docs.alchemy.com/reference/getnftmetadata)

#### Step 1: Cloning the repository!
- The NFT indexer application can be found here: https://github.com/alchemyplatform/nft-indexer
- In order to clone the repository, follow these steps:
    1. Open a terminal and navigate to the directory of your choice
    1. Run git clone git@github.com:alchemyplatform/nft-indexer.git
    1. Run cd nft-indexer to move into the newly cloned directory
    1. Run npm install to install all dependencies
    1. Run npm run dev to start the local development server

#### Step 2: Add Your Alchemy API Key
**The project won't work yet, since we have not loaded an API key from Alchemy!**
- Once you open the project in your code editor, navigate to the ``App.jsx`` file... on ``Line 23``, you'll see:
    ```bash
    apiKey: '<-- COPY-PASTE YOUR ALCHEMY API KEY HERE -->',
    ```
- It's time to fetch your Alchemy API key! Follow these steps if you need a refresher:
    1. Sign in to your [Alchemy dashboard](https://alchemy.com/?a=eth-bootcamp)
    1. Select ``+ Create App`` or use an existing app on your preferred network
    1. Select 'View Key'
    1. Copy the **API KEY**
    1. Paste it directly into ``Line 23`` of this project
- You are now ready to go, that was quick!! 🔥 Try a fresh query with one of your addresses!

#### Step 3: Build Out New Features!
- We purposefully built this out to be a skeleton version of what can be the next big thing so that you can practice some software development! Here are a few challenge suggestions:
    1. Add Wallet integration so that any user that connects their wallet can check see their NFTs in a flash!
    1. There is no indication of a request in progress... that's bad UX! Do you think you can add some sort of indication of loading?
    1. Add some styling! 🎨
    1. The NFT images can sometimes appear and sometimes not... can you think of ways to fix that?
    1. There is no error-checking for wrongly formed requests, or really any error checking of any kind... can you add some in?
    1. The images and grid display could look better... anything you can do about that?
    1. There are ways to make this app faster... can you implement some of them? How can the query be made even quicker?
    1. Can you add ENS support for inputs?
    1. Completely open-ended!! Use this as the base for your next hackathon project, dream company or personal expedition


