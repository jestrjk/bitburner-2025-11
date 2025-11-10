import {Server, RunningScript} from "NetscriptDefinitions"

export interface WINDOW_PROPERTIES {
	script_name: String,
	position: [number, number],
	size: [number, number]
}

enum DATA_FILENAMES {
	SERVER_LIST = "runtime_data/server_list.json",
	RUNNING_SCRIPTS = "runtime_data/running_scripts.json",
	MONEY_OVER_TIME = "runtime_data/money_over_time.json",
	SETTINGS = "runtime_data/settings.json",
	UI_WINDOWS = "runtime_data/ui_windows.json"
}

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

	public readUiWindowProperties() {
		try {
			return JSON.parse( this.ns.read(DATA_FILENAMES.UI_WINDOWS) ) as WINDOW_PROPERTIES[]
		} catch ( e ) {
			return [] as unknown as WINDOW_PROPERTIES[]
		}
	}

	public writeUiWindowProperties( data:WINDOW_PROPERTIES[] ) {
		this.ns.write(DATA_FILENAMES.UI_WINDOWS, JSON.stringify(data), "w")
	}
}

