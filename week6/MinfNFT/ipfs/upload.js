async function run() {
  const { create } = await import("ipfs-http-client");
  const ipfs = await create();

  // we added three attributes, add as many as you want!
  const metadata = {
    path: "/",
    content: JSON.stringify({
      name: "Mayhem the Undying",
      attributes: [
        {
          trait_type: "Undead",
          value: "100",
        },
        {
          trait_type: "GoodBoy",
          value: "100",
        },
        {
          trait_type: "Herding",
          value: "1000",
        },
      ],
      // update the IPFS CID to be your image CID
      image:
        "https://ipfs.io/ipfs/QmW3JGEiLCc4YfoGrSLzFAjVwo5XPCxAqnJNSKh7aef8oM",
      description: "The pooch of pooches",
    }),
  };

  const result = await ipfs.add(metadata);
  console.log(result);

  process.exit(0);
}

run();

/*
{
  path: 'Qme51ob7U4kGqLP7WhztMCs8mFpmQeXqotvxkGVTVRUCKC',
  cid: CID(Qme51ob7U4kGqLP7WhztMCs8mFpmQeXqotvxkGVTVRUCKC),
  size: 287
}
*/
