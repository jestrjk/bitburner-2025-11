import { NS } from "NetscriptDefinitions";

export async function main(ns:NS) {

  ns.tprint(ns.getScriptRam("testing/empty_script.js"))
}