import React, {useState, useEffect} from 'react';

interface DotInfo {
  dots: string[]
  idot: number
}

interface Difference {
  money: number
  diff: number
  timestamp: number
}

function MoneyPerSecond({ ns }: { ns:NS }) {

  let dot_info:DotInfo = {
    dots: ["/","-","\\","|"],
    idot: 0
  }
  
  let difference_history:Difference[] = []

	const player = ns.getPlayer()
	let money_difference = 0

	if ( difference_history.length < 2 ) {
		difference_history.push( {
			money: player.money,
			diff: 0,
			timestamp: Date.now(),
		})
	} else {
		money_difference = player.money - difference_history[difference_history.length-1].money
		let current_difference:Difference = {
			money: player.money,      
			diff: money_difference,
			timestamp: Date.now(),
		}
		difference_history.push( current_difference )
	}

	difference_history = difference_history.filter(d=>(Date.now()-d.timestamp) < (ROLLING_TIME_SECONDS*1000) ) 
	let difference_by_age: number[] = []
	for ( let diff of difference_history ){
		let age_in_seconds = ((Date.now() - diff.timestamp)/1000)
		age_in_seconds = age_in_seconds?age_in_seconds:1

		let diff_by_age    = (diff.diff / age_in_seconds)
		difference_by_age.push( diff_by_age )
	}
	let cumlative_diff_per_rolling_time = difference_by_age.reduce((p,c)=>p + c) 
	let hacking = player.skills.hacking
	  
	return (
		<div>
			<table>
				<tr><td>Money</td><td>{ns.formatNumber(player.money)}</td></tr>
				<tr><td>Money/s</td><td>{ns.formatNumber(cumlative_diff_per_rolling_time,1)}/{ROLLING_TIME_SECONDS}s {NaN?`(NaN)`:``} {printDot(ns,dot_info)}</td></tr>
				<tr><td>Karma</td><td>{player.numPeopleKilled *3}/54000</td></tr>
				<tr><td>Hacking</td><td>{hacking}</td></tr>
			</table>
		</div>
	)
}

export async function main(ns:NS) {
  ns.ui.openTail()
  
  const ROLLING_TIME_SECONDS = 20

  const [window_width, window_height] = ns.ui.windowSize()
  const desired_tail_width    = 250
  const desired_tail_height   = 140
  ns.ui.resizeTail(desired_tail_width,desired_tail_height)
	ns.ui.moveTail(window_width-desired_tail_width, window_height-desired_tail_height-5)

  ns.disableLog( "asleep")
  ns.disableLog( "sleep")
  

	ns.printRaw( <MoneyPerSecond ns={ns} /> )

  while ( true ) {
   
  
    await ns.asleep( 1000 )
  }

  // FUNCTIONS
  
  function printDot(ns:NS, dot_info:DotInfo ) {
    dot_info.idot++ 
    if ( dot_info.idot >= dot_info.dots.length ) dot_info.idot = 0
    return dot_info.dots[dot_info.idot]
  }

 }// main

function js( value:object, digits?:number ) {
  return JSON.stringify(value, null, digits)
}