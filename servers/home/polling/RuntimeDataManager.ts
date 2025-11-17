import { RunningScript} from "NetscriptDefinitions"
import { UserScriptData } from "./UserScriptsData"
import { ServerListData } from "./ServerListData"

export interface WINDOW_PROPERTIES {
	script_name: String,
	position: [number, number],
	size: [number, number],
	updated: string
}

enum DATA_FILENAMES {
	SERVER_LIST = "runtime_data/server_list.json",
	RUNNING_SCRIPTS = "runtime_data/running_scripts.json",
	USER_SCRIPTS = "runtime_data/user_scripts.json",
	MONEY_OVER_TIME = "runtime_data/money_over_time.json",
	SETTINGS = "runtime_data/settings.json",
	UI_WINDOWS = "runtime_data/ui_windows.json"
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

export interface HackGrowWeakenScript extends RunningScript {
	hackType: string,
	targetHostname: string,
	ramUsageMultiThreaded: number,
	timeLeft: number
}

export function clearDataFiles( ns:NS ) {
	ns.rm( DATA_FILENAMES.SERVER_LIST )
	ns.rm( DATA_FILENAMES.RUNNING_SCRIPTS )
	ns.rm( DATA_FILENAMES.USER_SCRIPTS )
	ns.rm( DATA_FILENAMES.MONEY_OVER_TIME )
}

export interface MoneyOverTimeData {
	money: number,
	lastUpdated: number
}

export interface Settings {
	maxHackLevel: number
}

type logEntrySeverity = "info" | "warn" | "error";
export interface LogEntry {
	timestamp: number,
	severity: logEntrySeverity,
	message: string,
	stack_trace?: string,
	data?: any
}

export class RuntimeDataManager {
	constructor( readonly ns:NS ) {}

	private getLogName() {
		let d = new Date();
		return `logs/${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}.json`
	}

	public writeLog( message:string, data?: any, severity: logEntrySeverity = "info" , stackTrace: boolean = false ) {
		const logEntry:Partial<LogEntry> = { timestamp: Date.now(), message, severity, data }
		if ( stackTrace ) { logEntry.stack_trace = (new Error("writeLog")).stack }
		this.ns.write(this.getLogName(), JSON.stringify(logEntry) + "\n", "a")
	}

	public readLog() {
		const logString = this.ns.read(this.getLogName())
		this.ns.tprint(logString)
		return  ( JSON.parse( logString.replace( /^/, "[").replace( /\n$/, "]").replace(/\n/g, ",") ) ) as LogEntry[]
	}

	readDataFile<T>( filename: DATA_FILENAMES ): T {
		try {
			return JSON.parse( this.ns.read(filename) ) as T
		} catch ( e ) {
			this.writeLog( `Error reading data file ${filename}: ${e}`, undefined, "warn" )
			return [] as unknown as T
		}
	}

	writeDataFile<T>( filename: DATA_FILENAMES, data: T ) {
		this.ns.write(filename, JSON.stringify(data), "w")
	}

	public readServerList() {
		return this.readDataFile<ServerListData>( DATA_FILENAMES.SERVER_LIST )
	}

	public writeServerList( data:ServerListData ) {
		this.writeDataFile<ServerListData>( DATA_FILENAMES.SERVER_LIST, data )
	}

	public readRunningScripts() {
		return this.readDataFile<RunningScriptData>( DATA_FILENAMES.RUNNING_SCRIPTS )
	}

	public writeRunningScripts( data:RunningScriptData ) {
		this.writeDataFile<RunningScriptData>( DATA_FILENAMES.RUNNING_SCRIPTS, data )
	}

	public readUserScripts() {
		return this.readDataFile<UserScriptData>( DATA_FILENAMES.USER_SCRIPTS )
	}

	public writeUserScripts( data:UserScriptData ) {
		this.writeDataFile<UserScriptData>( DATA_FILENAMES.USER_SCRIPTS, data )
	}

	public readMoneyOverTime() {
		return this.readDataFile<MoneyOverTimeData[]>( DATA_FILENAMES.MONEY_OVER_TIME )
	}

	public writeMoneyOverTime( data:MoneyOverTimeData[] ) {
		this.writeDataFile<MoneyOverTimeData[]>( DATA_FILENAMES.MONEY_OVER_TIME, data )
	}

	public readSettings() {
		return this.readDataFile<Settings>( DATA_FILENAMES.SETTINGS )
	}

	public writeSettings( data:Settings ) {
		this.writeDataFile<Settings>( DATA_FILENAMES.SETTINGS, data )
	}

	public readUiWindowProperties() {
		return this.readDataFile<WINDOW_PROPERTIES[]>( DATA_FILENAMES.UI_WINDOWS )
	}

	public writeUiWindowProperties( data:WINDOW_PROPERTIES[] ) {
		this.writeDataFile<WINDOW_PROPERTIES[]>( DATA_FILENAMES.UI_WINDOWS, data )
	}
}

