import { Provider } from "@self.id/react";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <Component {...pageProps} />;
    </Provider>
  );
}

export default MyApp;
