import React from "react"
import { useState, useEffect } from "react"
import { ServerListDataManager } from "../polling/ServerListDataManager"
interface ScriptRunnerData {
	last_updated: number,
	scriptRunnerHostname: string,
	ramUsed: number,
	maxMemory: number,
	memoryAvailable: number
}

let _ns:NS
let intervalId = 0

export async function main(ns:NS) {
	ns.clearLog()	
	ns.ui.openTail()

	ns.disableLog("disableLog")
	ns.disableLog("getServer")
	ns.disableLog("asleep")

	_ns = ns
	
	ns.printRaw(<MemoryDials />)
	
	ns.atExit( () => {
		ns.tprint( `Exiting: clearing ${intervalId}`)
		clearInterval(intervalId)
	})

	while ( true ) {
		await ns.asleep(1000)
	}
}

function createTextProgressBar(current: number, total: number, barLength: number = 30): string {
    // Calculate the percentage completion
    const percentage = total === 0 ? 0 : Math.floor((current / total) * 100);
	
    // Calculate the number of filled characters (e.g., '▒')
    const filledLength = Math.floor((percentage / 100) * barLength);
    
    // Calculate the number of empty characters (e.g., ' ')
    const emptyLength = barLength - filledLength;
    
    // Create the filled and empty parts of the bar using string.repeat()
    const filledBar = '▓'.repeat(filledLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    // Format the progress bar string
    return `[${filledBar}${emptyBar}] ${percentage}%`;
}

export default function MemoryDials() {
	const [scriptRunnerData, setScriptRunnerData] = useState<ScriptRunnerData[]>([]) 
	
	const fetchData = async () => {
		const manager = ServerListDataManager.fromStorage(_ns)

		// TODO: we should fold this scrip runner data into the user scripts data manager
		const newList:ScriptRunnerData[] = []
		const playerPurchasedServers = manager.getStandardPlayerPurchasedServers()
		
		playerPurchasedServers.forEach( scriptRunner => {
			newList.push({ last_updated: Date.now(), scriptRunnerHostname: scriptRunner.hostname, 
				ramUsed: scriptRunner.ramUsed, maxMemory: scriptRunner.maxRam, memoryAvailable: scriptRunner.maxRam - scriptRunner.ramUsed })
		})
		
		setScriptRunnerData(newList)
	}

	useEffect(() => {

		fetchData()
		intervalId = setInterval(() => { fetchData() }, 1000)
		_ns.tprint(`Interval ID: ${intervalId}`)

		return () => clearInterval(intervalId)
	
	}, [])
	
	return (
		<div>
			<h1>Memory Dials</h1>
			<table>
				<thead>
					<tr>
						<th>Hostname</th>
						<th>Used</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{scriptRunnerData.map( scriptRunner => {
						return (
							<tr>
								<td>{scriptRunner.scriptRunnerHostname}</td>
								<td>{_ns.formatRam(scriptRunner.ramUsed,0)}/{_ns.formatRam(scriptRunner.maxMemory,0)}</td>
								<td style={{textAlign:"left"}}>{createTextProgressBar(scriptRunner.ramUsed, scriptRunner.maxMemory,10)}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}