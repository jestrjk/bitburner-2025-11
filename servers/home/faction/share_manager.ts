import { RunningScript } from "NetscriptDefinitions";

export async function main(ns:NS) {

	ns.ui.openTail()

	while ( true ){
		let availableMemory = ns.getServerMaxRam(ns.getHostname())-ns.getServerUsedRam(ns.getHostname())
		let threads = Math.floor((availableMemory/2)/2)
		if ( threads < 1 ) { 
			ns.tprint( `Not enough memory to share` )
			ns.exit()
		}

		const pid = ns.exec("faction/exec_share.js", "home", threads)
		if ( pid === 0 ) { 
			ns.tprint( `Could not exec share` )
			ns.exit()
		}

		let script:RunningScript|undefined 

		while ( !script ) {
			await ns.sleep(500)
			script = ns.getRunningScript(pid)
		}
		
		ns.print(`PID: ${pid} exec_share.js -t ${script.threads} (${ns.formatRam(script.ramUsage*script.threads)}) `)

		while( ns.getRunningScript(pid) ) {
			await ns.sleep(500)
		}
	}
}
