import Head from "next/head";
import {
    Button,
    Container,
    Divider,
    Form,
    Header,
    Icon,
    Image,
    Label,
    Segment,
    Table,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Prisma, PrismaClient, State } from "@prisma/client";

const options = [
    { key: "d", text: "Propose", value: "Propose" },
    { key: "u", text: "Closed", value: "Closed" },
    { key: "a", text: "Open", value: "Open" },
]
export async function getServerSideProps() {
    const prisma = new PrismaClient();
    const project = await prisma.project.findMany();

    const projects = project.map(proj => ({
        ...proj,
        date: proj?.date?.toJSON() || ""
    }));
    return {
        props: {
            projects
        }
    }

}
export default function Home({ projects }) {
    const [project, setProject] = useState<{
        "id": "",
        "name": string,
        "state": State,
        "date": Date
    }[]>(projects);

    const [user_id, setuser_id] = useState(0);


    async function deleteProject(id: String) {

        return fetch(`/api/delete`, {
            method: "DELETE", credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, id })
        }).then(res => res.json()).then(res => {
            console.log(res)
            if (res.msg) {
                setMgs(res.msg);
                return res.msg
            }
            setProject(project.filter((proj) => proj.id !== id))
            // setProject(project.filter((proj) => proj !== u))
        })
    }
    const [msg, setMgs] = useState("");
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
                value={user_id}
                onChange={(e) => parseInt(e.target.value) > 0 && setuser_id(parseInt(e.target.value))}
            />
            <br />
            {msg && <Segment color='red'>{msg}</Segment>}
            <br />
            <Divider horizontal>Users</Divider>

            <Table basic="very" celled collapsing>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>name</Table.HeaderCell>
                        <Table.HeaderCell>state</Table.HeaderCell>
                        <Table.HeaderCell>date</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {project.map((u, index) => {

                        return <Table.Row key={index}>
                            <Table.Cell>
                                <Header as="h4" image>
                                    <Header.Content>
                                        {u.name}
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{u.state}</Table.Cell>
                            <Table.Cell>{u?.date?.toString()}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    disabled={!user_id}
                                    animated="fade"
                                    color="red"
                                    onClick={async () => {
                                        setMgs(await deleteProject(u.id));

                                    }}
                                >
                                    <Button.Content visible>Delete</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="user delete" />
                                    </Button.Content>
                                </Button>
                            </Table.Cell>
                            {/* <Table.Cell>  </Table.Cell> */}
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
        </Container>
    </>
    );
}