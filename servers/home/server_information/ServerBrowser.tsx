import {NS, Server} from "NetscriptDefinitions";
import React, {useState, useEffect} from 'react';

import {readServerList, ServerListData} from "./ServerInformationList";

let intervalId = 0;

const sortByHostname = (a:Server, b:Server) => a.hostname.localeCompare(b.hostname);
const sortByMoneyMax = (a:Server, b:Server) => b.moneyMax - a.moneyMax;
const sortByMoneyAvailable = (a:Server, b:Server) => b.moneyAvailable - a.moneyAvailable;

let sortFunction = sortByHostname;

export function ServerBrowser( { ns }: { ns:NS } ) {
  const [serverList, setServerList] = useState<Server[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  
  const fetchServers = async ( newSortFunction:(a:Server, b:Server) => number ) => {
    // Theres got to be a better way to do this. Maybe not.
    // Im being lazy and dont want to explicitly set the sort function and then
    // have to call fetchServers(sortFunction) in the header click events
    sortFunction = newSortFunction;
    let data = readServerList(ns)
    setServerList( data.servers.sort(sortFunction) )
    setLastUpdated( data.last_updated )
  } 

  let sortHeader = ( <tr>
    <th className="hostname-col" onClick={() => fetchServers(sortByHostname)} text-align="left"><b>Hostname</b></th>
    <th className="money-col" onClick={() => fetchServers(sortByMoneyAvailable)} text-align="right"><b>$</b></th>
    <th className="money-col" onClick={() => fetchServers(sortByMoneyMax)} text-align="right"><b>Max$</b></th>
    </tr> );

  useEffect( () => {
    
    fetchServers(sortFunction)
    intervalId = setInterval(() => fetchServers(sortFunction), 2000);

    return () => clearInterval(intervalId);
  }, [ns]);

  let getLastUpdatedDateTime = () => {
    try {
      return new Date(lastUpdated).toLocaleString()
    } catch (e) {
      return "Unknown"
    }
  }

  let styles = <style>
    {'.money-col { text-align: right; } .hostname-col { text-align: left; }'}
    {'td,th { padding-left: .2em; padding-right: .2em; }'}  
    {'th{ .2em; text-decoration: underline; cursor: s-resize;}'}
    </style>;

  return ( <div>
    {styles}
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
    <div>Updated: {getLastUpdatedDateTime()} ({lastUpdated})</div>
    </div> )
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