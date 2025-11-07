
export enum RUNTIME_DATA_FILENAMES {
  SERVER_LIST = "runtime_data/server_list.json",
	RUNNING_SCRIPTS = "runtime_data/running_scripts.json",
	MONEY_OVER_TIME = "runtime_data/money_over_time.json"
}

export const runtimeDataFileNames = [
	RUNTIME_DATA_FILENAMES.SERVER_LIST,
	RUNTIME_DATA_FILENAMES.RUNNING_SCRIPTS,
	RUNTIME_DATA_FILENAMES.MONEY_OVER_TIME
]


export class RuntimeDataManager<T> {
	constructor( readonly ns:NS, readonly filename:RUNTIME_DATA_FILENAMES ) {}

	public readData() {
		return JSON.parse( this.ns.read(this.filename) ) as T
	}

	public writeData( data:T ) {
		this.ns.write(this.filename, JSON.stringify(data), "w")
	}
}

