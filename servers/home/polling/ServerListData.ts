import {NS, Server} from "NetscriptDefinitions";
import { RuntimeDataManager } from "../polling/RuntimeDataManager";

function recursiveServerScan(ns:NS, parent_host_name:string, newServerInfoList:Server[] = [] ) {
  
  let newServerNames = ns.scan( parent_host_name )
  
  for ( let newServerName of newServerNames ) {
    if ( newServerInfoList.find( s=>s.hostname === newServerName ) ) {
      continue;
    } else {
			newServerInfoList.push( ns.getServer( newServerName ) )
      
      // The new server list is passed by reference, and the contents of the array mutated.
      // You, personally, may not like this pattern. If you don't like it, you can fix it by getting bent.
      recursiveServerScan( ns, newServerName, newServerInfoList ) 
    }
  }

  return newServerInfoList
}

export async function main(ns:NS) {
  ns.ui.openTail()
	ns.disableLog("sleep")
  ns.disableLog("scan")

	const dataManager = new RuntimeDataManager(ns)
  while (true) {
    const startedAt = Date.now()
    ns.clearLog()

    const new_server_list = recursiveServerScan(ns, 'home')
    dataManager.writeServerList( {
			last_updated: Date.now(),
			servers: 									new_server_list.filter( s=> !s.purchasedByPlayer ),
			hacknet_servers: 					new_server_list.filter( s=> s.purchasedByPlayer && s.hostname.startsWith("hacknet")),
			standard_player_purchased_servers: 	new_server_list.filter( s=> s.purchasedByPlayer && !s.hostname.startsWith("hacknet")),
		})
  
    ns.print( `#Servers: ${new_server_list.length} Updated: ${new Date().toLocaleString()} (${Date.now() - startedAt}ms)` )
    await ns.sleep(500)    
  }
}

