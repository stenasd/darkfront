import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import Link from 'next/link'
import textData1 from '../texterSvenska.json'
let textData = textData1.orders


function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);
    const [roominfoS, setRoominfoS] = useImmer([]);
    useEffect(() => {
        axios.get('/api/activeRooms', { withCredentials: true })
            .then(res => {
                let index = 0
                let data = res.data
                console.log(data)
                data.forEach(data => {
                    index++
                    let returnobject = {
                        orderID: data.orderID,
                        seller: data.seller,
                        buyer: data.buyer,
                        key: index,
                        title: data.title
                    }
                    setRoominfo(draft => {
                        draft.push(
                            <Chatpage key={index} object={returnobject}
                            />
                        )
                        key++;

                    })
                })
            })
            .catch((error) => {
                console.log("getmoveerror")
            });
    }
        , []);
    useEffect(() => {
        axios.get('/api/activeRoomsSeller', { withCredentials: true })
            .then(res => {
                let index = 0
                let data = res.data
                console.log(data)
                data.forEach(data => {

                    index++
                    let returnobject = {
                        orderID: data.orderID,
                        seller: data.seller,
                        buyer: data.buyer,
                        key: index,
                        title: data.title
                    }
                    setRoominfoS(draft => {
                        draft.push(
                            <Chatpage key={index} object={returnobject}
                            />
                        )
                        key++;

                    })

                })
            })
            .catch((error) => {
                console.log("getmoveerror")
            });
    }
        , []);
    return (
        <div className="formContainer">
            <ul>
                <h1> {textData.buyer}: </h1>
                {roominfo}

                <h1>{textData.seller}</h1>
                {roominfoS}
            </ul>
        </div>
    );
}
function Chatpage(prop) {
    let url = "/chat/" + prop.object.orderID
    console.log(prop)
    return (<div>
        <Link href={url}>
            <div className={"grid-item-order"}>
                <h4>{textData.seller+": " + prop.object.seller + " "+ textData.buyer+": " + prop.object.buyer}</h4>
                <p>{textData.order+": " + prop.object.title}</p>
            </div>
        </Link>

    </div>
    )
}
export default main;