import { RuntimeDataManager } from "./RuntimeDataManager";
import { ServerListData } from "./ServerListData";

export class ServerListDataManager  {
  private _data: ServerListData = {
    last_updated: 0,
    servers: []
  }

  public get servers() { return this._data.servers }
  public get lastUpdated() { return this._data.last_updated }

  public getHackableServers() { return this._data.servers.filter( s=> s.hasAdminRights && s.moneyAvailable > 0 && !s.purchasedByPlayer) }
  public getHacknetNodes() { return this._data.servers.filter( s=> s.purchasedByPlayer && s.hostname.startsWith("hacknet")) }
  public getStandardPlayerPurchasedServers() { return this._data.servers.filter( s=> s.purchasedByPlayer && !s.hostname.startsWith("hacknet")) }
  
  constructor( readonly ns: NS) {
    const dataManager = new RuntimeDataManager(ns)
    this._data = dataManager.readServerList()
  }
  
}
