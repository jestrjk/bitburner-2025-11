import React,{useState, useEffect} from "react";
import { ServerListData } from "./ServerListData";
import { ServerListDataManager } from "./ServerListDataManager";
import { RunningScriptData } from "./RunningScriptsData";
import { RunningScriptsDataManager } from "./RunningScriptsDataManager";

let intervalId = 0;
let _ns:NS;

function ServerListDataUi( {interval}: {interval:number } = {interval:1000} ) {
  const [serverListData, setServerListData] = useState<ServerListData>({servers:[], last_updated:0})
  const [runningScriptsData, setRunningScriptsData] = useState<RunningScriptData>({last_updated:0, running_scripts:[]})
  

  const [userScriptCount, setUserScriptCount] = useState(0)
  const [hackScriptCount, setHackScriptCount] = useState(0)
  const [growScriptCount, setGrowScriptCount] = useState(0)
  const [weakenScriptCount, setWeakenScriptCount] = useState(0)
  const [unknownScriptCount, setUnknownScriptCount] = useState(0)

  const fetchData = () => {
    const serverListDataManager = ServerListDataManager.fromStorage(_ns)
    setServerListData(serverListDataManager.serverListData)
    const runningScriptsDataManager = RunningScriptsDataManager.fromStorage(_ns)
    setUserScriptsData(runningScriptsDataManager.running_scripts_data)
  
    setUserScriptCount(userScriptsData.user_scripts.filter( s=> s.type === "user" ).length)
    setHackScriptCount(userScriptsData.user_scripts.filter( s=> s.type === "hack" ).length)
    setGrowScriptCount(userScriptsData.user_scripts.filter( s=> s.type === "grow" ).length)
    setWeakenScriptCount(userScriptsData.user_scripts.filter( s=> s.type === "weaken" ).length)
    setUnknownScriptCount(userScriptsData.user_scripts.filter( s=> s.type === "unknown" ).length)
    
  }

  useEffect( () => {

    fetchData()

    intervalId = setInterval(() => fetchData(), interval);
    return () => clearInterval(intervalId);
  }, [])
  
  const th = (...content: React.ReactNode[]) => ( <tr>{content.map( c=> <th>{c}</th> )}</tr> )
  const tr = (...content: React.ReactNode[]) => ( <tr>{content.map( c=> <td>{c}</td> )}</tr> )
  
  return (
    <div>

      <h2>Server List</h2>
      <table>
        <thead>
          {th(["Server Counts", "Server", "Hacknet Servers", "Standard Player Purchased Servers"])}
        </thead>
        <tbody>
          {tr("", serverListData.servers.length, serverListData.hacknet_servers.length, serverListData.standard_player_purchased_servers.length)}
        </tbody>
      </table>
      
      {
      // t(
      //   thr("User Scripts", "Type", "Count"),
      //   tb(
      //     tr("", "user", userScriptCount),
      //     tr("", "hack", hackScriptCount),
      //     tr("", "grow", growScriptCount),
      //     tr("", "weaken", weakenScriptCount),
      //     tr("", "unknown", unknownScriptCount),
      //     tr("", "total", userScriptCount + hackScriptCount + growScriptCount + weakenScriptCount + unknownScriptCount),
      //   )
      // )
      }
    </div>
  )
}


export async function main(ns:NS) {
  _ns = ns ;
  ns.ui.openTail()
	ns.disableLog("sleep")
  ns.disableLog("asleep")
  ns.disableLog("scan")

  ns.atExit( () => {
    clearInterval(intervalId)
  })
  
  ns.printRaw( <ServerListDataUi /> )
  while ( true ) {
    await ns.asleep(500)    
  }
}

