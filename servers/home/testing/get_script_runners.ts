
import { getScriptRunners } from "../data_management/ScriptRunners";

export async function main(ns:NS) {
	const scriptRunners = getScriptRunners(ns)

	scriptRunners.forEach( s => ns.tprint( s.hostname ) )
}