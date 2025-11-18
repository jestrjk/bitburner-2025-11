import { RunningScriptData  } from "./RunningScriptsData"
import { StorageManager } from "./StorageManager"

export class RunningScriptsDataManager {

	public get runningScriptsData() { return this.running_scripts_data }
	public get lastUpdated() { return this.running_scripts_data.last_updated }
	public get runningScripts() { return this.running_scripts_data.running_scripts }

	constructor( readonly ns: NS, readonly running_scripts_data: RunningScriptData) {	}

	static fromStorage(ns: NS) {
		const storageManager = new StorageManager(ns)
		return new RunningScriptsDataManager(ns, storageManager.readRunningScripts())
	}
	
	public writeToStorage() {
		const storageManager = new StorageManager(this.ns)
		storageManager.writeRunningScripts(this.running_scripts_data)
	}
}
