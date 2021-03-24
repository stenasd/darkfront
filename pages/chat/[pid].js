import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
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
    const [orderstate, setOrderstate] = useState(0);
    const [seller, setSeller] = useState(0);
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
                draft.push(<Chatmsg key={key} text={data.text} orderid={data.orderid} name={data.name} />)
            })
        });

        prop.object.chatmessages.forEach(data => {
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
    
    return (
        <div>
            {seller ? <MarkAsSent orderstate={orderstate}orderid={prop.object.orderID}/> : <CompleteOrder orderstate={orderstate}orderid={prop.object.orderID}/>}
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
                <div className="formContainer">
                    <h4>Markera att varan är skickad {prop.orderid}</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="submit" value="submit" />
                    </form>
                </div>
            );
        }
        else if (prop.orderstate==1) {
            return (
                <div className="formContainer">
                    <h4> Varan skickad väntar på att köpare konfirmerar </h4>
                </div>
            );
        }
        else if (prop.orderstate==2) {
            return (
                <div className="formContainer">
                    <h4> Escrow klar </h4>
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
        if (data.rating <6 && data.rating >0) {
            submit(data)
        }
        else {
            alert("1-5");
        }
    };
    function submit(data) {
        let sendjson = {orderid:prop.orderid,rating:data.rating}
        axios.post(`/api/addreview`, sendjson, { withCredentials: true })
            .then(res => {
            })
            .catch(function (error) {
                console.log(error)
            });
    }
    if (prop.orderstate == 0) {
        return (
            <div className="formContainer">
                <h4> Väntar på säljare </h4>
            </div>
        );

    }
    if (prop.orderstate==2) {
        return (
            <div className="formContainer">
                <h4> Escrow klar </h4>
            </div>
        );
        
    }
    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"form"}>
                    <label htmlFor="rating">1-5</label>
                    <input
                        name="rating"
                        placeholder="1-5"
                        ref={register({ required: true })}
                    />
                    {errors.rating && <p>This is required</p>}
                </div>
                <input type="submit" value="submit" />
            </form>
        </div>
    );
}






export default main;