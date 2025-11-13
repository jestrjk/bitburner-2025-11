import { Server, RunningScript, ProcessInfo } from "NetscriptDefinitions"	

const UI_SCRIPT_NAMES = [
	"ServerListData",
	"RunningScriptData",
	"ServerBrowser",
	"MemoryDials",
	"share_manager",
	"raise_hacking",
	"autohack",
	"ControlPanel"
]

export interface UserScriptData {
	last_updated: number,
	user_scripts: UserScript[]
}

export type UserScriptType = "hack" | "weaken" | "grow" | "unknown" | "user"

export interface UserScript extends RunningScript {
	filename: string,
	type: UserScriptType,
	targetHostname: string,
	estimatedRunningTime: number,
	timeLeft: number
}	

function determineScriptType(filename: string) : UserScriptType {

	if (UI_SCRIPT_NAMES.find(partialScriptName => filename.includes(partialScriptName)) ) {
		return "user"
	}

	if (filename.endsWith("hack.js")) { return "hack" } 
	if (filename.endsWith("weaken.js")) { return "weaken" }  
	if (filename.endsWith("grow.js")) { return "grow" } 

	return "unknown"
}

export function getRunningUserScripts(ns: NS, serverList: Server[]): UserScript[] {
	return serverList.flatMap(s => ns.ps(s.hostname).map(p => createUserScriptFromProcess(ns, p))) 
}

function createUserScriptFromProcess(ns: NS, processInfo: ProcessInfo): UserScript {
	const runningScript = ns.getRunningScript(processInfo.pid)! // We know the script is running (mapped from a ns.ps() call), so we can safely unwrap the result.
	const type = determineScriptType(processInfo.filename)

	// TODO: We should think about whether we want to introduce true flagged arguments for UserScripts,
	// This would involve altering any script that wanted a target or list of targets to use 
	// --target hostname or --targets [hostname1,hostname2,hostname3]
	const targetHostname = (type === "hack" || type === "weaken" || type === "grow") ? runningScript.args[0]?.toString() ?? "" : ""

	let estimatedRunningTime: number = Infinity
	if ( targetHostname.length > 0 ) { 
		estimatedRunningTime = 
			(type === "hack") ? ns.getHackTime(targetHostname) : 
			(type === "weaken") ? ns.getWeakenTime(targetHostname) : 
			(type === "grow") ? ns.getGrowTime(targetHostname) : 
			Infinity
	}

	const userScript: UserScript = {
		...runningScript,
		type,
		targetHostname,
		estimatedRunningTime: estimatedRunningTime,
		timeLeft: estimatedRunningTime - runningScript.onlineRunningTime - runningScript.offlineRunningTime
	}

	return userScript
}