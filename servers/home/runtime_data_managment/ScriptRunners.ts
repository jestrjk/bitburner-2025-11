
import { ServerListData } from "../runtime_data_polling/ServerListData";
import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from "./runtime_data_manager";

export function getScriptRunners(ns:NS) {
	const dataManager = new RuntimeDataManager<ServerListData>(ns, RUNTIME_DATA_FILENAMES.SERVER_LIST)
	return dataManager.readData().servers.filter( s => s.purchasedByPlayer )
}

export function getBestScriptRunner(ns:NS) {
	const scriptRunners = getScriptRunners(ns)
			
	// There will always be at least one scriptrunner "home" so [0] is fine.
	const bestRunner =  scriptRunners.sort((a, b) => (b.maxRam-b.ramUsed) - (a.maxRam-a.ramUsed))[0] 
	
	return bestRunner
}