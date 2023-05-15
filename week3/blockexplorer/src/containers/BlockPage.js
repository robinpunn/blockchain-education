import React from "react";
import Top from "../components/BlockPage/Top";
import Mid from "../components/BlockPage/Mid";
import Bot from "../components/BlockPage/Bot";
import "./BlockPage.css";

const BlockPage = ({ blockInfo }) => {
  console.log("blockPage:", blockInfo);
  return (
    <div className="block-page">
      <div className="block-head">
        <h3>Block {blockInfo.number}</h3>
      </div>
      <Top blockInfo={blockInfo} />
      <Mid blockInfo={blockInfo} />
      <Bot blockInfo={blockInfo} />
    </div>
  );
};

export default BlockPage;
