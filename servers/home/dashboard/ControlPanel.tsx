import React, { useEffect, useState } from "react"
import { saveWindowProperties, resetWindowProperties } from "../settings/ui"
import { RuntimeDataManager } from "../polling/RuntimeDataManager"

let _ns:NS
export async function main(ns:NS) {
	_ns = ns
	
	ns.disableLog("disableLog")
	ns.disableLog("asleep")
	ns.disableLog("run")

	ns.ui.openTail()
	ns.clearLog()

	ns.printRaw( <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"></link>)
	ns.printRaw(<ControlPanel />)

	while (true) {
		await ns.asleep(1000)
	}
}

export function ControlPanel() {
	const [maxHackLevel, setMaxHackLevel] = useState(3000)
	const dataManager = new RuntimeDataManager(_ns)

	const updateMaxHackLevel = (numberDelta) => {
		let newMaxHackLevel = Number(numberDelta)
		if ( newMaxHackLevel < 1 ) {
			newMaxHackLevel = 0
		}
		_ns.tprint( `new level: ${newMaxHackLevel}`)

		const settings = dataManager.readSettings()
		settings.maxHackLevel = newMaxHackLevel
		dataManager.writeSettings(settings)

		setMaxHackLevel(newMaxHackLevel)
	}

	useEffect(() => {
		_ns.tprint(`UseEffect! ${Date.now().toLocaleString()}`)
		
		const settings = dataManager.readSettings()
		if ( settings?.maxHackLevel ) {
			setMaxHackLevel(settings.maxHackLevel)
		}

	}, [])
	
	const resetWindows = () => {
		resetWindowProperties(_ns)
	}

	const saveWindows = () => {
		saveWindowProperties(_ns)
	}

	return (
		<div>
			<h2>Control Panel</h2>
			
				<div style={{padding:".5em"}}>
					<button className="btn btn-outline-success" id="resetWindowsBtn"onClick={resetWindows}>Reset Windows</button>
					<button className="btn btn-outline-success" id="saveWindowsBtn" onClick={saveWindows}>Save Window Properties</button>
				</div>

				<div style={{fontSize: "1.5em", padding:".5em"}}>MaxLevelHacking:{maxHackLevel}</div>
				<div style={{padding:".5em"}}>
					<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel-10)}>-10</button>
					<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel+10)}>+10</button>
					<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel-100)}> -100</button>
					<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel+100)}> +100</button>
				</div>
				<div style={{padding:".5em"}}>
					<button className="btn btn-outline-success" onClick={() => _ns.run("faction/share_manager.js")}>Run Share Manager</button>
					<button className="btn btn-outline-success" onClick={() => _ns.run("hacks/raise_hacking.js",1,"home-2")}>Run Raise Hacking</button>

					<button className="btn btn-outline-success" onClick={() => _ns.run("singularity/purchase_darkweb_programs.js")}>Run Purchase Dark Web Programs</button>
					<button className="btn btn-outline-success" onClick={() => _ns.run("singularity/backdoor_all_servers.js")}>Run Backdoor All Servers</button>

					<button className="btn btn-outline-success" onClick={() => _ns.run("improvements/improve_purchased_servers.js")}>Improve Purchased Servers</button>
				</div>

		</div>
	)
}
