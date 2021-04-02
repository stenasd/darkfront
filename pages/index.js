import React, { useState, useEffect } from "react";
import axios from 'axios';
import textData1 from '../texterSvenska.json'
let textData = textData1.home
export default function PersonList() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    axios.get('/api/checkAuthentication', { withCredentials: true })
      .then(res => {
        console.log(res.data)
        setLoggedIn(res.data.authenticated);
        setUser(res.data)
      })
      .catch((error) => {
        console.log("notauthenticated")
        setLoggedIn(false)
      });
  }, []);
  if (loggedIn) {
    return (
      <div className={"formContainer"}>
        <h2>
          {textData.name+" "+user.name}
        </h2>
        <h2>
          {textData.rating+" "+user.rating+"/5"}
        </h2>
        <h2>
          {textData.ratingNr+" "+user.ratingNr}
        </h2>
        <Wallet></Wallet>
      </div>

    )
  }
  return (
    <div className={"formContainer"}>
      <form action="/api/login" method="post">
        <div className={"grid-item-form"}>
          <label>{textData.Username}:</label>
          <input type="text" name="username" /><br />
        </div>
        <div className={"grid-item-form"}>
          <label>{textData.Password}:</label>
          <input type="password" name="password" />
        </div>
        <div className={"grid-item-form-button"}>
          <input type="submit" value={textData.login} className={"button1"} />
          <a href="/signup"><input type="button" value={textData.signup} className={"button1"} /></a>
        </div>
      </form>
    </div>
  )
}


function Wallet() {
  const [currentAdress, setcurrentAdress] = useState(false);
  function getNewAdress() {

    axios.post('/api/creatAdress')
      .then(function (response) {
        console.log(response.data)
        setcurrentAdress(response.data.adrr)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    axios.get('/api/getCurrentAdress')
      .then(function (response) {
        console.log(response.data.adrr)
        setcurrentAdress(response.data.adrr)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <div className={"grid-wallet-form"}>
        <h1>{currentAdress} </h1>

      </div>
      <div className={"grid-wallet-form2"}>
        <button onClick={getNewAdress} className={"button1"}>
        {textData.generateAdress}
      </button>
      </div>
    </div>
  );
}