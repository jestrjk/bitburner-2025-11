import { RunningScript } from "NetscriptDefinitions";

export async function main(ns:NS) {
	ns.disableLog("sleep")
	ns.disableLog("exec")
	ns.disableLog("getServerMaxRam")
	ns.disableLog("getServerUsedRam")
	ns.disableLog("getScriptRam")

	ns.ui.openTail()

	const scriptFilename = "faction/exec_share.js"
	const scriptHostname = "home" // ns.share() always runs on home...

	while ( true ){
		ns.clearLog()
		let startedAt = Date.now()

		let availableMemory = ns.getServerMaxRam(scriptHostname)-ns.getServerUsedRam(scriptHostname)
		let threads = Math.floor(availableMemory*.9/ns.getScriptRam(scriptFilename))
		if ( threads < 1 ) { 
			ns.tprint( `Not enough memory to share` )
			ns.exit()
		}

		const pid = ns.exec(scriptFilename, scriptHostname, threads)
		if ( pid === 0 ) { 
			ns.tprint( `Could not exec share` )
			ns.exit()
		}

		let script:RunningScript|undefined 

		while ( !script ) {
			await ns.sleep(500)
			startedAt += 500 // We tracking execution time, sleeps are not that.
			script = ns.getRunningScript(pid)
		}
		
		ns.print(`(${pid}) exec_share.js -t ${script.threads} ${ns.getHostname()} (${ns.formatRam(script.ramUsage*script.threads)}) `)
		ns.print(`Updated: ${new Date().toLocaleString()} (${Date.now()-startedAt}ms)`)	

		while( ns.getRunningScript(pid) ) {
			await ns.sleep(500)
		}
	}
}
