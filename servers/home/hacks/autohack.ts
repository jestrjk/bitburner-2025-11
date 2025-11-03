import { ServerListData, readServerList } from "../server_information/ServerInformationList";

let _ns:NS;

interface hackingData {
 hackType: string,
 threads: number,
 scriptRunner: string,
 hostname: string
}

const whosBeingHacked:hackingData[] = []

function reconcileRunningScripts(ns:NS) {
  const psResults = ns.ps( "home" )
  psResults.forEach( psResult => {
    let match = /(hack|weaken|grow)\.js$/.exec(psResult.filename)
    //ns.tprint( `${psResult.args.join(" ")}` )
    if ( match ){
      whosBeingHacked.push({
        hostname: psResult.args[0]?.toString() || "",
        hackType: match[1],
        threads:  psResult.threads,
        scriptRunner: "home"
      })
    }
  })
  
}

function _exec( script:string, scriptRunner: string, threads:number, hostname:string ) {
  let pid = _ns.exec(script, "home", threads, hostname)
  if ( pid === 0 ) {
    _ns.tprint( `autohack: failed to exec [${scriptRunner}] ${script} -T ${threads} ${hostname}`)
  }
}

export async function main(ns : NS) {
    _ns = ns; // Convenience
    ns.ui.openTail();

    const data = {}
    while (true) {
      const serverListData:ServerListData = readServerList(ns)
      whosBeingHacked.length = 0;
      reconcileRunningScripts(ns)
      
      serverListData.servers.forEach( server => {

        if ( !server.hasAdminRights )  { return } ;
        if ( server.moneyMax === 0 )  { return } ;
        if ( server.requiredHackingSkill > ns.getHackingLevel() )  { return } ;
        if ( whosBeingHacked.find( h => h.hostname === server.hostname ) ) { return };

        const hackChance = ns.hackAnalyzeChance(server.hostname)
        const moneyPercent = server.moneyAvailable / server.moneyMax
        
        const growTime = ns.getGrowTime(server.hostname)
        const hackTime = ns.getHackTime(server.hostname)
        const weakenTime = ns.getWeakenTime(server.hostname)
        
        const hackThreads = 1 + Math.ceil(ns.hackAnalyzeThreads(server.hostname, .5*server.moneyAvailable))  
        
        const growthMultiplier = server.moneyMax/(server.moneyAvailable+1)
        const correctedGrowthMultiplier = growthMultiplier < 1 ? 1 : growthMultiplier
        const growThreads = 1 + Math.ceil(ns.growthAnalyze(server.hostname, correctedGrowthMultiplier ))  

        const weakenThreads = 1 + Math.ceil((ns.getServerSecurityLevel(server.hostname) - ns.getServerMinSecurityLevel(server.hostname)) / .05)

        //ns.tprint( `autohack: ${server.hostname} hackChance: ${hackChance} moneyPercent: ${moneyPercent}`)

        if (hackThreads >= 1) {
          _exec("/hacks/hack.js", "home", hackThreads, server.hostname)
        }
        
        if ( growThreads >= 1 ) {
          _exec("/hacks/grow.js", "home", growThreads , server.hostname)
        }

        if ( weakenThreads >= 1 ) {
          _exec("/hacks/weaken.js", "home", weakenThreads, server.hostname)
        }       

      })
      
      ns.clearLog()
      ns.print(JSON.stringify( whosBeingHacked ))
      ns.print( `Hacking Script #: ${whosBeingHacked.length}`)
      ns.print( `Updated: ${new Date().toLocaleString()}`)
      await ns.sleep(1000)
    }
}