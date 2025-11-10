import React, { useEffect, useState } from "react"
import { saveWindowProperties, resetWindowProperties } from "../settings/ui"
import { RuntimeDataManager } from "../polling/RuntimeDataManager"

let _ns:NS
export async function main(ns:NS) {
	_ns = ns
	ns.disableLog("disableLog")
	ns.disableLog("asleep")
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
			
			<table>
				<tr>
					<td className="form-label"><label htmlFor="resetWindowsBtn">Reset Windows:</label></td>
					<td><button className="btn btn-outline-success" id="resetWindowsBtn"onClick={resetWindows}>Reset Windows</button></td>
				</tr>	
				<tr>
					<td className="form-label"><label htmlFor="saveWindowsBtn">Save Windows:</label></td>
					<td><button className="btn btn-outline-success" id="saveWindowsBtn" onClick={saveWindows}>Save Window Properties</button></td>
				</tr>
				<tr>
					<td><label className="form-label" htmlFor="maxHackLevelInput">Max Hack Level:</label></td>
					<td>
						<span  style={{fontSize: "1.8em", padding:".5em"}}>{maxHackLevel}</span>
						<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel-10)}>-10</button>
						<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel+10)}>+10</button>
						<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel-100)}> -100</button>
						<button type="button" className="btn btn-outline-success" onClick={() => updateMaxHackLevel(maxHackLevel+100)}> +100</button>
					</td>
				</tr>
			</table>			

		</div>
	)
}
