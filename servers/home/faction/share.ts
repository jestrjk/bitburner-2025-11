export async function main(ns:NS) {

	let script = ns.getRunningScript(ns.pid)
	
	ns.print(`Sharing -t ${script.threads} ` + 
		`(${ns.formatRam(script.ramUsage*script.threads)}/` +
		`${ns.formatRam(ns.getServerMaxRam(ns.getHostname())-ns.getServerUsedRam(ns.getHostname()))})`)
	await ns.share()

}
