import '../styles/globals.css'
import React, { useState, useEffect } from "react";
import axios from 'axios';
import textData1 from '../texterSvenska.json'
let textData = textData1.navBar
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header></Header>
      <Component {...pageProps} />
    </div>
  )
}
function Header() {
  const [currentAdress, setcurrentAdress] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    axios.get('/api/checkAuthentication', { withCredentials: true })
      .then(res => {
        console.log("authenticated")
        setLoggedIn(res.data.authenticated);
      })
      .then((response) => {
        getbalance();
      })
      .catch((error) => {
        console.log("notauthenticated")
        setLoggedIn(false)
      });
  }, []);
  function getbalance() {
    axios.get('/api/balance')
      .then(function (response) {
        console.log(response.data)
        setcurrentAdress(response.data.btc)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (loggedIn) {

    return (
      <div className={"fixed-header"}>
        <div className={"container"}>
          <nav>
            <a href="/">{textData.home}</a>
            <a href="/getListings">{textData.getListings}</a>
            <a href="/orders">{textData.orders}</a>
            <a href="/creatListing">{textData.createListing}</a>
            <a className={"login"} href="/api/logout">{textData.logout}</a>
            <a className={"login"} href="/">{currentAdress + "-btc"}</a>
          </nav>
        </div>
      </div>
    )
  }
  return (
    <div className={"fixed-header"}>
      <div className={"container"}>
        <nav>
        <a href="/">{textData.home}</a>
            <a href="/getListings">{textData.getListings}</a>
            <a href="/orders">{textData.orders}</a>
            <a href="/creatListing">{textData.creatListing}</a>
          <a className={"login"} href="/">{textData.login}</a>
          <a className={"login"} href="/wallet">{textData.wallet}</a>
          <a className={"login"} href="/wallet">{currentAdress + "-btc"}</a>

        </nav>
      </div>
    </div>
  )
}
export default MyApp
