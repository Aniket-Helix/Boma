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

    async function createProject(id: String, data?: Prisma.ProjectCreateInput) {

        return fetch(`/api/update`, {
            method: "PATCH", credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, id, data })
        }).then(res => res.json()).then(res => res.msg)
    }

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
            {project?.map(proj => {

                const [name, setName] = useState(proj.name);
                const [msg, setMgs] = useState("");
                const [date, setDate] = useState<Date>(proj.date);
                const [state, setState] = useState<State>(proj.state);
                const [disabled, setDisabled] = useState(true);

                const handleChange = (e, { value }) => setState(value);
                return <Form key={proj.id}
                    onSubmit={async () => {
                        if (!disabled) return;

                        const body: Prisma.ProjectCreateInput = {
                            name,
                            state,
                            date: date ?? null,
                        };
                        setMgs(await createProject(proj.id, body));
                    }}
                >
                    <Form.Group widths="equal">
                        <Label>{proj.id}</Label>
                        <br />
                        <Form.Input
                            disabled={disabled}
                            fluid
                            label="Name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />

                        <Form.Input
                            disabled={disabled}
                            fluid
                            type="date"
                            label="date"
                            //placeholder="date"
                            value={date}
                            onChange={(e) => { console.log(e.target.valueAsDate); setDate(e.target.valueAsDate) }}
                        />
                        <Form.Select
                            disabled={disabled}
                            fluid
                            label="State"
                            placeholder="State"
                            options={options}
                            value={state}
                            onChange={handleChange}
                        />
                        <Form.Button onClick={() => user_id && setDisabled(!disabled)}>Update</Form.Button>
                    </Form.Group>
                    {msg && <Segment color='red'>{msg}</Segment>}
                    <br />
                </Form>
            }
            )}
        </Container>
    </>
    );
}