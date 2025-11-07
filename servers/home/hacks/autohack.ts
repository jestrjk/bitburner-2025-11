import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from "../runtime_data_managment/runtime_data_manager";
import { ServerListData } from "../runtime_data_polling/ServerListData";
import { RunningScriptData } from "../runtime_data_polling/RunningScriptData";
import { NS, Server } from "@/NetscriptDefinitions";
import { _exec, SCRIPT_PATHS } from "../lib/exec";

let _ns:NS;

function hackPorts(ns: NS, tServer: Server) {
	try { ns.sqlinject(tServer.hostname); } catch (e) { }
	try { ns.brutessh(tServer.hostname); } catch (e) { }
	try { ns.ftpcrack(tServer.hostname); } catch (e) { }
	try { ns.httpworm(tServer.hostname); } catch (e) { }
	try { ns.relaysmtp(tServer.hostname); } catch (e) { }
	try { ns.nuke(tServer.hostname); } catch (e) { }
}

export async function main(ns : NS) {
    _ns = ns; // Convenience
    ns.ui.openTail();

		const serverListDataManager = new RuntimeDataManager<ServerListData>(ns, RUNTIME_DATA_FILENAMES.SERVER_LIST)
    const runningScriptDataManager = new RuntimeDataManager<RunningScriptData>(ns, RUNTIME_DATA_FILENAMES.RUNNING_SCRIPTS)

    while (true) {
			const startTime = Date.now()
      const serverListData:ServerListData = serverListDataManager.readData()
      const runningScriptData:RunningScriptData = runningScriptDataManager.readData()
			
      serverListData.servers.forEach( tServer => {
				
				if ( !tServer.hasAdminRights )  { 
					hackPorts(ns, tServer);
					return
				} ;

				if ( tServer.moneyMax === 0 ) { return } ;
				if ( tServer.requiredHackingSkill > ns.getHackingLevel() )  { return } ;
        if ( runningScriptData.runningScripts.find( s => s.targetHostname === tServer.hostname ) ) { return };

        const hackChance = ns.hackAnalyzeChance(tServer.hostname)
        const moneyPercent = tServer.moneyAvailable / tServer.moneyMax
        
        const growTime = ns.getGrowTime(tServer.hostname)
        const hackTime = ns.getHackTime(tServer.hostname)
        const weakenTime = ns.getWeakenTime(tServer.hostname)
        
        const hackThreads = Math.ceil(ns.hackAnalyzeThreads(tServer.hostname, .5*tServer.moneyAvailable))  
        
        const growthMultiplier = tServer.moneyMax/(tServer.moneyAvailable+1)
        const correctedGrowthMultiplier = growthMultiplier < 1 ? 1 : growthMultiplier
        const growThreads = Math.ceil(ns.growthAnalyze(tServer.hostname, correctedGrowthMultiplier ))  

				const securityDiff = Math.floor(ns.getServerSecurityLevel(tServer.hostname) - ns.getServerMinSecurityLevel(tServer.hostname))
        const weakenThreads = Math.ceil(securityDiff / .05)
				
        if (moneyPercent > .9 && hackThreads >= 1) {
          _exec(ns, SCRIPT_PATHS.HACK, hackThreads, tServer.hostname)
        }
        
        if ( growThreads >= 1 ) {
          _exec(ns, SCRIPT_PATHS.GROW, growThreads, tServer.hostname)
        }

        if ( securityDiff > 0 && weakenThreads >= 1 ) {
          _exec(ns, SCRIPT_PATHS.WEAKEN, weakenThreads, tServer.hostname)
        }       

      })

      ns.clearLog()
      ns.print( `Hacking Script #: ${runningScriptData.runningScripts.length}`)
      ns.print( `Updated: ${new Date().toLocaleString()}`)
			ns.print( `Took: ${Date.now() - startTime}ms`)
      await ns.sleep(1000)
    }
}


