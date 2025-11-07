import { RUNTIME_DATA_FILENAMES } from "./runtime_data_managment/runtime_data_manager"

export async function main(ns:NS) {
  ns.ui.openTail()

	ns.killall("home")

	ns.rm( RUNTIME_DATA_FILENAMES.SERVER_LIST )
	ns.rm( RUNTIME_DATA_FILENAMES.RUNNING_SCRIPTS )
	ns.rm( RUNTIME_DATA_FILENAMES.MONEY_OVER_TIME )

	ns.run("runtime_data_polling/ServerListData.js")
	ns.run("runtime_data_polling/RunningScriptData.js")
	ns.run("dashboard/ServerBrowser.js")
	ns.run("hacks/autohack.js")
	ns.run("hacks/raise_hacking.js")
	ns.run("singularity/purchase_dark_web_programs.js")
	// ns.run("faction/build_faction.js")
}