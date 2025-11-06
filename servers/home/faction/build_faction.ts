
export async function main(ns:NS) {
	ns.ui.openTail()
	
	ns.singularity.workForFaction("Daedalus", "field", true)
	ns.spawn( "faction/share.js", {threads: 50000, spawnDelay: 500} )
	
}
