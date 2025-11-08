import { clearDataFiles } from "./runtime_data_managment/RuntimeDataManager"

export async function main(ns:NS) {
  ns.ui.openTail()

	ns.killall("home")

	clearDataFiles(ns)

	ns.run("runtime_data_polling/ServerListData.js")
	ns.run("runtime_data_polling/RunningScriptData.js")
	ns.run("dashboard/ServerBrowser.js")
	ns.run("hacks/autohack.js")
	ns.run("hacks/raise_hacking.js")
	ns.run("singularity/purchase_dark_web_programs.js")
	// ns.run("faction/build_faction.js")
}