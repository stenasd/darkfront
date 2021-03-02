import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import Link from 'next/link'
function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);
    useEffect(() => {


        axios.get('/api/activeRooms', { withCredentials: true })
            .then(res => {
                let index = 0
                console.log(res.data);
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
    let url = "/chat/" + prop.object.orderID
    return (<div>
        <Link href={url}>
            <h1>{prop.object.productname}</h1>
        </Link>
        <ul>
        </ul>
    </div>
    )
}
export default main;