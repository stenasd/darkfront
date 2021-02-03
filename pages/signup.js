import React, { useState, useEffect } from "react";
import axios from 'axios';
export default function PersonList() {
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [pass2, setPass2] = useState("");
    const [nick, setNick] = useState("");
    const [refer, setRefer] = useState("");


    const onSetName = event => {
        setName(event.target.value);
    };
    const onSetPass = event => {
        setPass(event.target.value);
    };
    const onSetPass2 = event => {
        setPass2(event.target.value);
    };
    const onSetNick = event => {
        setNick(event.target.value);
    };
    const onSetRefer = event => {
        setRefer(event.target.value);
    };
    function submit() {
        let signupobj = {
            name:name,
            pass:pass,
            nick:nick,
            refer:refer
        }
        axios.post(`/api/signup`, { signupobj })
        .then(res => {
          console.log(res.data);
        })
    
      }

    return (
        <div>
            <p>
                Name: <input type="text" value={name} onChange={onSetName} />
                Pass:<input type="password" value={pass} onChange={onSetPass} />
                Pass2:<input type="password" value={pass2} onChange={onSetPass2} />
                Referal Code:<input type="text" value={refer} onChange={onSetRefer} />
                Nickname:<input type="text" value={nick} onChange={onSetNick} />
                <button onClick={submit}>
                    send
                </button>
            </p>
        </div>
    )
}