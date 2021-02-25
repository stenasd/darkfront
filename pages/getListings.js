import { Column, Table } from 'react-virtualized';
import React from 'react';
import styled from 'styled-components'
export default function app() {

    const list = [
        {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'}, {name: 'Brian Vaughn', description: 'Software engineer'},
        // And so on...
      ];
    return (
        <Table
            width={300}
            height={300}
            headerHeight={100}
            rowHeight={100}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}>
            <Column label="Name" dataKey="name" width={500} />
            <Column width={500} label="Description" dataKey="description" />
        </Table>
    );
    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
    }) {
        return (
            <div key={key}>
                <h1>
                    {list[index]}
                </h1>
                <img src="https://i.pinimg.com/originals/1a/57/49/1a57497e26218d7b134d7cd25468bb52.jpg" alt="Logo" />
            </div>
        );
    }

}


