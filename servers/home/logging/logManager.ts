import { StorageManager } from "../data_management/StorageManager";

let _ns:NS

export async function main(ns:NS) {
	_ns = ns
	const storageManager = new StorageManager(ns)
	
	storageManager.writeLog("Log manager started")
	storageManager.writeLog("Empty Data", {}, "info", false)
	storageManager.writeLog("Undefined data, stack trace", undefined, "warn", true)
	storageManager.writeLog("data, stack trace", {shit: "hitting the fan"}, "error", true)

	const logEntries = storageManager.readLog()
	for ( const entry of logEntries ) {
		ns.tprint(JSON.stringify(entry, null, 2))
	}
}
