import { clearDataFiles } from "./polling/RuntimeDataManager"

export async function main(ns:NS) {
  ns.ui.openTail()

	ns.killall("home")

	clearDataFiles(ns)

	ns.run("polling/ServerListData.js")
	ns.run("polling/RunningScriptData.js")
	ns.run("dashboard/ServerBrowser.js")
	ns.run("hacks/autohack.js")
	ns.run("dashboard/MemoryDials.js")
	ns.run("singularity/purchase_dark_web_programs.js")
	// ns.run("faction/build_faction.js")
	// ns.run("hacks/raise_hacking.js")

	ns.run("settings/resetWindowProperties.js")
}