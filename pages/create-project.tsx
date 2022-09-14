import Head from "next/head";
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
import { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import App from "next/app";
import link from "next/link";
import { type } from "os";
import style from "styled-jsx/style";
import { useRouter } from "next/router";

const options = [
    { key: "d", text: "Propose", value: "Propose" },
    { key: "u", text: "Closed", value: "Closed" },
    { key: "a", text: "Open", value: "Open" },
];

export default function Home() {
    const [projectNum, setProjectNum] = useState(0);
    const [project, setProject] = useState<{
        "id": "",
        "name": "",
        "state": "",
        "date": ""
    }>({
        "id": "",
        "name": "",
        "state": "",
        "date": ""
    });
    const [name, setName] = useState("");
    const [date, setDate] = useState<Date>();
    const [state, setState] = useState();
    const [user_id, setuser_id] = useState(0);
    const router = useRouter();
    const {id} = router.query;
    const handleChange = (e, { value }) => setState(value);

    function createProject(body?: Prisma.ProjectCreateInput) {
        fetch(`/api/create?id=${id}`, {
            method: "POST", credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => {
            setProjectNum(res.leng)
            if (res.savedUser) setProject(res.savedUser)
        })
    }

    //useEffect(() => {
        // if (typeof window === "undefined" || user_id == 0) return;
        // createProject();
    //}, []);

    return (<>
        <Head>
            <title>Create Next App</title>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
            />
        </Head>
        <Container style={{ margin: 20 }}>
            <Header as="h3">
                Create Project
            </Header>

            <Form.Input
                fluid
                label="Id"
                placeholder="Enter your Id"
                value={id}
                disabled
               // onChange={(e) => parseInt(e.target.value) > 0 && setuser_id(parseInt(e.target.value))}
            />
            <br />
            {/* {projectNum > 0 ?  */}
            <Form
                onSubmit={async () => {
                    const body: Prisma.ProjectCreateInput = {
                        name,
                        state,
                        date,
                    };
                    createProject(body)
                    setName("");
                    setState(null);
                    setDate(null);
                }}
            >
                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="Name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />

                    <Form.Input
                        fluid
                        type="date"
                        label="date"
                        placeholder="date"
                        onChange={(e) => setDate(e.target.valueAsDate)}
                    />
                    <Form.Select
                        fluid
                        label="State"
                        placeholder="State"
                        options={options}
                        value={state}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Button>Submit</Form.Button>
            </Form>
            {/* : <h1>You dont have permission to create a project</h1>} */}
            {project.name && <>
                <Divider horizontal>Projects</Divider>

                <Table basic="very" celled >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row >
                            <Table.Cell>
                                <Header as="h4" image>
                                    <Header.Content>
                                        {project.name}
                                        <Header.Subheader>{(project.state)}</Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{project.state}</Table.Cell>
                            <Table.Cell>{project.date}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </>}
        </Container>
    </>
    );
}