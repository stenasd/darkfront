import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';
//https://css-tricks.com/build-a-chat-app-using-react-hooks-in-100-lines-of-code/
const ENDPOINT = "http://127.0.0.1:8081";
//fetch chat history each refresh or join
//get recent messages on socket
//user got a socket thats saved and backend keeps track on all messages and send it to correct

function hello() {
  const [response, setResponse] = useState("");
  const [text, setText] = useState(0);
  const [sessionid, setSessionid] = useState();
  const socket = socketIOClient(ENDPOINT);
  const [messages, setMessages] = useImmer([]);
  let key = 0





  useEffect(() => {
    socket.emit("login",[sessionid])
    socket.on("msg", data => {
      key++
      setMessages(draft => {
        //draft.push(<Chatmsg key={key} text={data.text} roomid={data.roomid} name={data.name} />)
      })
    });
    axios.get('/api/getSessionid', { withCredentials: true })
      .then(res => {
        console.log(res.data.sessionID)
        setSessionid(res.data.sessionID);
      })
      .catch((error) => {
        console.log("notauthenticated")
        setSessionid(false)
      });

    axios.get('/api/chathistory', { withCredentials: true })
      .then(res => {
        console.log(res.data.data);
        var componentarray = []
        res.data.data.forEach(data => {
          key++
          setMessages(draft => {
            draft.push(<Chatmsg key={key} text={data.text} roomid={data.roomid} name={data.name} />)
          })

        })
        setChatHistory(componentarray)

      })
      .catch((error) => {
        console.log("getmoveerror")
      });

  }, []);
  const onChangeHandler = event => {
    setText(event.target.value);
  };
  function submit() {
    socket.emit("chat message",[sessionid, text])

  }

  return (<div>
    <p>
      It's <time dateTime={response}>{text}</time>
      <input type="text" value={text} onChange={onChangeHandler} />
      <button onClick={submit}>
        send
      </button>
    </p>
    <ul>{messages}</ul>
  </div>
  );
}

function Chatmsg(prop) {
  return (
    <div className="card">
      <p>{prop.roomid} {prop.name} {prop.text}</p>


    </div>
  )
}

export default hello;