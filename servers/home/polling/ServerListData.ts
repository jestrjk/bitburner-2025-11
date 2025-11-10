import {NS, Server} from "NetscriptDefinitions";
import { RuntimeDataManager } from "../polling/RuntimeDataManager";

function recursiveServerScan(ns:NS, parent_host_name:string, newServerInformationList:Server[] = [] ) {
  
  let new_server_names = ns.scan( parent_host_name )
  
  for ( let new_server_name of new_server_names ) {
    if ( newServerInformationList.find( s=>s.hostname === new_server_name ) ) {
      continue;
    } else {
      newServerInformationList.push( ns.getServer( new_server_name ) )
      // The new server list is passed by reference, and the contents of the array mutated.
      // You, personally, may not like this pattern. If you don't like it, you can fix it by getting bent.
      recursiveServerScan( ns, new_server_name, newServerInformationList ) 
    }
  }

  return newServerInformationList
}

export async function main(ns:NS) {
  ns.tprint( `Starting ServerInformationList at ${Date.now()}`)
  ns.tprint( `Removing old server lists` )
  
  ns.ui.openTail()
  ns.disableLog("scan")

	const dataManager = new RuntimeDataManager(ns)
  while (true) {
    const startedAt = Date.now()
    ns.clearLog()

    const new_server_list = recursiveServerScan(ns, 'home')
    dataManager.writeServerList( {
			last_updated: Date.now(),
			servers: new_server_list
		})
  
    ns.print( `#Servers: ${new_server_list.length} Updated: ${new Date().toLocaleString()} (${Date.now() - startedAt}ms)` )
    await ns.sleep(500)    
  }
}

