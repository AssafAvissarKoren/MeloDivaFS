import React, { useState } from 'react';
import { queryService } from '../services/query.service';

async function printQuery() {
    const query = await queryService.findQuery("infinite sheldon")
    console.log("printQuery", query)
}

export const Test = ({ setCurrentCategory }) => {
    return (
        <div style={{ overflowY: 'scroll' }}>
            <button onClick={async () => await printQuery()}>Action Jackson!</button>
            <br />
        </div>
    );
};
