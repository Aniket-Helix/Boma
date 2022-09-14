import _ from 'lodash'
import React from 'react'
import Head from "next/head";
import { Container, Form, Header, Table } from 'semantic-ui-react'
import { useState, useEffect } from "react";
import { Prisma, PrismaClient, State } from "@prisma/client";


function exampleReducer(state, action) {
    switch (action.type) {
        case 'CHANGE_SORT':
            if (state.column === action.column) {
                return {
                    ...state,
                    data: state.data.slice().reverse(),
                    direction:
                        state.direction === 'ascending' ? 'descending' : 'ascending',
                }
            }
            return {
                column: action.column,
                data: _.sortBy(state.data, [action.column]),
                direction: 'ascending',
            }
        case 'STATE': return {
            column: action.column,
            data:_.filter(
                action.data, function(o) {
                   return o.state  == action.column;
                }
            )
        }
        case 'NAME': return {
            column: action.column,
            data:_.filter(
                action.data, function(o) {
                   return o.name.toLowerCase().includes(action.column.toLowerCase())
                }
            )
        }
        case 'DATE': return {
            column: action.column,
            data:_.filter(
                action.data, function(o) {
                   return o.date.toString() == (action.column.toString())
                }
            )
        }
        default:
            throw new Error()
    }
}
const options = [
    { key: "d", text: "Propose", value: "Propose" },
    { key: "u", text: "Closed", value: "Closed" },
    { key: "a", text: "Open", value: "Open" },
];

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
    const [state, dispatch] = React.useReducer(exampleReducer, {
        column: null,
        data: projects,
        direction: null,
    })
    const { column, data, direction } = state

    return (
        <><Head>
            <title>Create Next App</title>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head><Container style={{ margin: 20 }}>
                <Header as="h3">
                    All Project
                </Header>
                <Table sortable basic="very" celled collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                            >
                                Id
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'name' ? direction : null}
                                // onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
                                onClick={() => dispatch({ type: 'FILTER', column: 'state', direction: 'Open' })}
                            >
                                Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'state' ? direction : null}
                                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'state' })}
                            >
                                State
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'date' ? direction : null}
                                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'date' })}
                            >
                                Date
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map(({ id, state, name, date }) => (
                            <Table.Row key={id}>
                                <Table.Cell>{id}</Table.Cell>
                                <Table.Cell>{name}</Table.Cell>
                                <Table.Cell>{state}</Table.Cell>
                                <Table.Cell>{date}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="Name"
                        placeholder="Name"
                       // onChange={(e) => {console.log( e.target.value)}}
                       onChange={(e) => dispatch({ data:projects,type: 'NAME', column: e.target.value })}
                    />
                    <br />

                    <Form.Input
                        fluid
                        type="date"
                        label="date"
                        placeholder="date"
                       onChange={(e) => dispatch({ data:projects,type: 'DATE', column:e.target.valueAsDate })}
                       // onChange={(e) => {console.log( e.target.value)}}
                    />
                    <Form.Select
                        fluid
                        label="State"
                        placeholder="State"
                        options={options}
                        onChange={(e,value) => dispatch({data:projects, type: 'STATE', column: value.value})}
                    />
                </Form.Group>
            </Container>
            </>
    )
}

