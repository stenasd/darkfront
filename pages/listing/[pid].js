import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
const ENDPOINT = "http://127.0.0.1:8081";
function Main() {
    const router = useRouter()
    const { pid } = router.query
    const [text, setText] = useState({});
    const [products, setProducts] = useImmer([]);
    useEffect(() => {
        if (!router.isReady) return;
        axios.get('/api/getListing', {
            withCredentials: true,
            params: {
                listingID: pid
            }
        })
            .then(res => {
                setText(res.data)
                console.log(res.data)
                let key = 0
                res.data.products.forEach(element => {
                    setProducts(draft => {
                        console.log(key)
                        draft.push(
                            <Prod key={key} object={element}
                            />)
                        key++;

                    })

                });

            })
            .catch((error) => {
                console.log("getmoveerror")
            });


    }, [router.isReady]);

    return (
        <div>
            <h1>{text.titel}</h1>
            <h1>{text.text}</h1>
            <ul>
                {products}
            </ul>
        </div>
    )
}
function Prod(prodData) {
    const [quant, setQuant] = useState(0);
    console.log(prodData)
    function submit() {
        prodData.buyProduct(prodData.id, quant)
    }
    return (
        <div className="card">

            <h3>
                {"titel:"}{prodData.object.name}
                {'     '}
                {"price:"}{prodData.object.price}
            </h3>
                Quant: <input type="number" value={quant} onChange={setQuant} />
            <button onClick={submit}>
                buy
                </button>

        </div>
    )
}

export default Main
