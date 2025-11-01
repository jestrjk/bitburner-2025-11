import {NS, Server} from "NetscriptDefinitions";
import { PORT_LIST } from "../port_manager/portManager";

export interface ServerListData extends Server {
  last_updated: number,
  servers: Server[]
}

function writeServerList(ns:NS, data:Server[]) {

  ns.writePort(PORT_LIST.SERVER_LIST, JSON.stringify({ last_updated: Date.now(), servers: data }))
}

export function readServerList(ns:NS) {
  return JSON.parse( ns.peek(PORT_LIST.SERVER_LIST)) as ServerListData
}
  
function recursiveServerScan(ns:NS, parent_host_name:string, newServerInformationList:Server[] ) {
  
  let new_server_names = ns.scan( parent_host_name )
  
  for ( let new_server_name of new_server_names ) {
    if ( newServerInformationList.find( s=>s.hostname == new_server_name ) ) {
      continue;
    } else {
      newServerInformationList.push( ns.getServer( new_server_name ) )
      recursiveServerScan( ns, new_server_name, newServerInformationList )
    }
  }
}

function clearPort(ns:NS) {
  let count = 0
  let result = ns.readPort(PORT_LIST.SERVER_LIST)
  while ( result !== "NULL PORT DATA") {
    count++
    result = ns.readPort(PORT_LIST.SERVER_LIST)
  }
  return count ;
}

export async function main(ns:NS) {
  ns.tprint( `Starting ServerInformationList at ${Date.now()}`)
  ns.tprint( `Removing old server lists` )
  
  let clearedCount = clearPort(ns)
  ns.tprint( `Cleared ${clearedCount} old server lists` )
  
  ns.ui.openTail()
  ns.disableLog("scan")
  
  while (true) {
    ns.clearLog()

    const new_server_list: Server[] = []
    recursiveServerScan(ns, 'home', new_server_list)
    clearPort(ns)
    writeServerList(ns, new_server_list)
  
    ns.print( `Scanned ${new_server_list.length} servers`)
    ns.print( `Last updated: ${new Date().toLocaleString()}`) 
    await ns.sleep(2000)    
  }
}

