import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form'
import { useImmer } from 'use-immer'
import textData1 from '../texterSvenska.json'
let textData = textData1.creatListing

//add # to get matched

export default function App() {
    const [prods, setProds] = useImmer([]);
    const [prodsData, setProdsData] = useImmer([]);
    const [count, setCount] = useState(0);
    const [confirmed,setConfirmed] = useState(false);
    async function onSubmitListing(data) {
        const sendarray = prodsData.filter(n => n)
        console.log(sendarray)
        console.log(data)
        let fd = new FormData();
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        fd.append('file', data.file[0])
        //let imgres = await axios.post("/api/imagePost", fd, config);
        console.log(data)
        fd.append("creatProduct",JSON.stringify(sendarray))
        fd.append("creatListing",JSON.stringify(data))
        console.log(fd)
        axios.post('/api/creatListing', fd,config)
            .then(function (response) {
                console.log(response);
                if(response.status==200){
                    setConfirmed(true)
                }
            })
            .catch(function (error) {
               
                console.log(error);
            });
    }

    function onSubmitProduct(data) {
        setCount(count + 1)
        console.log(data);
        setProds(draft => {
            draft.push(<Prod key={count} text={data.text} price={data.price} index={count} removeProduct={removeProduct} />)
        })
        setProdsData(draft => {
            draft.push(data)
        })
    }
    function removeProduct(param) {
        console.log("function called" + param)
        setProds(draft => {
            draft.splice(param, 1, null)
        })
        setProdsData(draft => {
            draft.splice(param, 1, null)
        })
    }
    if(confirmed){
        return(
            <h4>{"listing created"}</h4>
        )
    }
    return (
        <div>
            <CreateProducts onSubmitProduct={onSubmitProduct} />
            <CreateListings onSubmitListing={onSubmitListing} />
            <li>
                {prods}
            </li>
        </div>
    );
}
function Prod(prodData) {
    console.log(prodData)
    function submit() {
        prodData.removeProduct(prodData.index)
    }
    return (
        <div className="card">

            <h3>
                {prodData.text}
                {prodData.price}
                <button onClick={submit}>
                    remove
            </button>
            </h3>
        </div>
    )
}
function CreateListings(prodData) {
    const { register, handleSubmit, errors } = useForm();
    function onSubmitListing(data) {
        prodData.onSubmitListing(data)
        console.log(data);
    }
    return (
        <div>

            <form onSubmit={handleSubmit(onSubmitListing)}>
                <h1>{textData.listingH1titel}:</h1>
                <input ref={register} type="file" name="file" />
                <p>{textData.listingPDisc}</p>

                <input type="text" placeholder={textData.listingTitlePlaceholder} name="titel" ref={register({ required: true, maxLength: 100 })} />
                <input type="text" placeholder={textData.listingDiscPlaceholder} name="text" ref={register({ required: true, maxLength: 80 })} />
                <button type="submit">{textData.listingSubmitButton}</button>
            </form>
        </div>
    );
}
function CreateProducts(prodData) {
    const { register, handleSubmit, errors } = useForm();

    function onSubmit(data) {
        prodData.onSubmitProduct(data)
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{textData.productH1titel}:</h1>
                <p>{textData.productPDisc}</p>
                <input type="text" placeholder={textData.productTextPlaceHolder} name="text" ref={register({ required: true, maxLength: 80 })} />
                <input type="text" placeholder={textData.productPricePlaceHolder} name="price" ref={register({ required: true, maxLength: 100 })} />
                <button type="submit">{textData.productSubmitButton}</button>
            </form>
        </div>
    );
}

