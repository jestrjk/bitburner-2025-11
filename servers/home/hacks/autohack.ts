import { RuntimeDataManager, RUNTIME_DATA_FILENAMES } from "../runtime_data_managment/runtime_data_manager";
import { ServerListData } from "../runtime_data_polling/ServerListData";
import { RunningScriptData } from "../runtime_data_polling/RunningScriptData";

let _ns:NS;

function _exec( script:string, scriptRunner: string, threads:number, hostname:string ) {
  let pid = _ns.exec(script, "home", threads, hostname)
  if ( pid === 0 ) {
    _ns.tprint( `autohack: failed to exec [${scriptRunner}] ${script} -T ${threads} ${hostname}`)
  }
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
      
      serverListData.servers.forEach( server => {
				
				if ( !server.hasAdminRights )  { 
					try{ ns.sqlinject(server.hostname) } catch (e) { }
					try{ ns.brutessh(server.hostname) } catch (e) { }
					try{ ns.ftpcrack(server.hostname) } catch (e) { }
					try{ ns.httpworm(server.hostname) } catch (e) { }
					try{ ns.relaysmtp(server.hostname) } catch (e) { }
					try{ ns.nuke(server.hostname) } catch (e) { }
					return;
				} ;

				if ( server.moneyMax === 0 ) { return } ;
				if ( server.requiredHackingSkill > ns.getHackingLevel() )  { return } ;
        if ( runningScriptData.runningScripts.find( s => s.targetHostname === server.hostname ) ) { return };

        const hackChance = ns.hackAnalyzeChance(server.hostname)
        const moneyPercent = server.moneyAvailable / server.moneyMax
        
        const growTime = ns.getGrowTime(server.hostname)
        const hackTime = ns.getHackTime(server.hostname)
        const weakenTime = ns.getWeakenTime(server.hostname)
        
        const hackThreads = Math.ceil(ns.hackAnalyzeThreads(server.hostname, .5*server.moneyAvailable))  
        
        const growthMultiplier = server.moneyMax/(server.moneyAvailable+1)
        const correctedGrowthMultiplier = growthMultiplier < 1 ? 1 : growthMultiplier
        const growThreads = Math.ceil(ns.growthAnalyze(server.hostname, correctedGrowthMultiplier ))  

        const weakenThreads = Math.ceil((ns.getServerSecurityLevel(server.hostname) - ns.getServerMinSecurityLevel(server.hostname)) / .05)

        //ns.tprint( `autohack: ${server.hostname} hackChance: ${hackChance} moneyPercent: ${moneyPercent}`)

        if (moneyPercent > .9 && hackThreads >= 1) {
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
      ns.print( `Hacking Script #: ${runningScriptData.runningScripts.length}`)
      ns.print( `Updated: ${new Date().toLocaleString()}`)
			ns.print( `Took: ${Date.now() - startTime}ms`)
      await ns.sleep(1000)
    }
}