window.onload = init
let primes, multiples, oddMultiples
function init() {
  generatePrimes()
  let submitBtn = document.querySelector('#submitBtn');
  submitBtn.addEventListener('click', generatePrimes);
}

const getMultiples = primes => {
  let secondFactor = primes[primes.length - 1]
  primes.forEach(prime => {
    let multiple = prime * secondFactor
    multiples = [ ...multiples, { firstFactor: prime, secondFactor, value: multiple } ]
    if (multiple % 2 !== 0) {
      oddMultiples = [...oddMultiples, multiple]
    }
  })
}
                  
const getNextNumber = num => {
  let nextNum = num + 2
  if (!oddMultiples.includes(nextNum)) {
    return nextNum
  }
  return getNextNumber(nextNum)    
}

const createTableData = text => {
  let td = document.createElement("td")
  td.textContent = text
  return td
}

const displayTable = (primes, multiples) => {
  let container = document.querySelector('#multiplesTable')
  container.textContent = ''
  let table = document.createElement("table")
  let firstRow = table.insertRow()
  firstRow.append(createTableData(''))
  primes.forEach(prime => {
    firstRow.append(createTableData(prime))
  })
  
  primes.forEach(prime => {
    let primeMultiples = multiples.filter(obj => obj['firstFactor'] === prime || obj['secondFactor'] === prime)
    let data = table.insertRow()
    data.append(createTableData(prime))
    primeMultiples.forEach(multiple => {
      data.append(createTableData(multiple.value))
    })
  })
  container.append(table)
}

const generatePrimes = () => {
  let userInput = document.querySelector('#userInput')
  let val = userInput && parseInt(userInput.value) || 10
  // To store data for table's first row and column
  // 2 is the only even prime number
  primes = [2]
  // To store table data. Include values for initial prime number
  multiples = [{ firstFactor: 2, secondFactor: 2, value: 4 }]
  // To store all odd multiples of prime numbers
  // We don't need to check their primality
  oddMultiples = []
 
  if (val === 1) {
    displayTable(primes, multiples)
    return
  }
  // start from first odd number > 1
  let n = 3
  while (primes.length < val) {
    primes.push(n)
    getMultiples(primes)
    n = getNextNumber(n)
  }
  displayTable(primes, multiples)
}