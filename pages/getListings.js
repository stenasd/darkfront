import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import Link from 'next/link'
import { useForm } from "react-hook-form";
import textData1 from '../texterSvenska.json'
let textData = textData1.getListings
function main() {
    let key = 0
    const [roominfo, setRoominfo] = useImmer([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const { register, errors, handleSubmit } = useForm({
        mode: "onChange"
    });

    const onSubmit = data => {
        submit(data)
    };

    function submit(data) {
        let sendjson = { search: data.search }
        console.log(sendjson)
        axios.post(`/api/searchListings`, sendjson, { withCredentials: true })
            .then(res => {
                if (!res.data[0]) {
                    setRoominfo(draft => {
                        return null
                    })
                }
                else {
                    setRoominfo(draft => {
                        return []
                    })
                }

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
            .catch(function (error) {
                console.log(error)
            });
    }
    useEffect(() => {
        axios.get('/api/checkAuthentication', { withCredentials: true })
            .then(res => {
                console.log("authenticated")
                setLoggedIn(true);
            })
            .catch((error) => {
                console.log("notauthenticated")
                setLoggedIn(false)
            });

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
    // seller ? <MarkAsSent orderstate={orderstate} orderid={prop.object.orderID} /> : <CompleteOrder orderstate={orderstate} orderid={prop.object.orderID} />}
    if (loggedIn) {
        return (
            <div className={"grid-container"}>
                <div className={"searchbarcontainer"}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="search"
                            name="search"
                            placeholder={textData.search}
                            ref={register({ required: true })}
                        />
                        <input className={"button1"} type="submit" value={textData.search} />
                    </form>
                </div>
                {roominfo ? false : <h1>{textData.noMatch}</h1>}
                {roominfo}
            </div>
        );
    }
    else {
        return (
            <h1>
                {textData.noUser}
            </h1>
        )
    }
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
                <h4 className={"grid-name"}>{prop.object.name}</h4>
                <h4 className={"grid-price"}>{prop.object.priceBTC}{' btc'}</h4>


            </div>
        </Link >



    )
}

export default main;

