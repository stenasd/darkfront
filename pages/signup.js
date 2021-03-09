import React from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import textData1 from '../texterSvenska.json'

export default function App() {
    const { register, errors, handleSubmit } = useForm({
        mode: "onChange"
    });
    const onSubmit = data => {
        submit(data)
    };
    function submit(data) {
        axios.post(`/api/signup`, { data }, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                if (res.data.duplname) {

                    alert(textData1.signup.duplname);
                }
                if (res.data.duplnick) {

                    alert(textData1.signup.duplnick);
                }
                if (res.data.succ) {
                    alert(textData1.signup.regist)
                }
            })
            .catch(function (error) {
                console.log(error)

            });

    }
    return (

        <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={"form"}>
                    <label htmlFor="name">Username </label>
                    <input
                        name="name"
                        placeholder="name"
                        ref={register({ required: true })}
                    />
                    {errors.name && <p>This is required </p>}
                </div>

                <div className={"form"}>
                    <label htmlFor="nick">nick</label>
                    <input
                        name="nick"
                        placeholder="nick"
                        ref={register({ required: true })}
                    />
                    {errors.nick && <p>This is required</p>}
                </div>

                 <div className={"form"}>
                    <label htmlFor="pass">password 1</label>
                    <input
                        type="password"
                        name="pass"
                        placeholder="pass"
                        ref={register({ required: true })}
                    />
                    {errors.pass && <p>This is required</p>}
                </div>
                <div className={"form"}>
                    <label htmlFor="pass2">password 2</label>
                    <input
                        type="password"
                        name="pass2"
                        placeholder="pass2"
                        ref={register({ required: true })}
                    />
                    {errors.password2 && <p>This is required</p>}
                </div>
                <div className={"form"}>
                    <label htmlFor="refer">refer</label>
                    <input
                        name="refer"
                        placeholder="refer"
                        ref={register({ required: true })}
                    />
                    {errors.refer && <p>This is required</p>}
                </div>

                <input type="submit" />
            </form>
        </div>
    );
}
