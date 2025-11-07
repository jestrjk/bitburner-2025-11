export async function main(ns:NS) {
	ns.ui.openTail()
	ns.ui.moveTail( 400, 400 )

	while(true) {
		ns.clearLog()
		
		let hackingSkill = ns.getHackingLevel()
		ns.print( `Hacking Skill: ${hackingSkill}`)
		
		let weakenRamUsage = ns.getScriptRam("hacks/weaken.js")
		let availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		let threads = Math.floor((availableRam/2) / weakenRamUsage)
		
		if ( threads > 0 ) {
			ns.exec("hacks/weaken.js", "home", threads, "n00dles")
		}

		await ns.sleep(ns.getWeakenTime("n00dles"))
		
		if ( hackingSkill >= 3000 ) {
			ns.print( `Finished`)
			ns.ui.closeTail()
			ns.exit()
		}
		await ns.sleep(500)
	}
}
