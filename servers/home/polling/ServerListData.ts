import { RuntimeDataManager } from "./RuntimeDataManager";
import { Server } from "NetscriptDefinitions";

export interface ServerListData {
  last_updated: number,
  servers: Server[]
}

export function recursiveServerScan(ns:NS, parent_host_name:string, newServerInfoList:Server[] = [] ) {
  const newServerNames = ns.scan( parent_host_name )
  
  for ( const newServerName of newServerNames ) {
    if ( newServerInfoList.find( s=>s.hostname === newServerName ) ) {
      continue;
    } else {
      newServerInfoList.push( ns.getServer( newServerName ) )
      
      // The new server list is passed by reference (obvi), and the contents of the array mutated.
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
			servers: new_server_list,
		})
  
    ns.print( `#Servers: ${new_server_list.length} Updated: ${new Date().toLocaleString()} (${Date.now() - startedAt}ms)` )
    await ns.sleep(500)    
  }
}