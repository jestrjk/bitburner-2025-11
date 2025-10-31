import {NS, Server} from "NetscriptDefinitions";
import { PORT_LIST } from "../port_manager/portManager";
  
async function writeServerList(ns:NS, data:Server[]) {
  await ns.writePort(PORT_LIST.SERVER_LIST, JSON.stringify(data))
}

export async function readServerList(ns:NS) {
  return JSON.parse( await ns.peek(PORT_LIST.SERVER_LIST)) as Server[]
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

export async function main(ns:NS) {
  ns.tprint( `Starting script at ${Date.now()}`)
  ns.ui.openTail()
  ns.disableLog("scan")
  
  ns.print( `Starting server scan at ${Date.now()}`)
  
  while (true) {
    ns.clearLog()

    const new_server_list: Server[] = []
    recursiveServerScan(ns, 'home', new_server_list)
    await writeServerList(ns, new_server_list)
  
    ns.print( `Scanned ${new_server_list.length} servers`)
    ns.print( `Last updated: ${Date.now()}`) 
    await ns.sleep(1000)    
  }
}

