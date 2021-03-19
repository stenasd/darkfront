import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import Link from 'next/link'
function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);
    useEffect(() => {


        axios.get('/api/allListings', { withCredentials: true })
            .then(res => {
                let index = 0
                console.log(res.data)
                res.data.forEach(data => {

                    index++

                    let returnobject = data
                    console.log(returnobject);
                    setRoominfo(draft => {
                        console.log(key)
                        draft.push(
                            <Card key={index} object={returnobject}
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
        <div className={"grid-container"}>
            {roominfo}
        </div>
    );
}

function Card(prop) {
    let url = "/listing/" + prop.object.id
    console.log(prop)
    return (

        <Link href={url}>
            <div className={"grid-item"}>
                <div className={"grid-image"}>

                <img src={"/api/" + prop.object.image} alt="image" />

                </div>
                <div className={"grid-h4"}>
                    <h4 className={"grid-h4"}>{prop.object.name}</h4></div>
                <div className={"grid-price"}>
                    <h4 className={"grid-price"}>{prop.object.priceBTC}{'btc'}</h4>
                </div>

            </div>
        </Link >



    )
}

export default main;

