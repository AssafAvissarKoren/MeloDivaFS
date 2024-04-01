import React, { useState } from 'react';
import { queryService } from '../services/query.service';
import { svgSvc } from '../services/svg.service';

async function printQuery() {
    const query = await queryService.findQuery("infinite sheldon")
    console.log("printQuery", query)
}

export const Test = ({ setCurrentCategory }) => {
    return (
        <div style={{ overflowY: 'scroll' }}>
            <svgSvc.general.ListDisplay/>
            <button onClick={async () => await printQuery()}>Action Jackson!</button>
            <br />
        </div>
    );
};
