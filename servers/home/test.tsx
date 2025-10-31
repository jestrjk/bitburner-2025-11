import {NS, Server} from "NetscriptDefinitions";
import React, {useState, useEffect} from 'react';

import {readServerList} from "./server_information/ServerInformationList";

export function ServerBrowser( { ns }: { ns:NS } ) {
  const [serverList, setServerList] = useState<Server[]>([]);
  const [lastUpdated, setLastUpdated] = useState(0);
  
  useEffect( () => {
    
    let intervalId = 0
    const fetchServers = async () => {
      setServerList( await readServerList(ns) )
      setLastUpdated(Date.now())
    } 

    fetchServers()
    intervalId = setInterval(fetchServers, 2000);

    return () => clearInterval(intervalId);

  }, [ns]);
  
  return ( <div>
    <table>
      <thead><tr><td>Hostname</td><td>Max$</td><td>$</td></tr></thead>
      <tbody>
        {serverList.map(server => 
          ( <tr><td>{server.hostname}</td><td>{server.moneyMax}</td><td>{server.moneyAvailable}</td></tr> )
        )}
      </tbody>
    </table>
    <div>Updated: {lastUpdated}</div>
    </div> )
}

export async function main(ns: NS) {
  ns.ui.openTail();
  ns.disableLog("scan")
  
  ns.printRaw( <ServerBrowser ns={ns} />);
  
  return  new Promise( () => {} )
}