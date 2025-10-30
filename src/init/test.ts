export async function main(ns: NS) {

  let n = await ns.getScriptRam( "/scripts/singularity/test.ts")

  ns.tprint( `getScriptRam: ${n} `)

  ns.run ( "/scripts/singularity/test.ts" )

}