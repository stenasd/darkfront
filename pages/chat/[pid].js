import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import textData1 from '../../texterSvenska.json'
let textData = textData1.chat
const ENDPOINT = "http://127.0.0.1:8081/";
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
                console.log(res.data[0].messages)
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
                        chatmessages: data.messages,
                        isSeller: data.isSeller,
                        orderstate: data.orderstate
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
        <div className="formContainer">
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
    const [orderstate, setOrderstate] = useState(0);
    const [seller, setSeller] = useState(0);
    const { register, handleSubmit, reset } = useForm({
        mode: "onChange"
    });
    let key = 0
    useEffect(() => {
        let sendobject = {
            text: "",
            orderid: prop.object.orderID,
        }
        axios.get('/api/getSessionid', { withCredentials: true })
            .then(res => {
                console.log(res.data.sessionID)
                setSessionid(res.data.sessionID);
                console.log(prop)
                setSeller(prop.object.isSeller)
                setOrderstate(prop.object.orderstate)
                socket.emit("auth", [res.data.sessionID, sendobject])
            })
        socket.on("msg", data => {

            key++
            setMessages(draft => {
                draft.unshift(<Chatmsg key={key} text={data.text} orderid={data.orderid} name={data.name} image={data.image} />)
            })
        });

        prop.object.chatmessages.forEach(data => {
            setMessages(draft => {
                console.log(key)
                key++
                draft.unshift(<Chatmsg key={key}
                    text={data.text}
                    orderid={data.orderid}
                    name={data.name}
                    image={data.image}
                />)

            })
        })
    }, []);
    const onSubmit = async data => {
        if (data.file[0]) {
            let fd = new FormData();
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            fd.append('file', data.file[0])
            fd.append("orderid", prop.object.orderID)
            fd.append("text", data.text)
            console.log(fd)
            axios.post('/api/chatImage', fd, config)
                .then(function (response) {
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            let sendobject = {
                text: data.text,
                orderid: prop.object.orderID,
            }
            socket.emit("chat message", [sessionid, sendobject])
        }
        reset()
    };
    return (
        <div className="chatContainer">
            <nav>
                <ul>
                    {messages1}
                </ul>
            </nav>
            <div className="chatMenu">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className="chatMenu"
                        name="text"
                        placeholder={textData.message}
                        ref={register()}
                    />
                    <input type="submit" value={textData.send} />
                    <input ref={register} type="file" name="file" />
                </form>
            </div>
            {seller ? <MarkAsSent orderstate={orderstate} orderid={prop.object.orderID} /> : <CompleteOrder orderstate={orderstate} orderid={prop.object.orderID} />}

        </div>
    )
}


function Chatmsg(prop) {
    console.log(prop)
    if (prop.image) {
        return (
            <div>
                <img src={"/api/" + prop.image} alt="image" />
                <p> {prop.name}: {prop.text}</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <p> {prop.name}: {prop.text}</p>
            </div>
        )
    }
}
function MarkAsSent(prop) {
    const { register, errors, handleSubmit } = useForm({
        mode: "onChange"
    });
    const onSubmit = data => {
        submit()
    };
    function submit() {
        axios.post(`/api/orderSent`, { orderid: prop.orderid }, { withCredentials: true })
            .then(res => {
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    if (prop.orderstate == 0) {
        return (
            <div >
                <h4>Markera att varan är skickad {prop.orderid}</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="submit" value={textData.submit} />
                </form>
            </div>
        );
    }
    else if (prop.orderstate == 1) {
        return (
            <div>
                <h4> {textData.waitingForBuyer} </h4>
            </div>
        );
    }
    else if (prop.orderstate == 2) {
        return (
            <div>
                <h4> {textData.escrowDone} </h4>
            </div>
        );
    }
}

function CompleteOrder(prop) {

    const { register, errors, handleSubmit } = useForm({
        mode: "onChange"
    });
    const onSubmit = data => {
        console.log(data);
        if (data.rating < 6 && data.rating > 0) {
            submit(data)
        }
        else {
            alert("1-5");
        }
    };
    function submit(data) {
        let sendjson = { orderid: prop.orderid, rating: data.rating }
        axios.post(`/api/addreview`, sendjson, { withCredentials: true })
            .then(res => {
            })
            .catch(function (error) {
                console.log(error)
            });
    }
    if (prop.orderstate == 0) {
        return (
            <div>
                <h4> {textData.waitingForSeller} </h4>
            </div>
        );

    }
    if (prop.orderstate == 2) {
        return (
            <div >
                <h4> {textData.escrowDone} </h4>
            </div>
        );

    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"form"}>
                    <label htmlFor={textData.rating}>1-5</label>
                    <input
                        name="rating"
                        placeholder="1-5"
                        ref={register({ required: true })}
                    />
                    {errors.rating && <p>{textData.thisRequired}</p>}
                </div>
                <input type="submit" value={textData.submit} />
            </form>
        </div>
    );
}
export default main;