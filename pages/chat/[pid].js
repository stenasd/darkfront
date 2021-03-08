import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
const ENDPOINT = "http://127.0.0.1:8081";
function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);
    const router = useRouter()
    const { pid } = router.query
    useEffect(() => {

        if (!router.isReady) return;
        axios.get('/api/getChat', {
            withCredentials: true, params: {
                listingID: pid
            }
        })
            .then(res => {
                let index = 0
                res.data.forEach(data => {

                    index++
                    console.log(data.orderID)
                    console.log(pid)
                    if (data.orderID != pid) { return }
                    let returnobject = {
                        orderQuant: data.orderQuant,
                        orderID: data.orderID,
                        productname: data.productName,
                        seller: data.seller,
                        key: index,
                        chatmessages: data.messages
                    }
                    console.log(returnobject);
                    setRoominfo(draft => {
                        console.log("run")
                        draft.push(
                            <Chatpage key={index} object={returnobject}
                            />)
                        key++;

                    })


                })
            })
            .catch((error) => {
                console.log("getmoveerror")
            });


    }, [router.isReady]);

    return (
        <div>
            <ul>
                {roominfo}
            </ul>
        </div>
    );
}

function Chatpage(prop) {
    const socket = socketIOClient(ENDPOINT);
    const [messages1, setMessages] = useImmer([]);
    const [sessionid, setSessionid] = useState();
    const [text, setText] = useState(" ");

    let key = 0
    useEffect(() => {
        axios.get('/api/getSessionid', { withCredentials: true })
            .then(res => {
                console.log(res.data.sessionID)
                setSessionid(res.data.sessionID);
            })
        socket.on("msg", data => {
            console.log(data)
            key++
            setMessages(draft => {
                draft.push(<Chatmsg key={key} text={data.text} orderid={data.orderid} name={data.name} />)
            })
        });
        console.log(prop.object)
        prop.object.chatmessages.forEach(data => {
            console.log(data)
            setMessages(draft => {
                console.log(key)
                key++
                draft.push(<Chatmsg key={key}
                    text={data.text}
                    orderid={data.orderid}
                    name={data.name}
                />)

            })
        })
    }, []);
    const onChangeHandler = event => {
        setText(event.target.value);
    };
    function submit() {

        let sendobject = {
            text: text,
            orderid: prop.object.orderID,
        }
        socket.emit("chat message", [sessionid, sendobject])
        console.log(prop)
        setText(" ")

    }
    return (<div>
        <h1>{prop.object.productname}</h1>
        <ul>
            {messages1}
        </ul>
        <button onClick={submit}>
            send
      </button>
        <input type="text" value={text} onChange={onChangeHandler} />
    </div>
    )
}


function Chatmsg(prop) {
    return (
        <div className="card">
            <p> {prop.name}: {prop.text}</p>


        </div>
    )
}


export default main;