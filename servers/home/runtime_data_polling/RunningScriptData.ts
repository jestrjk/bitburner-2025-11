import { RunningScript, Server } from "NetscriptDefinitions";
import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from "../runtime_data_managment/runtime_data_manager";
import { ServerListData } from "./ServerListData";

export interface RunningScriptData {
  last_updated: number,
  runningScripts: RunningScriptExtended[]
}

export interface RunningScriptExtended extends RunningScript {
  hackType: string,
	targetHostname: string,
	ramUsageMultiThreaded: number,
	timeLeft: number
}

function getRunningScripts( ns:NS, scriptRunners:Server[] ) {

  const runningScripts:RunningScriptExtended[] = [];

  scriptRunners.forEach( hostServer => {
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

			let timeLeft:number ;

			if ( hackType === "hack" ) {
				timeLeft = ns.getHackTime(targetHostname)
			} else if ( hackType === "grow" ) {
				timeLeft = ns.getGrowTime(targetHostname)
			} else if ( hackType === "weaken" ) {
				timeLeft = ns.getWeakenTime(targetHostname)
			}

			// Because onlineRunningTime is in seconds, everything else is in miliseconds,we need to convert it to milliseconds, because reasons???	
			timeLeft = timeLeft - runningScript.onlineRunningTime * 1000 

			const runningScriptExtended:RunningScriptExtended = {
				...runningScript,
				hackType,
				targetHostname,
				ramUsageMultiThreaded: runningScript.ramUsage * runningScript.threads,
				timeLeft
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
	ns.disableLog("getServerMaxRam")
	ns.disableLog("getServerUsedRam")

	const serverListDataManager = new RuntimeDataManager<ServerListData>(ns, RUNTIME_DATA_FILENAMES.SERVER_LIST)
  const dataManager = new RuntimeDataManager<RunningScriptData>(ns, RUNTIME_DATA_FILENAMES.RUNNING_SCRIPTS)
  while (true) {
    const startedAt = Date.now()
    ns.clearLog()

		const scriptRunners = serverListDataManager.readData().servers.filter( s => s.purchasedByPlayer )
    const runningScripts = getRunningScripts(ns, scriptRunners)
    dataManager.writeData( {
      last_updated: Date.now(),
			runningScripts
    })
		
		runningScripts.sort((a, b) => a.targetHostname.localeCompare(b.targetHostname)).forEach( runningScript => {
			ns.print( `[${runningScript.server}] ${runningScript.filename} thost:${runningScript.targetHostname} threads:${runningScript.threads} ram:${ns.formatRam(runningScript.ramUsageMultiThreaded)} timeLeft:${ns.formatNumber(runningScript.timeLeft/1000,0)}s` )
		})

    ns.print( `Scanned ${runningScripts.length} running scripts` )
		ns.print( `Available RAM ("home"): ${ns.formatRam(ns.getServerMaxRam("home") - ns.getServerUsedRam("home"))}` )
    ns.print( `Last updated: ${new Date().toLocaleString()}` ) 
    ns.print( `Took ${Date.now() - startedAt}ms` )
    await ns.sleep(500)    
  }
}
