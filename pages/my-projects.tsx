import {
    Button,
    Container,
    Divider,
    Form,
    Header,
    Icon,
    Image,
    Table,
} from "semantic-ui-react";
import _ from 'lodash'
import Head from "next/head";

import { useEffect, useState } from 'react';
import { Router, useRouter } from "next/router";

export default function Home() {
    const [user, setuser] = useState([]);
    const [user_id, setuser_id] = useState(0);
    const [createAccess, setCreateAccess] = useState(false);
const router = useRouter();
    useEffect(() => {
        if (typeof window === "undefined" || user_id === 0) return;

        fetch(`/api/get?id=${user_id}`, {
        }).then(res => res.json()).then(res => {
            if(_.isEmpty(res)) return;
            setCreateAccess(false)
            res?.forEach(r=>{
                   if(r.permit !== 'Create') 
                   return;
                   setCreateAccess(true)
             })
            setuser([...res])
        })
        return ()=>setCreateAccess(false)
    }, [user_id]);

    function handleClick(e){
        router.push(`/create-project?id=${user_id}`)
    }

    return (
        <><Head>
            <title>Create Next App</title>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head>
        <Container style={{ margin: 20 }}>
                <Header as="h3">
                    My Projects
                </Header>

                {user.length === 0 ?


                    <Form.Input
                        fluid
                        label="Id"
                        placeholder="Enter your Id"
                        value={user_id}
                        onChange={(e) => parseInt(e.target.value) > 0 && setuser_id(parseInt(e.target.value))} />

                    :
                    <> <h1> user_id:: {user[0]?.user_id}  {createAccess && <Button onClick={handleClick}>create</Button>} </h1>

                        {user.map(u => <div key={u.id}>
                            <ul>
                                <li>id:: {u.id}</li>
                                <li>project_id:: {u.project_id}</li>
                                <li>permit:: {u.permit}</li>
                                <li>Project name:: {u?.project?.name}</li>
                                <li>state:: {u?.project?.state}</li>
                                <li>date:: {u?.project?.date}</li>
                            </ul>
                        </div>)}
                    </>}
            </Container></>
    )
}
