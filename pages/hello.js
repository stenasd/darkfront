import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
const ENDPOINT = "http://127.0.0.1:8081";
//fetch chat history each refresh or join
//get recent messages on socket

function hello() {
  const [response, setResponse] = useState("");
  const [text, setText] = useState(0);
  const [chathistory, setChatHistory] = useState(0);
  const socket = socketIOClient(ENDPOINT);






  useEffect(() => {
    axios.get('/api/chathistory', { withCredentials: true })
      .then(res => {
        var componentarray = []
        res.data.forEach(element => {
          componentarray.push(<chatmsg element={element} />)
        })
        setChatHistory(componentarray)

      })
      .catch((error) => {
        console.log("getmoveerror")

      });




    socket.on("msg", data => {
      setResponse(data);
    });

  }, []);
  const onChangeHandler = event => {
    setText(event.target.value);
  };
  function submit() {
    socket.emit("chat message", text)

  }

  return (<div>
    <p>
      It's <time dateTime={response}>{text}</time>
      <input type="text" value={text} onChange={onChangeHandler} />
      <button onClick={submit}>
        send
      </button>
    </p>
    <h1>{response}</h1>
  </div>
  );
}

function chatmsg(prop) {
  return (
    <div className="card">
      <p>{element.name} {element.content}</p>
      <img className="image" src={element.image} />
    </div>
  )
}

export default hello;