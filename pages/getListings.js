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
    let url = "/chat/" + prop.object.id
    console.log(prop)
    return (<div className={"grid-item"}>

        <Link href={url}>
            <div>
                <img src={prop.object.image} alt="image" />
                <h4>{prop.object.name}{" "}{prop.object.priceBTC}</h4>
            </div>
        </Link>


    </div>
    )
}

export default main;

