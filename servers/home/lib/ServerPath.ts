

export class ServerPath {
  private _path: string[] = []
  private _already_visited_names: string[] = []
	
	constructor(readonly ns:NS, readonly target_node_name:string, private start_node_name?:string ) {
    this.ns = ns

		this.start_node_name = start_node_name ?? this.ns.getHostname()

		this.ns.disableLog("scan")
    if(!this.findPath( this.start_node_name )) {
      ns.print(`Could not find Path`)
    }
	
  }

  get path() {
    return this._path
  }

  get visited() {
    return this._already_visited_names
  }

  goToTarget(target_server_name:string = this.target_node_name) {
    for( let next_server_name_in_path of this._path ){
      this.ns.singularity.connect( next_server_name_in_path ) 
    }
  }
  private findPath(current_node_name:string):boolean {
    if ( this._already_visited_names.includes( current_node_name )){
      //this._already_visited_names.push(`DEAD END`)
      return false;
    } 

    this._already_visited_names.push ( current_node_name )
    this._path.push( current_node_name )

    if ( current_node_name === this.target_node_name ) {
      return true
    }
		
    let child_node_names = this.ns.scan( current_node_name )
    for (let child_node_name of child_node_names){
      
      let found_path = this.findPath(child_node_name) 
      if (found_path) return found_path
    } 
    this._path.pop() 
    this._already_visited_names.push(`DEAD END`)
    return false     
  }
}