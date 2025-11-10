import { RuntimeDataManager, WINDOW_PROPERTIES } from "../polling/RuntimeDataManager"

const SCRIPT_NAMES = [
	"ServerListData",
	"RunningScriptData",
	"ServerBrowser",
	"MemoryDials",
	"share_manager",
	"raise_hacking",
	"autohack"
]

export function saveWindowProperties(ns:NS) {
	const dataManager = new RuntimeDataManager(ns)
	let newWindowPropertiesList:WINDOW_PROPERTIES[] = [] 

	const psHome = ns.ps("home")
	for ( const scriptName of SCRIPT_NAMES ) {

		const currentProcess = psHome.find( s => s.filename.includes(scriptName) )
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
			size: [sx,sy]
		}
		ns.tprint(`Saving ${currentProcess.filename} properties: \n${JSON.stringify(windowProperties)}`)
		newWindowPropertiesList.push(windowProperties)
	}

	dataManager.writeUiWindowProperties(newWindowPropertiesList)
}

export function resetWindowProperties(ns:NS) {
	const psHome = ns.ps("home")
	
	const windowPropertiesList = new RuntimeDataManager(ns).readUiWindowProperties()

	for ( const setting of windowPropertiesList ) {

		let script = psHome.find( s => s.filename === setting.script_name )
		if ( !script ) {
			continue
		}
		
		// ns.tprint( `Resetting ${script.filename} size: [${setting.size[0]}, ${setting.size[1]}]` )
		ns.ui.resizeTail(setting.size[0], setting.size[1], script.pid)

		// ns.tprint( `Resetting ${script.filename} position: [${setting.position[0]}, ${setting.position[1]}]` )
		ns.ui.moveTail(setting.position[0], setting.position[1], script.pid)
	}
}
	