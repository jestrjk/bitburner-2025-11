
export async function main(ns:NS) {
	ns.ui.openTail()
	ns.clearLog()

	let hostname = ns.args[0] as string
	ns.scp("hacks/weaken.js", hostname)

	while(true) {
		const startedAt = Date.now()
		ns.disableLog("sleep")
		ns.disableLog("getHackingLevel")
		ns.disableLog("getWeakenTime")
		ns.disableLog("getServerMaxRam")
		ns.disableLog("getServerUsedRam")
		ns.disableLog("getScriptRam")
		ns.disableLog("exec")
		ns.clearLog()
		
		let hackingSkill = ns.getHackingLevel()
		ns.print( `Hacking Skill: ${hackingSkill}`)
				
		let weakenRamUsage = ns.getScriptRam("hacks/weaken.js")
		let availableRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)
		let threads = Math.floor((availableRam/2) / weakenRamUsage)
		
		if ( threads > 0 ) {
			let pid = ns.exec("hacks/weaken.js", hostname, threads, "n00dles")
			ns.print(`(${pid}) hacks/weaken.js -t ${threads} ${hostname} (${ns.formatRam(weakenRamUsage*threads)}) `)
			ns.print( `Updated:${new Date().toLocaleString()} (${Date.now()-startedAt}ms)`)
		}
		
		await ns.sleep(ns.getWeakenTime("n00dles"))
	}
}
