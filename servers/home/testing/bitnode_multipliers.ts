export async function main(ns:NS) {
	const bitnodeMultipliers = ns.getBitNodeMultipliers()

	ns.tprint( JSON.stringify( bitnodeMultipliers, null, 2 ) ) 

}

