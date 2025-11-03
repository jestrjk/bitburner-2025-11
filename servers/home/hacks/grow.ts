export async function main(ns : NS) {
    let target: string  = ns.args[0] as string

    let grow_result = await ns.grow( target )

    ns.tprint(`[${target}] grow_result: ${grow_result}`)
}