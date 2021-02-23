import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form'
import { useImmer } from 'use-immer';

//listing quarry {"name":"testname","text":"asdasd","sellerid":"1","products":[2,1]}
//product form {"name":"testname","price":69,"image":"testimage"}

//products and option to add products to listing and display current products and remove them
export default function App() {
    const { register, handleSubmit, errors } = useForm();
    const [orders, setOrders] = useImmer([]);
    const onSubmit = data => console.log(data);
    console.log(errors);
    let key = 0
    function addProduct() {
        setOrders(draft => {
            draft.push(<Prod key={key} text={data.text} orderid={data.orderid} name={data.name} index={key} />)
        })
        key++;
    }
    function removeProduct(param) {
        setOrders(draft => {
            draft.splice(param.index, 1)
        })

    }




    return (<div>
        <Prod setOrders={setOrders}/>
        <p>{orders}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Product:</h1>
            <input type="text" placeholder="Titel" name="Titel" ref={register({ required: true, maxLength: 80 })} />
            <input type="text" placeholder="Pris" name="Pris" ref={register({ required: true, maxLength: 100 })} />
            <input type="submit" />
        </form>
        <li>
            {orders}
        </li>

        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>listing:</h1>
            <input type="text" placeholder="Titel" name="Titel" ref={register({ required: true, maxLength: 80 })} />
            <input type="text" placeholder="Pris" name="Pris" ref={register({ required: true, maxLength: 100 })} />
            <input type="submit" />
        </form>

    </div>
    );
}
function Prod(setOrders) {
    function submit() {
       
      setState("poop")

    }
    return (

        <div className="card">
            
            <button onClick={submit}>
                send
            </button>

        </div>
    )
}