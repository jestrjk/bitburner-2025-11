import {NS} from "NetscriptDefinitions";
import React, {useState, useEffect} from 'react';

import {ServerList} from "./server_information/ServerInformationList";

export function MyComponent(){
  const [count, setCount] = useState(0);

  return <div>Count {count} <button onClick={() => setCount(count + 1)}>Add to count</button></div>;
}

export function ServerBrowser( { ns }: { ns:NS } ) {
  const [serverList, setServerList] = useState(new ServerList(ns));
  
  setInterval(() => {
    setServerList(new ServerList(ns));  
  }, 1000);
  
  return ( <table>
    <thead><tr><td>Hostname</td><td>Max$</td><td>$</td></tr></thead>
    <tbody>
      {serverList.all_servers.map(server => 
        ( <tr><td>{server.hostname}</td><td>{server.moneyMax}</td><td>{server.moneyAvailable}</td></tr> )
      )}
    </tbody>
  </table> )
}

export async function main(ns: NS) {
  ns.ui.openTail();
  ns.disableLog("scan")
  // TODO: Prevent the script death (bitburner error) of ns by creating an update loop
  // in this main function. How do we use the state in react here instead of there?
  
  ns.printRaw(<MyComponent />);
  ns.printRaw(<ServerBrowser ns={ns} />);
  
}