import {NS} from "NetscriptDefinitions";
import React, {useState} from 'react';

import {ServerList} from "./server_information/ServerInformationList";

export function MyComponent(){
  const [count, setCount] = useState(0);

  return <div>Count {count} <button onClick={() => setCount(count + 1)}>Add to count</button></div>;
}

export async function main(ns: NS) {
  ns.ui.openTail();
  ns.disableLog("scan")
  
  ns.printRaw(<MyComponent />);

  const serverList = new ServerList(ns);
  ns.print(serverList.all_servers.map(s=>s.hostname).join(', '))

}