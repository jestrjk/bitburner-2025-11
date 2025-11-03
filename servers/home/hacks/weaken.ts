export async function main(ns : NS) {
    let target: string  = ns.args[0] as string

    let weaken_result = await ns.weaken( target )

    ns.tprint(`[${target}] weaken_result: ${weaken_result}`)
}