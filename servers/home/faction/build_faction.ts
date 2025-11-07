
export async function main(ns:NS) {
	ns.ui.openTail()
	ns.disableLog("sleep")
	
	ns.singularity.workForFaction("Daedalus", "hacking", true)

	while (true) {
		let startTime = Date.now()
		let shareRamUsage = ns.getScriptRam("faction/share.js")
		let availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let threads = Math.floor((availableRam/2) / shareRamUsage)

		let pid = ns.exec( "faction/share.js", "home", threads )
		if ( pid === 0 ) {
			ns.tprint( `Failed to exec [faction/share.js] -T ${threads}`)
			ns.exit()
		}
		while ( ns.scriptRunning("faction/share.js", "home") ) {
			await ns.sleep(500)
		}
		ns.print( `Took: ${Date.now() - startTime}ms`)
	}

}
