
import React, { useEffect, useState } from "react"
import { StorageManager } from "../data_management/StorageManager"

let _ns:NS
export async function main(ns:NS) {
	ns.tprint("Hacknet Improvements")
	ns.disableLog("disableLog")
	ns.disableLog("sleep")
	ns.ui.openTail()

	let lastHeartBeat = 0
	const heartBeat = () => { 
		if( Date.now() - lastHeartBeat > 10*60*1000 ) { // every 10 minutes
			ns.print( "improvements/hacknet.js: " + (new Date().toLocaleString() + ` $${ns.formatNumber(ns.getPlayer().money,2)}`))	
			lastHeartBeat = Date.now() 
		}
	}

	function getStats( nodeId:number ) {
		return {
			...ns.hacknet.getNodeStats(nodeId),
			coreUpgradeCost: ns.hacknet.getCoreUpgradeCost(nodeId),
			ramUpgradeCost: ns.hacknet.getRamUpgradeCost(nodeId),
			levelUpgradeCost: ns.hacknet.getLevelUpgradeCost(nodeId)
		}
	}

	const printStats = (i:number) => {
				const stats = getStats(i)
				
				heartBeat()

				const rowFormat = "| %6s | %12s | %12s | %12s | %12s |"
				ns.printf( rowFormat, "Node", "Level", "Cores", "RAM", "Money")
				ns.printf( rowFormat, i,stats.level,  stats.cores, stats.ram, "" )
				ns.printf( rowFormat, "Cost", ns.formatNumber(stats.levelUpgradeCost,2), ns.formatNumber(stats.coreUpgradeCost,2), ns.formatNumber(stats.ramUpgradeCost,2), `($${ns.formatNumber(ns.getPlayer().money,2)})`)
			}

	heartBeat()
	printStats(0)
	
	while ( true ) {
		const numNodes = ns.hacknet.numNodes()
		for ( let i = 0; i < numNodes; i++ ) {

			const coreUpgradeCost = ns.hacknet.getCoreUpgradeCost(i) ?? Infinity
			const ramUpgradeCost = ns.hacknet.getRamUpgradeCost(i) ?? Infinity
			const levelUpgradeCost = ns.hacknet.getLevelUpgradeCost(i) ?? Infinity
			
			const minCost = Math.min(coreUpgradeCost, ramUpgradeCost, levelUpgradeCost)
			if (  minCost < ns.getPlayer().money ) {
				switch ( minCost ) {
					case coreUpgradeCost:
						ns.hacknet.upgradeCore(i, 1)
						printStats(i)
						break
					case ramUpgradeCost:
						ns.hacknet.upgradeRam(i, 1)
						printStats(i)
						break
					case levelUpgradeCost:
						ns.hacknet.upgradeLevel(i, 1)
						printStats(i)
						break
					default:
						break
				}
			}
		}

		heartBeat()
		await ns.sleep(1000)
	}

}

function HacknetUI() {

	const [maxHackLevel, setMaxHackLevel] = useState(3000)
	const storageManager = new StorageManager(_ns)

	return (
		<div>
			<h1>Hacknet</h1>
		</div>
	)
}
