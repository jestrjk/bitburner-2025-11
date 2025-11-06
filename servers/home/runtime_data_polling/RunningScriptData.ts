import { RunningScript, Server } from "NetscriptDefinitions";
import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from "../runtime_data_managment/runtime_data_manager";

export interface RunningScriptData {
  last_updated: number,
  runningScripts: RunningScriptExtended[]
}

export interface RunningScriptExtended extends RunningScript {
  hackType: string,
	targetHostname: string
}

function getRunningScripts( ns:NS, hostServerList:Server[] ) {

  const runningScripts:RunningScriptExtended[] = [];

  hostServerList.forEach( hostServer => {
    const psResults = ns.ps(hostServer.hostname)
    psResults.forEach( psResult => {
      const runningScript:RunningScript = ns.getRunningScript(psResult.pid,hostServer.hostname)

			let hackType: string
			let targetHostname: string
      
			const match = /(hack|weaken|grow)\.js$/.exec(runningScript.filename)
      if ( match ) {
        hackType = match[1]
      } else return ; // This is not a hack/weaken/grow script, let's fuck off.

			if ( runningScript.args.length > 0 ) {
				targetHostname = runningScript.args[0].toString()
			} else return ; // This script has no args, let's fuck off.

			const runningScriptExtended:RunningScriptExtended = {
				...runningScript,
				hackType,
				targetHostname
			}

      runningScripts.push(runningScriptExtended)
    })
  })
  
  return runningScripts
}

export async function main(ns:NS) {
  ns.tprint( `Starting RunningScriptData at ${Date.now()}`)
  ns.tprint( `Removing old running script data` )
  
  ns.ui.openTail()
  ns.disableLog("ps")
  
  const dataManager = new RuntimeDataManager<RunningScriptData>(ns, RUNTIME_DATA_FILENAMES.RUNNING_SCRIPTS)
  while (true) {
    const startedAt = Date.now()
    ns.clearLog()

    const runningScripts = getRunningScripts(ns, [ ns.getServer("home") ])
    dataManager.writeData( {
      last_updated: Date.now(),
			runningScripts
    })
		
		runningScripts.sort((a, b) => a.targetHostname.localeCompare(b.targetHostname)).forEach( runningScript => {
			ns.printRaw( `[${runningScript.targetHostname}] ${runningScript.filename} ${runningScript.threads}` )
		})

    ns.print( `Scanned ${runningScripts.length} running scripts` )
    ns.print( `Last updated: ${new Date().toLocaleString()}` ) 
    ns.print( `Took ${Date.now() - startedAt}ms` )
    await ns.sleep(500)    
  }
}
