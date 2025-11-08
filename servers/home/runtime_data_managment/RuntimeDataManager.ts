import {Server, RunningScript} from "NetscriptDefinitions"

enum DATA_FILENAMES {
  SERVER_LIST = "runtime_data/server_list.json",
	RUNNING_SCRIPTS = "runtime_data/running_scripts.json",
	MONEY_OVER_TIME = "runtime_data/money_over_time.json",
	SETTINGS = "runtime_data/settings.json"
}
export const runtimeDataFileNames = [
	DATA_FILENAMES.SERVER_LIST,
	DATA_FILENAMES.RUNNING_SCRIPTS,
	DATA_FILENAMES.MONEY_OVER_TIME,
	DATA_FILENAMES.SETTINGS
]

export interface ServerListData {
	last_updated: number,
	servers: Server[]
}

export interface RunningScriptData {
	last_updated: number,
	running_scripts: RunningScriptExtended[]
}

export interface RunningScriptExtended extends RunningScript {
	hackType: string,
	targetHostname: string,
	ramUsageMultiThreaded: number,
	timeLeft: number
}

export function clearDataFiles( ns:NS ) {
	ns.rm( DATA_FILENAMES.SERVER_LIST )
	ns.rm( DATA_FILENAMES.RUNNING_SCRIPTS )
	ns.rm( DATA_FILENAMES.MONEY_OVER_TIME )
}

export interface MoneyOverTimeData {
	money: number,
	lastUpdated: number
}

export interface Settings {
	maxHackLevel: number
}

export class RuntimeDataManager {
	constructor( readonly ns:NS ) {}

	public readServerList() {
		try {
			return JSON.parse( this.ns.read(DATA_FILENAMES.SERVER_LIST) ) as ServerListData
		} catch ( e ) {
			return [] as unknown as ServerListData
		}
	}

	public writeServerList( data:ServerListData ) {
		this.ns.write(DATA_FILENAMES.SERVER_LIST, JSON.stringify(data), "w")
	}

	public readRunningScripts() {
		try {
			return JSON.parse( this.ns.read(DATA_FILENAMES.RUNNING_SCRIPTS) ) as RunningScriptData
		} catch ( e ) {
			return [] as unknown as RunningScriptData
		}
	}

	public writeRunningScripts( data:RunningScriptData ) {
		this.ns.write(DATA_FILENAMES.RUNNING_SCRIPTS, JSON.stringify(data), "w")
	}

	public readMoneyOverTime() {
		try {
			return JSON.parse( this.ns.read(DATA_FILENAMES.MONEY_OVER_TIME) ) as MoneyOverTimeData[]
		} catch ( e ) {
			return [] as unknown as MoneyOverTimeData[]
		}
	}

	public writeMoneyOverTime( data:MoneyOverTimeData[] ) {
		this.ns.write(DATA_FILENAMES.MONEY_OVER_TIME, JSON.stringify(data), "w")
	}

	public readSettings() {
		try {
			return JSON.parse( this.ns.read(DATA_FILENAMES.SETTINGS) ) as Settings
		} catch ( e ) {
			return [] as unknown as Settings
		}
	}

	public writeSettings( data:Settings ) {
		this.ns.write(DATA_FILENAMES.SETTINGS, JSON.stringify(data), "w")
	}
}

