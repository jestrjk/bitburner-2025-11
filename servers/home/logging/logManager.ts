import { StorageManager } from "../polling/StorageManager";

let _ns:NS

export async function main(ns:NS) {
	_ns = ns
	const dataManager = new StorageManager(ns)
	
	dataManager.writeLog("Log manager started")
	dataManager.writeLog("Empty Data", {}, "info", false)
	dataManager.writeLog("Undefined data, stack trace", undefined, "warn", true)
	dataManager.writeLog("data, stack trace", {shit: "hitting the fan"}, "error", true)

	const logEntries = dataManager.readLog()
	for ( const entry of logEntries ) {
		ns.tprint(JSON.stringify(entry, null, 2))
	}
}
