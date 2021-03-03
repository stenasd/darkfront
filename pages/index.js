import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function PersonList() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('/api/checkAuthentication', { withCredentials: true })
      .then(res => {
        console.log("authenticated")
        setLoggedIn(res.data.authenticated);
      })
      .catch((error) => {
        console.log("notauthenticated")
        setLoggedIn(false)
      });
  }, []);

  if (loggedIn) {

    return (
      <div>
        <form action="/api/logout" method="post">     
            <input type="submit" value="logout" />         
        </form>
      </div>
    )
  }
  return (
    <div>
      <form action="/api/login" method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" /><br />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>

      <a href="/signup">signup</a>
    </div>
  )

}