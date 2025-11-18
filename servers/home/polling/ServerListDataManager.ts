import { StorageManager } from "./StorageManager";
import { ServerListData } from "./ServerListData";

export class ServerListDataManager  {
 
  public get lastUpdated() { return this.server_list_data.last_updated }
  public get servers() { return this.server_list_data.servers }
  
  public get serverListData() { return this.server_list_data }

  public getHackableServers() { return this.server_list_data.servers.filter( s=> s.hasAdminRights && s.moneyAvailable > 0 && !s.purchasedByPlayer) }
  public getHacknetNodes() { return this.server_list_data.servers.filter( s=> s.purchasedByPlayer && s.hostname.startsWith("hacknet")) }
  public getStandardPlayerPurchasedServers() { return this.server_list_data.servers.filter( s=> s.purchasedByPlayer && !s.hostname.startsWith("hacknet")) }
  
  constructor( readonly ns: NS, private server_list_data: ServerListData) {}

  static fromStorage(ns:NS) {
    const dataManager = new StorageManager(ns)
    const serverListData = dataManager.readServerList()
    return new ServerListDataManager(ns, serverListData)
  }
  
  public writeToStorage() {
    const dataManager = new StorageManager(this.ns)
    dataManager.writeServerList(this.server_list_data)
  }
}
