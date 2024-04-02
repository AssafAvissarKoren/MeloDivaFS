import React, { useState } from 'react';
import { queryService } from '../services/query.service';
import { svgSvc } from '../services/svg.service';
import { stationService } from '../services/station.service';
import { useSelector } from 'react-redux';

async function printQuery() {
    const query = await queryService.findQuery("infinite sheldon")
    console.log("printQuery", query)
}

async function printStations() {
    const stations = await stationService.getStations()
    console.log("printStations", stations.map(station => station.name))
}


async function printQueueStation() {
    const queueStation = useSelector(state => state.queueModule.station);
    console.log("printStation", queueStation)
}

export const Test = ({ setCurrentCategory }) => {
    return (
        <div style={{ overflowY: 'scroll' }}>
            <button onClick={async () => await printQueueStation()}>Action Jackson!</button>
            <br />
        </div>
    );
};
