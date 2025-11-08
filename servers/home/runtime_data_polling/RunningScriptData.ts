import { RunningScript, Server } from "NetscriptDefinitions";
import { RuntimeDataManager, RunningScriptData, RunningScriptExtended } from "../runtime_data_managment/RuntimeDataManager";
import { getScriptRunners } from "../runtime_data_managment/ScriptRunners";

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

	const dataManager = new RuntimeDataManager(ns)

	while (true) {
    const startedAt = Date.now()
    ns.clearLog()

		const scriptRunners = getScriptRunners(ns)
    const runningScripts = getRunningScripts(ns, scriptRunners)
    dataManager.writeRunningScripts( { last_updated: Date.now(), running_scripts: runningScripts } )
		
		const sortByHostname = (a, b) => a.targetHostname.localeCompare(b.targetHostname)
		const sortByTimeLeft = (a, b) => a.timeLeft - b.timeLeft
		const filterByHackType = s => s.hackType === "hack" 
		const filterByWeakenType = s => s.hackType === "weaken" 
		const filterByGrowType = s => s.hackType === "grow" 

		const print = ( runningScript:RunningScriptExtended ) =>	
			ns.print( `[${runningScript.server}] ${runningScript.filename} target:${runningScript.targetHostname} ` +
				`threads:${runningScript.threads} ram:${ns.formatRam(runningScript.ramUsageMultiThreaded)} ` +
				`timeLeft:${ns.formatNumber(runningScript.timeLeft/1000,0)}s` )

		runningScripts.filter( filterByWeakenType ).sort( sortByTimeLeft ).forEach( print )
		ns.print( "\n" )
		runningScripts.filter( filterByGrowType ).sort( sortByTimeLeft ).forEach( print )
		ns.print( "\n" )
		runningScripts.filter( filterByHackType ).sort( sortByTimeLeft ).forEach( print )
		ns.print( "\n" )

    ns.print( `Scripts:${runningScripts.length} Last updated: ${new Date().toLocaleString()} (${Date.now() - startedAt}ms)` )
    await ns.sleep(500)    
  }
}
