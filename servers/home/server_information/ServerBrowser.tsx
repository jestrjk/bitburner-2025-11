import {NS, Server} from "NetscriptDefinitions";
import React, {useState, useEffect} from 'react';

import {readServerList} from "./ServerInformationList";

let intervalId = 0;

const sortByHostname = (a:Server, b:Server) => a.hostname.localeCompare(b.hostname);
const sortByMoneyMax = (a:Server, b:Server) => b.moneyMax - a.moneyMax;
const sortByMoneyAvailable = (a:Server, b:Server) => b.moneyAvailable - a.moneyAvailable;

let sortFunction = sortByHostname;

function customStyles() {
  return <style>
    {'.money-col { text-align: right; } .hostname-col { text-align: left; }'}
    {'td,th { padding-left: .2em; padding-right: .2em; }'}  
    {'th{ .2em; text-decoration: underline; cursor: s-resize;}'}
    </style>;
}

export function ServerBrowser( { ns }: { ns:NS } ) {
  const [serverList, setServerList] = useState<Server[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [displayUnrootedServers, setDisplayUnrootedServers] = useState(false);
  
  const fetchServers = ( newSortFunction:(a:Server, b:Server) => number ) => {
    // Theres got to be a better way to do this. Maybe not.
    // Im being lazy and dont want to explicitly set the sort function and then
    // have to call fetchServers(sortFunction) in the header click events
    sortFunction = newSortFunction;

    let data = readServerList(ns)
    ns.tprint( `fetchServers:DisplayUnrootedServers: ${displayUnrootedServers}`)
    if ( !displayUnrootedServers ) {
      data.servers = data.servers.filter( s => s.hasAdminRights )
    }
    setServerList( data.servers.sort(sortFunction) )
    setLastUpdated( data.last_updated )
  } 

  const displayUnrootedServersClick = () => {
    setDisplayUnrootedServers(!displayUnrootedServers)
  }

  let filterControls = <div>
    <button className={`btn ${displayUnrootedServers ? 'active' : ''}`} 
      onClick={() => displayUnrootedServersClick()}>Un-Rooted Servers</button>
    </div>;

  let sortHeader = ( <tr>
    <th className="hostname-col" onClick={() => fetchServers(sortByHostname)}><b>Hostname</b></th>
    <th className="money-col" onClick={() => fetchServers(sortByMoneyAvailable)}><b>$</b></th>
    <th className="money-col" onClick={() => fetchServers(sortByMoneyMax)}><b>Max$</b></th>
    </tr> );

  useEffect( () => {
    
    fetchServers(sortFunction)
    intervalId = setInterval(() => fetchServers(sortFunction), 2000);

    return () => clearInterval(intervalId);
  }, [ns]);

  

  return ( <div>
    {customStyles()}
      {filterControls}
      <table>
        <thead>{sortHeader}</thead>
        <tbody> 
          {serverList.map(server => ( <tr>
            <td className="hostname-col">{server.hostname}</td>
            <td className="money-col">{ns.formatNumber(server.moneyAvailable,1)}</td>
            <td className="money-col">{ns.formatNumber(server.moneyMax,1)}</td>
            </tr> )
          )}
        </tbody>
      </table>
    <div>Updated: {getLastUpdatedDateTime(lastUpdated)} ({lastUpdated})</div>
    </div> )
}

function getLastUpdatedDateTime(lastUpdate:number) {
  try {
    return new Date(lastUpdate).toLocaleString()
  } catch (e) {
    return "Unknown"
  }
}


export async function main(ns: NS) {
  ns.clearLog()
  ns.ui.openTail();
  ns.disableLog("scan")
  ns.disableLog("asleep")
 
  ns.printRaw( <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"></link>)
  ns.printRaw( <ServerBrowser ns={ns} />);
  
  // return  new Promise( () => {} )

  ns.atExit( () => {
    clearInterval(intervalId)
  })

  while ( true ) {
    await ns.asleep(2000)
  }
}