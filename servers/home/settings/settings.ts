import { StorageManager } from "../data_management/StorageManager";

interface Settings {
	maxHackLevel: number
}

// Default values
let defaultSettings:Settings = {
	maxHackLevel: 20
}

export function getSettings(ns:NS) {
	let settings:Settings = defaultSettings
	const storageManager = new StorageManager(ns)
	
	try { let possibleSettings = storageManager.readSettings()
		if ( possibleSettings ) {
			settings = possibleSettings
		}
	} catch ( e ) { /* eat this error, we have default values */	}

	return settings
}

export async function main(ns:NS) {

	const storageManager = new StorageManager(ns)
	let settings = getSettings(ns)
	
	while( ns.args.length > 0 ) {
		const arg = ns.args.shift()
		switch( arg ) {
			case "--maxHackLevel":
				const maxHackLevel = ns.args.shift()
				if ( maxHackLevel ) {
					settings.maxHackLevel = Number(maxHackLevel)
				}
				break;
		}
	}

	storageManager.writeSettings(settings)
	ns.tprint( JSON.stringify(settings, null, 2) )
}
