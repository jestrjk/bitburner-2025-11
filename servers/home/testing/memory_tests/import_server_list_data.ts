import { NS } from "NetscriptDefinitions";
import { ServerListData } from "../../data_management/ServerListData";

export async function main(ns:NS) {
  let data:ServerListData = {
    last_updated: 0,
    servers: []
  }


  ns.tprint(ns.getScriptRam("testing/import_server_list_data.js"))
}