import { getData } from "./GlobalData"

export interface ServerAnalysisData {
  weakenAnalyseData:          number
  growthAnalyzeData:          number
  hack_time_required:         number
  hack_money_ratio_stolen:    number
  hack_success_chance:        number
  hack_threads_for_75percent: number
  grow_time_required:         number
  running_scripts:            ProcessInfo[]
}

export enum LiteScriptNames {
  WEAKEN  = 'lite_weaken.ts',
  GROW    = 'lite_grow.ts', 
  HACK    = 'lite_hack.ts',
}

export interface ProcessInfoPlus extends ProcessInfo {
  script_host: string  
}

export class ServerTarget {
  constructor(ns:NS, serverName:string){
    
    this.ns = ns
    this.server = ns.getServer(serverName)
  }

  ns:NS
  server: Server

  get hostname() { return this.server.hostname }

  /** 
   * The amount of money that could be added to the server
   * Calculated as maximum money minus current money
   * Used for targeting decisions and growth calculations
   * @returns {number} Maximum money minus available money
   */
  get moneyPotential() { return this.server.moneyMax! - this.server.moneyAvailable! }

  /** 
   * The ratio of current money to maximum money on the server
   * Used to determine if growing is needed and for targeting decisions
   * @returns {number} Current money divided by maximum money (0-1)
   */
  get moneyRatio() { return this.server.moneyAvailable! / this.server.moneyMax! }

  /** 
   * The difference between current hack difficulty and minimum hack difficulty
   * Used to determine if weakening is needed and how many threads to use
   * @returns {number} Current difficulty minus minimum difficulty
   */
  get difficultyDelta() { return this.server.hackDifficulty! - this.server.minDifficulty! }

  isWeakening() { return this.getRunningLiteScripts().some( p => p.filename.includes( LiteScriptNames.WEAKEN ) ) }
  isGrowing()   { return this.getRunningLiteScripts().some( p => p.filename.includes( LiteScriptNames.GROW ) ) }
  isHacking()   { return this.getRunningLiteScripts().some( p => p.filename.includes( LiteScriptNames.HACK ) ) }

  // TODO: This needs to be moved to the ServerTargetList
  // recursive problems if you dont, you stupid fuck. 
  // 
  getRunningLiteScripts() {
    let script_hosts: ServerTarget[] = getData().server_targets.getScriptHosts()
    let processes:ProcessInfoPlus[] = []
    for (let script_host of script_hosts) {
      processes.concat (
        this.ns.ps( script_host.hostname )
          .filter( p => p.filename.match(/lite_(weaken|grow|hack)\.ts$/) )
          .map( p => ({...p, script_host: script_host.hostname}) )
      )
    }

    return processes
  }
}
