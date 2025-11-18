import { RunningScriptData  } from "./RunningScriptsData"
import { StorageManager } from "./StorageManager"

export class RunningScriptsDataManager {

	public get runningScriptsData() { return this.running_scripts_data }
	public get lastUpdated() { return this.running_scripts_data.last_updated }
	public get runningScripts() { return this.running_scripts_data.running_scripts }

	constructor( readonly ns: NS, readonly running_scripts_data: RunningScriptData) {	}

	static fromStorage(ns: NS) {
		const dataManager = new StorageManager(ns)
		return new RunningScriptsDataManager(ns, dataManager.readRunningScripts())
	}
	
	public writeToStorage() {
		const dataManager = new StorageManager(this.ns)
		dataManager.writeRunningScripts(this.running_scripts_data)
	}
}
