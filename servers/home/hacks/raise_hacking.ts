
export async function main(ns:NS) {
	ns.ui.openTail()

	let hostname = ns.args[0] as string

	while(true) {
		ns.disableLog("sleep")
		ns.clearLog()
		
		let hackingSkill = ns.getHackingLevel()
		ns.print( `Hacking Skill: ${hackingSkill}`)
		
		let weakenRamUsage = ns.getScriptRam("hacks/weaken.js")
		let availableRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)
		let threads = Math.floor((availableRam/2) / weakenRamUsage)
		
		if ( threads > 0 ) {
			ns.print( `${Date.now().toLocaleString()} (${Date.now()})`)
			ns.exec("hacks/weaken.js", hostname, threads, "n00dles")
		}

		await ns.sleep(ns.getWeakenTime("n00dles"))
		
		if ( hackingSkill >= 3000 ) {
			ns.print( `Finished`)
			ns.ui.closeTail()
			ns.exit()
		}
		await ns.sleep(1000)
	}
}
