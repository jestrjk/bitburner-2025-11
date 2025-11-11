
import { RuntimeDataManager } from "./RuntimeDataManager";

export function getScriptRunners(ns:NS) {
		const dataManager = new RuntimeDataManager(ns)
		const serverLists = dataManager.readServerList()
		const scriptRunners = serverLists.servers.filter( s=> s.hasAdminRights ).concat(serverLists.standard_player_purchased_servers)
		return scriptRunners
}

export function getBestScriptRunner(ns:NS) {
	const scriptRunners = getScriptRunners(ns)
			
	// There will always be at least one scriptrunner "home" so [0] is fine.
	const bestRunner =  scriptRunners.sort((a, b) => (b.maxRam-b.ramUsed) - (a.maxRam-a.ramUsed))[0] 
	
	return bestRunner
}