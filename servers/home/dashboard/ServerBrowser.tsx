import {Server} from "NetscriptDefinitions";
import React, {useState, useEffect} from 'react';
import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from '../runtime_data_managment/runtime_data_manager';
import { ServerListData } from '../runtime_data_polling/ServerListData';
import { _exec } from '../lib/exec';

let intervalId = 0;

// Be careful here, this can go out of scope. But i don't want to pollute
// react components with ns
let _ns:NS; 

const hackServer = (server:Server) => {
    _exec(_ns, 'hacks/hack.js', 'home',  100 , server.hostname )
  }

const growServer = (server:Server) => {
    _exec(_ns, 'hacks/grow.js', 'home',  100 , server.hostname )
  }

const weakenServer = (server:Server) => {
    _exec(_ns, 'hacks/weaken.js', 'home',  100 , server.hostname )
  }

const sortByHostname = (a:Server, b:Server) => a.hostname.localeCompare(b.hostname);
const sortByMoneyMax = (a:Server, b:Server) => b.moneyMax - a.moneyMax;
const sortByMoneyAvailable = (a:Server, b:Server) => b.moneyAvailable - a.moneyAvailable;
const sortByIsAdmin = (a:Server, b:Server) => { 
  const isAdmin_A = a.hasAdminRights ? 1 : 0; 
  const isAdmin_B = b.hasAdminRights ? 1 : 0; 
  if ( isAdmin_A === isAdmin_B ) {
    return a.hostname.localeCompare( b.hostname );
  }
  return isAdmin_A - isAdmin_B; 
};
const sortByHackDifficulty = (a:Server, b:Server) => b.hackDifficulty - a.hackDifficulty;
const sortByMinDifficulty = (a:Server, b:Server) => b.minDifficulty - a.minDifficulty;
const sortByRequiredHackingSkill = (a:Server, b:Server) => b.requiredHackingSkill - a.requiredHackingSkill;
const sortByGrowTime = (a:Server, b:Server) => _ns.getGrowTime(b.hostname) - _ns.getGrowTime(a.hostname);
const sortByHackTime = (a:Server, b:Server) => _ns.getHackTime(b.hostname) - _ns.getHackTime(a.hostname);
const sortByWeakenTime = (a:Server, b:Server) => _ns.getWeakenTime(b.hostname) - _ns.getWeakenTime(a.hostname);

let sortFunction = sortByHostname;

function customStyles() {
  return <style>
    {'.r { text-align: right; } .hostname-col { text-align: left; }'}
    {'td,th { padding-left: .2em; padding-right: .2em; }'}  
    {'th{ .2em; text-decoration: underline; cursor: s-resize;}'}
    </style>;
}

export function ServerBrowser( { ns }: { ns:NS } ) {
  const [serverList, setServerList] = useState<Server[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [displayIsAdminOnlyServers, setDisplayIsAdminServers] = useState(true);
  const [displayServersWithZeroMaxMoney, setDisplayServersWithZeroMaxMoney] = useState(false);
  
  
  const fetchServers = ( newSortFunction:(a:Server, b:Server) => number ) => {
    // Theres got to be a better way to do this. Maybe not.
    // Im being lazy and dont want to explicitly set the sort function and then
    // have to call fetchServers(sortFunction) in the header click events
    sortFunction = newSortFunction;

		const dataManager = new RuntimeDataManager<ServerListData>(ns, RUNTIME_DATA_FILENAMES.SERVER_LIST)
    let data = dataManager.readData()

    if ( displayIsAdminOnlyServers ) {
      data.servers = data.servers.filter( s => s.hasAdminRights )
    }
    if ( !displayServersWithZeroMaxMoney ) {
      data.servers = data.servers.filter( s => s.moneyMax! > 0 )
    }
    setServerList( data.servers.sort(sortFunction) )
    setLastUpdated( data.last_updated )
  } 

  useEffect( () => {
    
    fetchServers(sortFunction)
    intervalId = setInterval(() => fetchServers(sortFunction), 500);

    return () => clearInterval(intervalId);
  }, [ns, displayIsAdminOnlyServers, displayServersWithZeroMaxMoney]);

  let filterControls = <div>
    <button className={`btn ${displayIsAdminOnlyServers ? 'active' : ''}`} 
      onClick={() => setDisplayIsAdminServers(!displayIsAdminOnlyServers)}>IsAdmin?</button>
    <button className={`btn ${displayServersWithZeroMaxMoney ? 'active' : ''}`} 
      onClick={() => setDisplayServersWithZeroMaxMoney(!displayServersWithZeroMaxMoney)}>Zero Max Money</button>
  </div>;

  let sortHeader = ( <tr>
    <th className="hostname-col" onClick={() => fetchServers(sortByHostname)}><b>Hostname</b></th>
    <th className="r" onClick={() => fetchServers(sortByMoneyAvailable)}><b>$</b></th>
    <th className="r" onClick={() => fetchServers(sortByMoneyMax)}><b>Max$</b></th>
    <th className="r" onClick={() => fetchServers(sortByHackDifficulty)}><b>Hack</b></th>
    <th className="r" onClick={() => fetchServers(sortByGrowTime)}><b>Grow</b></th>
    <th className="r" onClick={() => fetchServers(sortByHackTime)}><b>Hack</b></th>
    <th className="r" onClick={() => fetchServers(sortByWeakenTime)}><b>Weaken</b></th>
		<th className="r" onClick={() => fetchServers(sortByRequiredHackingSkill)}><b>Req Hack</b></th>
		<th className="r" onClick={() => fetchServers(sortByIsAdmin)}><b>Admin</b></th>
  </tr> );
  
  return ( <div>
    {customStyles()}
      {filterControls}
      <table>
        <thead>{sortHeader}</thead>
        <tbody> 
          {serverList.map(server => ( <tr>
            <td className="hostname-col">{server.hostname}</td>
            <td className="r">{ns.formatNumber(server.moneyAvailable,1)}</td>
            <td className="r">{ns.formatNumber(server.moneyMax,1)}</td>
            <td className="r">{`${ns.formatNumber(server.hackDifficulty,0)}/${ns.formatNumber(server.minDifficulty,0)}`}</td>
            <td className="r">{ns.formatNumber(ns.getGrowTime(server.hostname)/1000,0)}s</td>
            <td className="r">{ns.formatNumber(ns.getHackTime(server.hostname)/1000,0)}s</td>
            <td	className="r">{ns.formatNumber(ns.getWeakenTime(server.hostname)/1000,0)}s</td>
						<td className="r">{server.requiredHackingSkill}</td>
            <td className="r">{server.hasAdminRights ? 'A' : ''}</td>

            <td><button onClick={() => hackServer(server)}>Hack</button></td>
            <td><button onClick={() => growServer(server)}>Grow</button></td>
            <td><button onClick={() => weakenServer(server)}>Weaken</button></td>

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
	ns.disableLog("disableLog")
  ns.disableLog("scan")
  ns.disableLog("asleep")
  ns.disableLog("getServerSecurityLevel")
  ns.disableLog("getServerRequiredHackingLevel")
  ns.disableLog("exec")
 
  _ns = ns; // Convenience

  ns.printRaw( <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"></link>)
  ns.printRaw( <ServerBrowser ns={ns} />);
  
  ns.atExit( () => {
    clearInterval(intervalId)
  })

  while ( true ) {
    await ns.asleep(500)
  }
}

