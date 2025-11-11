import { ServerPath } from '../lib/ServerPath'

export async function main(ns:NS) {
  ns.ui.openTail()
	const targetHost = ns.args[0].toString()
	const originalHost = ns.args[1]?.toString() || ns.getHostname()

  const pather = new ServerPath(ns,targetHost)
  pather.goToTarget()

	await ns.singularity.installBackdoor()

	const homePath = new ServerPath(ns, originalHost)
	homePath.goToTarget()
}

export function autocomplete(data:any, args:any) {
  let results = []
  if ( data.servers ) results.push( ...data.servers )
  if ( data.scripts ) results.push( ...data.scripts )

  return results
}
