
export async function main(ns:NS) {
  ns.ui.openTail()
  ns.ui.moveTail( 400, 400 )
  
	ns.singularity.purchaseTor()  
  
  while(true) {

    let programs = ns.singularity.getDarkwebPrograms()
    for( let program of programs ) {
      let cost = ns.singularity.getDarkwebProgramCost( program )
      ns.print( `${program.padEnd( 20 )} $${ns.formatNumber( cost,1)}`)
    }
    
		programs.forEach( program => {
			let cost = ns.singularity.getDarkwebProgramCost( program )
			if ( cost < ns.getPlayer().money ) {
				ns.singularity.purchaseProgram(program)
			}
		})

		await ns.sleep(1000)
  }
}

export function autocomplete(data:any, args:any) {
  let results = []
  if ( data.servers ) results.push( ...data.servers )
  if ( data.scripts ) results.push( ...data.scripts )

  return results
}
