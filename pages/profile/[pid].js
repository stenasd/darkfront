import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useImmer } from 'use-immer';
import { useRouter } from 'next/router'
import textData1 from '../../texterSvenska.json'
let textData = textData1.profile
function Main() {
    const router = useRouter()
    const { pid } = router.query
    const [resObj, setResObj] = useState({});
    useEffect(() => {
        if (!router.isReady) return;
        axios.get('/api/user', {
            withCredentials: true,
            params: {
                nick: pid
            }
        })
            .then(res => {
                console.log(res)
                if(res){
                    setResObj(res.data)
                }
                else{
                    setResObj({nick:"user not found"})
                }
            })
            .catch((error) => {
                console.log("getmoveerror")
            });
    }, [router.isReady]);

    return (
        <div>
            <h4>
                {"name "+resObj.nick}
                <br></br>
                {"disc "+resObj.disc}
                <br></br>
                {"rating "+resObj.rating}
                <br></br>
                {"ratingNr "+resObj.ratingNr}
                <br></br>
                {"wonDisputes "+resObj.wonDisputes}
                <br></br>
                {"lostDisputes "+resObj.lostDisputes}
            </h4>
        </div>
    )
}

export default Main
