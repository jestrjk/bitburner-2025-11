import { Server } from "NetscriptDefinitions";
import { getBestScriptRunner } from "../polling/ScriptRunners";

export enum SCRIPT_PATHS {
	HACK = "/hacks/hack.js",
	GROW = "/hacks/grow.js",
	WEAKEN = "/hacks/weaken.js"
}

interface ScriptRunnerData {
	hostname: string,
	availableRam: number
}

export function _exec( ns:NS, scriptPath:SCRIPT_PATHS, threads:number, hostname:string ) {
	
	const bestScriptRunner = getBestScriptRunner(ns)
	const rightSizedThreads = getRightSizeThreads(ns, scriptPath, threads, bestScriptRunner.hostname)

	if ( rightSizedThreads >= 1 ) {
		const pid = ns.exec(scriptPath, bestScriptRunner.hostname, rightSizedThreads, hostname)
		if ( pid === 0 ) {
			/// TODO: Log that we failed to exec
			//ns.tprint( `autohack: failed to exec [${bestScriptRunner.hostname}] ${script} -T ${threads} ${hostname}`)
		}
	} else {
		/// TODO: Log that we don't have enough RAM
		//ns.tprint( `autohack: not enough RAM to exec [${bestScriptRunner.hostname}] ${script} -T ${threads} ${hostname}`)
	}
}

export function getRightSizeThreads( ns:NS, scriptPath:string, threads:number, scriptRunnerHostname:string ) {
	ns.disableLog("scp")
	
	const availableRam = ns.getServerMaxRam(scriptRunnerHostname) - ns.getServerUsedRam(scriptRunnerHostname)
	ns.scp(	scriptPath, scriptRunnerHostname)
	const scriptRamUsage = ns.getScriptRam(scriptPath, scriptRunnerHostname)
	const maxThreads = Math.floor(availableRam/scriptRamUsage)
	const rightSizedThreads =  Math.min(threads, maxThreads)

	// ns.tprint( `exec: [${scriptRunnerHostname}] scriptPath: ${scriptPath} askedThreads: ${threads} availableRam: ${availableRam} scriptRamUsage: ${scriptRamUsage*rightSizedThreads} rightsizedthreads: ${rightSizedThreads} / maxThreads: ${maxThreads}`)
	return rightSizedThreads
}