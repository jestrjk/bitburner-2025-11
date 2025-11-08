
import { getScriptRunners } from "../runtime_data_managment/ScriptRunners";

export async function main(ns:NS) {
	const scriptRunners = getScriptRunners(ns)

	scriptRunners.forEach( s => ns.tprint( s.hostname ) )
}