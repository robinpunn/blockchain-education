const signature2 = async (msg, privateKey) => {
    const signed = await secp.sign(msg, privateKey, { recovered: true });
    const sign = toHex(signed[0]);
    const recoveryId = signed[1];
    // console.log(sign, recoveryId);
    return { sign, recoveryId };
  }()

  async function transfer(evt) {
    evt.preventDefault();
    
    if (!verified) {

    } else {
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  }