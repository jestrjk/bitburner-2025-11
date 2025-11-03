export async function main(ns : NS) {
    let target: string  = ns.args[0] as string

    let hack_result = await ns.hack( target )

    //ns.tprint(`[${target}] hack_result: ${hack_result}`)
}