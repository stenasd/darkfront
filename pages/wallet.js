import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import Link from 'next/link'
function main() {
    const [currentAdress, setcurrentAdress] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    function getNewAdress() {
        axios.post('/api/creatAdress')
            .then(function (response) {
                console.log(response.data)
                setcurrentAdress(response.data.adrr)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function getRecentAdress() {
        axios.get('/api/getCurrentAdress')
            .then(function (response) {
                console.log(response.data.adrr)
                setcurrentAdress(response.data.adrr)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        axios.get('/api/checkAuthentication', { withCredentials: true })
            .then(res => {
                console.log("authenticated")
                setLoggedIn(res.data.authenticated);
                getRecentAdress();

            })
            .catch((error) => {
                console.log("notauthenticated")
                setLoggedIn(false)
            });
    }, []);
    return (
        <div>
            <h1>{currentAdress}</h1>
            <button onClick={getNewAdress}>
                Ny adress
            </button>
        </div>
    );
}

export default main;






