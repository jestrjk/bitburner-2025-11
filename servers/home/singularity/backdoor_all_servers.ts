import { ServerPath } from '../lib/ServerPath'

const backdoor_servers = [
	"CSEC",
	"avmnite-02h",
	"I.I.I.I",
	"run4theh111z",
]

export async function main(ns: NS) {
	ns.ui.openTail();

	while (true) {
		let backdoor_count = 0 
		for ( const hostname of backdoor_servers ) {
			if ( ns.hasRootAccess(hostname) ) { 
				await backdoor_run(ns, hostname)	
				backdoor_count++
			}
		}
		ns.print( `Backdoored ${backdoor_count} of ${backdoor_servers.length}`)
		if ( backdoor_count >= backdoor_servers.length ) { ns.exit() }
		await ns.sleep(10000)
	}
}

async function backdoor_run(ns:NS, hostname:string) {
	let pather = new ServerPath(ns,ns.getHostname(), hostname)
  
  pather.goToTarget()
  await ns.singularity.installBackdoor()
}