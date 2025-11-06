import { ServerPath } from '../lib/ServerPath'

const backdoor_servers = [
	"CSEC",
	"avmnite-02h",
	"I.I.I.I",
	"run4theh111z",
]

export async function main(ns: NS) {
	ns.ui.openTail();

	for ( const hostname of backdoor_servers ) {
		await backdoor_run(ns, hostname)
	}
}

async function backdoor_run(ns:NS, hostname:string) {
	let pather = new ServerPath(ns,ns.getHostname(), hostname)
  
  pather.goToTarget()
  await ns.singularity.installBackdoor()
}