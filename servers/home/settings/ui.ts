import { ProcessInfo } from "NetscriptDefinitions"
import { RuntimeDataManager, WINDOW_PROPERTIES } from "../polling/RuntimeDataManager"
import { getScriptRunners } from "../polling/ScriptRunners"

const SCRIPT_NAMES = [
	"ServerListData",
	"RunningScriptData",
	"ServerBrowser",
	"MemoryDials",
	"share_manager",
	"raise_hacking",
	"autohack",
	"ControlPanel"
]

function getUiScriptsFromScriptRunners(ns:NS) {
	const scriptRunners = getScriptRunners(ns) 
	// ns.tprint( `getUiScriptsFromScriptRunners: ${scriptRunners.map( s => s.hostname).join(", ")}`)

	const processInfos:ProcessInfo[] = []
	scriptRunners.map( s => processInfos.push(...ns.ps(s.hostname)) )
	return processInfos
}

export function saveWindowProperties(ns:NS) {
	const dataManager = new RuntimeDataManager(ns)
	const windowPropertiesList = dataManager.readUiWindowProperties()

	let processInfos = getUiScriptsFromScriptRunners(ns)
	processInfos = processInfos.filter( scriptProcess => SCRIPT_NAMES.find(partialScriptName => scriptProcess.filename.includes(partialScriptName)) )

	ns.tprint(`Found ${processInfos.length} running scripts`)
	ns.tprint(JSON.stringify(processInfos,null,2))

	for ( const scriptName of SCRIPT_NAMES ) {

		const currentProcess = processInfos.find( s => s.filename.includes(scriptName) )
		if ( !currentProcess ) {
			continue
		}
	
		const currentScript = ns.getRunningScript(currentProcess.pid)

		const sx = currentScript.tailProperties.width
		const sy = currentScript.tailProperties.height
		const x = currentScript.tailProperties.x
		const y = currentScript.tailProperties.y
		
		const windowProperties:WINDOW_PROPERTIES = {
			script_name: currentScript.filename,
			position: [x, y],
			size: [sx,sy],
			updated: (new Date()).toLocaleString()
		}
		// ns.tprint(`Saving ${currentProcess.filename} properties: \n${JSON.stringify(windowProperties)}`)

		// remove matching window property entries
		const matchingEntry = windowPropertiesList.find( entry => entry.script_name === currentScript.filename )
		if ( matchingEntry ) {
			windowPropertiesList.splice(windowPropertiesList.indexOf(matchingEntry), 1)
		}
		// add the new window properties entry
		windowPropertiesList.push(windowProperties)
	}

	// ns.tprint(`Saving ${windowPropertiesList.length} window properties`)
	// ns.tprint(JSON.stringify(windowPropertiesList,null,2))

	dataManager.writeUiWindowProperties(windowPropertiesList)
}

export function resetWindowProperties(ns:NS) {

	const processInfos = getUiScriptsFromScriptRunners(ns)

	const manager = new RuntimeDataManager(ns)
	const windowPropertiesList = manager.readUiWindowProperties()

	for ( const setting of windowPropertiesList ) {

		let script = processInfos.find( s => s.filename === setting.script_name )
		if ( !script ) {
			ns.tprint(`No script found for ${setting.script_name}`)
			continue
		}
		
		//ns.tprint( `Resetting ${script.filename} size: [${setting.size[0]}, ${setting.size[1]}]` )
		ns.ui.resizeTail(setting.size[0], setting.size[1], script.pid)

		//ns.tprint( `Resetting ${script.filename} position: [${setting.position[0]}, ${setting.position[1]}]` )
		ns.ui.moveTail(setting.position[0], setting.position[1], script.pid)
	}
}
	