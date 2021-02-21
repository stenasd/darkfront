import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';

function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);






    useEffect(() => {
        axios.get('/api/activeRooms', { withCredentials: true })
            .then(res => {
                let orderArray = []
                console.log(res.data[0].productName);
                res.data.forEach(data => {
                    key++
                    let returnobject = {
                        orderQuant: data.orderQuant,
                        orderID: data.orderID,
                        productname: data.productName,
                        seller: data.seller,
                        key: key,
                        chatmessages: data.messages
                    }
                    orderArray.push(returnobject)

                })
            })
            .catch((error) => {
            });
    }, [])

    useEffect(() => {


        axios.get('/api/activeRooms', { withCredentials: true })
            .then(res => {
                let index = 0
                res.data.forEach(data => {

                    index++

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
                        console.log(key)
                        draft.push(
                            <Chatpage key={index} object={returnobject}
                            />)
                        key++;
                        draft.push(
                            <Chatpage key={index} object={returnobject}
                            />)
                        key++;
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

    }, []);
    return (
        <div>
            <ul>
                {roominfo}
            </ul>
        </div>
    );
}

function Chatpage(prop) {
    const [messages1, setMessages] = useImmer([]);
    let key = 0
    useEffect(() => {
        console.log(prop.object)
        prop.object.chatmessages.forEach(data => {
            console.log(data)
            setMessages(draft => {
                console.log(key)
                key++
                draft.push(<Chatmsg key={key}
                    text={data.text}
                    roomid={data.roomid}
                    name={data.name}
                />)

            })
        })
    }, []);

    return (<div>
        <h1>{prop.object.productname}</h1>
        <ul>

            {messages1}
        </ul>
    </div>
    )
}


function Chatmsg(prop) {
    return (
        <div className="card">
            <p>{prop.index} {prop.name} {prop.text}</p>


        </div>
    )
}


export default main;