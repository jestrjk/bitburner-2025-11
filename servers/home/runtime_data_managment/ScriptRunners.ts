
import { RuntimeDataManager } from "./RuntimeDataManager";

export function getScriptRunners(ns:NS) {
		const dataManager = new RuntimeDataManager(ns)
		const scriptRunners = dataManager.readServerList().servers.filter( s => (s.purchasedByPlayer && s.maxRam > 0) || (s.hasAdminRights && s.maxRam >= 32) )
		return scriptRunners.sort((a, b) => b.maxRam - a.maxRam)
}

export function getBestScriptRunner(ns:NS) {
	const scriptRunners = getScriptRunners(ns)
			
	// There will always be at least one scriptrunner "home" so [0] is fine.
	const bestRunner =  scriptRunners.sort((a, b) => (b.maxRam-b.ramUsed) - (a.maxRam-a.ramUsed))[0] 
	
	return bestRunner
}