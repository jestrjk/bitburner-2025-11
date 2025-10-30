import { ServerTarget } from "./ServerTarget"

export class ServerTargetList {
  constructor(ns:NS){
    this.ns = ns
    
    this.recursiveServerScan('home')
    ns.print( `Found ${this.all_servers.length} servers` )
  }
  
  private ns:NS
  all_servers: ServerTarget[] = []

  getScriptHosts() {
    return this.all_servers.filter(s=>s.server.purchasedByPlayer )
  }

  getBestScriptHost( required_ram: number ) {
    for( let script_host of this.getScriptHosts() ) {
      let available_ram = script_host.server.maxRam - script_host.server.ramUsed

      if ( available_ram > required_ram ) {
        return script_host
      }
    } 

    return null
  }

  getValidHackTargets() {
    let hack_targets =  this.all_servers.filter( s =>
      ( s.server.hasAdminRights ) && 
      ( s.server.moneyMax! > 0 )
    )

    if ( hack_targets && hack_targets.length > 1 ) {
      return hack_targets
    } else {
      throw( `No valid hack targets` )
    }
  }

  private recursiveServerScan(parent_host_name = 'home'): void {
    let new_server_names = this.ns.scan( parent_host_name )
  
    for ( let new_server_name of new_server_names ) {
      if ( this.all_servers.filter( s=>s.hostname == new_server_name ).length > 0) {
        continue;
      } else {
        this.all_servers.push( new ServerTarget( this.ns,  new_server_name ) )
        this.recursiveServerScan( new_server_name )
      }
    }
  }

}
