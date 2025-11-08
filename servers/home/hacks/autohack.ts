import { RuntimeDataManager, ServerListData, RunningScriptData } from "../runtime_data_managment/RuntimeDataManager";
import { NS, Server } from "@/NetscriptDefinitions";
import { _exec, SCRIPT_PATHS } from "../lib/exec";
import { getSettings } from "../runtime_data_managment/settings";

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

		const dataManager = new RuntimeDataManager(ns)

    while (true) {
			const settings = getSettings(ns)
			const startTime = Date.now()
      const serverListData:ServerListData = dataManager.readServerList()
      const runningScriptData:RunningScriptData = dataManager.readRunningScripts()
			
      serverListData.servers.sort( (a, b) => a.requiredHackingSkill - b.requiredHackingSkill ).forEach( targetServer => {
				
				if ( !targetServer.hasAdminRights )  { 
					hackPorts(ns, targetServer);
					return
				} ;

				if ( targetServer.moneyMax === 0 ) { return } ;
				if ( targetServer.requiredHackingSkill > settings.maxHackLevel )  { return } ;
        // Do this to prevent double hacking. But lets move it to the actions so that we can be smarter about it.
				// if ( runningScriptData.runningScripts.find( script => script.targetHostname === targetServer.hostname ) ) { return };

        const hackChance = ns.hackAnalyzeChance(targetServer.hostname)
        const moneyPercent = targetServer.moneyAvailable / targetServer.moneyMax
        
        const growTime = ns.getGrowTime(targetServer.hostname)
        const hackTime = ns.getHackTime(targetServer.hostname)
        const weakenTime = ns.getWeakenTime(targetServer.hostname)
        
        const hackThreads = Math.ceil(ns.hackAnalyzeThreads(targetServer.hostname, .5*targetServer.moneyAvailable))  
        
        const growthMultiplier = targetServer.moneyMax/(targetServer.moneyAvailable+1)
        const correctedGrowthMultiplier = growthMultiplier < 1 ? 1 : growthMultiplier
        const growThreads = Math.ceil(ns.growthAnalyze(targetServer.hostname, correctedGrowthMultiplier ))  

				const securityDiff = Math.floor(ns.getServerSecurityLevel(targetServer.hostname) - ns.getServerMinSecurityLevel(targetServer.hostname))
        const weakenThreads = Math.ceil(securityDiff / .05)
				
				const scriptsTargetingOurCurrentTarget = runningScriptData.running_scripts.filter( s => s.targetHostname === targetServer.hostname )

        if (moneyPercent > .9 && hackThreads >= 1 && !scriptsTargetingOurCurrentTarget.find( s => s.hackType === "hack" ) ) {
          _exec(ns, SCRIPT_PATHS.HACK, hackThreads, targetServer.hostname)
        }
        
        if ( securityDiff < 5 && growThreads >= 1 && !scriptsTargetingOurCurrentTarget.find( s => s.hackType === "grow" ) ) {
          _exec(ns, SCRIPT_PATHS.GROW, growThreads, targetServer.hostname)
        }

        if ( securityDiff > 0 && weakenThreads >= 1 && !scriptsTargetingOurCurrentTarget.find( s => s.hackType == "weaken" ) ) {
          _exec(ns, SCRIPT_PATHS.WEAKEN, weakenThreads, targetServer.hostname)
        }       

      })

      ns.clearLog()
      ns.print( `Hacking Script #: ${runningScriptData.running_scripts.length}`)
      ns.print( `Updated: ${new Date().toLocaleString()}`)
			ns.print( `Took: ${Date.now() - startTime}ms`)
      await ns.sleep(1000)
    }
}


