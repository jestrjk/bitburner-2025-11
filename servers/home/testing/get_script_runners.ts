
import { getScriptRunners } from "../polling/ScriptRunners";

export async function main(ns:NS) {
	const scriptRunners = getScriptRunners(ns)

	scriptRunners.forEach( s => ns.tprint( s.hostname ) )
}