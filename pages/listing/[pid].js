import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
const ENDPOINT = "http://127.0.0.1:8081";
function Main() {
    const router = useRouter()
    const { pid } = router.query
    const [text, setText] = useState({});
    const [products, setProducts] = useImmer([]);
    const [order, setOrder] = useImmer([]);
    function submit() {
        axios.post('/api/addOrder', order,{ withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function updateorder(param) {
        console.log(param)
        setOrder(draft => {
            draft.splice(param.index, 1, param)
        })
    }
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
                let key = 0
                res.data.products.forEach(element => {
                    setProducts(draft => {
                        draft.push(
                            <Prod key={key} object={element} updateorder={updateorder} index={key}
                            />
                        )
                    })
                    setOrder(draft => {
                        draft.push({ productid: element.id, quant: 0 })
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
            <button onClick={submit}>
                buy
            </button>


        </div>
    )
}
function Prod(prodData) {
    const [quant, setQuant] = useState(0);
    const onSetName = event => {
        setQuant(event.target.value);
        let orderobject = {
            productid: prodData.object.id,
            quant: event.target.value,
            index: prodData.index
        }
        prodData.updateorder(orderobject)
    };
    return (
        <div className="card">

            <h3>
                {"titel:"}{prodData.object.name}
                {'     '}
                {"price:"}{prodData.object.price}
            </h3>
                Quant: <input type="number" value={quant} onChange={onSetName} />


        </div>
    )
}

export default Main
