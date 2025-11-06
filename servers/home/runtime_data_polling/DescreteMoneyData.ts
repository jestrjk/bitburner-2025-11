import { PORT_LIST } from "../runtime_data_managment/portManager"

export interface DiscreteMoneyData {
	last_updated: number,
	money: number
}

const _moneyData: DiscreteMoneyData[] = []

export function getAverageMoneyDiffOverTime(ns:NS, from_time:number) {
	let data = JSON.parse( ns.peek(PORT_LIST.MONEY_OVER_TIME) ) as DiscreteMoneyData
	return data.money
}

export async function main(ns:NS) {
	ns.ui.openTail()
	ns.disableLog("asleep")

	const max_data_points = 50
	const check_interval = 500 //ms
	while (true) {
		ns.clearLog()

		_moneyData.push({ last_updated: Date.now(), money: ns.getPlayer().money })	

		if ( _moneyData.length > max_data_points ) {
			_moneyData.pop()
		}

		ns.print( `MoneyDifference: ${ns.formatNumber(_moneyData[_moneyData.length-1].money - _moneyData[0].money, 2)}` )
		ns.print( `Last Updated: ${new Date().toLocaleString()}` )
		await ns.asleep(check_interval)
	}
}
