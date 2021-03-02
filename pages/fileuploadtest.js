import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";

function App() {
    const { register, handleSubmit } = useForm()

    async function onSubmit(data) {
        console.log(data)

        let fd = new FormData();
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        fd.append('file', data.file[0])
        fd.append('name',"sten")
        let imgres = await axios.post("/api/imagePost", fd, config
        );
        console.log(imgres.data.name)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input ref={register} type="file" name="file" />
            <button>Submit</button>
        </form>
    );
}

export default App;