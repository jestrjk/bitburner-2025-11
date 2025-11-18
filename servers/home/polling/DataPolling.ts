import { recursiveServerScan } from "./ServerListData";
import { ServerListDataManager } from "./ServerListDataManager";
import { getRunningScriptsFromServerList } from "./RunningScriptsData";
import { RunningScriptsDataManager } from "./RunningScriptsDataManager";

export async function main(ns:NS) {
  ns.ui.openTail()
	ns.disableLog("sleep")
  ns.disableLog("scan")

  while (true) {
    const startedAt = Date.now()
    ns.clearLog()

    const new_server_list = recursiveServerScan(ns, 'home')
    const serverListDataManager = new ServerListDataManager(ns, {
      last_updated: Date.now(),
      servers: new_server_list,
    })
    serverListDataManager.writeToStorage()
  
    const runningScripts = getRunningScriptsFromServerList(ns, new_server_list)
    const runningScriptsDataManager = new RunningScriptsDataManager(ns, {
      last_updated: Date.now(),
      running_scripts: runningScripts,
    })
    runningScriptsDataManager.writeToStorage()

    
    ns.print( `#Servers: ${new_server_list.length} #RunningScripts: ${runningScripts.length} Updated: ${new Date().toLocaleString()} (${Date.now() - startedAt}ms)` )
    await ns.sleep(500)    
  }
}