export async function main(ns:NS) {
	ns.ui.openTail()

	while( true ) {
		const startedAt = Date.now()
		ns.clearLog()
		
		const upgradeCosts = []
		// 10000000 // ns.singularity.getUpgradeHomeRamCost()
		const homeRamCost:number = ns.singularity.getUpgradeHomeRamCost()

		ns.getPurchasedServers().forEach( hostname => {
			const server = ns.getServer(hostname)
			const upgradeCost = ns.getPurchasedServerUpgradeCost(hostname, server.maxRam*2 )
			ns.print( `Upgrade ${hostname} for ${ns.formatNumber(upgradeCost, 1)}` )

			if ( upgradeCost < ns.getPlayer().money && upgradeCost < homeRamCost ) {
				ns.print( `Upgrade ${hostname} for ${ns.formatNumber(upgradeCost, 1)}` )
				ns.upgradePurchasedServer(hostname, server.maxRam*2)
			}
		} )

		await ns.sleep(2000)
	}
}
