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
                let data = res.data
                console.log(res)
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
                    console.log(res)
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
            <div>
                <h4>{"seller:" + prop.object.seller + " buyer:" + prop.object.buyer}</h4>
                <p>{"order:" + prop.object.title}</p>
            </div>
        </Link>

    </div>
    )
}
export default main;