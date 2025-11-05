export async function main(ns:NS) {

		ns.tprint( `Write: ${benchmark_write(ns)}` )
		ns.tprint( `Read: ${benchmark_read(ns)}` )

	}

function getRandomData() {
		const size = 10000;
		const randomStringLength = 10;

		let data = {
			numbers: [],
			strings: [],
		}

		for ( let i = 0; i < size; i++ ) {
			data.numbers.push( Math.random() )
			data.strings.push( generateRandomString(randomStringLength) )
		}
		return data
}

function benchmark_write(ns:NS, iteration:string = "0") {
	const data = getRandomData()
	const fileName = `testing/test_data_${iteration}.txt`

	const startedAt = Date.now()
	ns.write(fileName, JSON.stringify(data), "w");
	const duration = Date.now() - startedAt
	
	return duration
}

function benchmark_read(ns:NS, iteration:string = "0") {
	const fileName = `testing/test_data_${iteration}.txt`

	const startedAt = Date.now()
	const data = ns.read(fileName)
	const duration = Date.now() - startedAt
	
	let length = data.length

	return duration
}


function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}