const expect = require('expect')

let createTableDataSpy, getNextNumberSpy, getMultiplesSpy, displayTableSpy, generatePrimesSpy

describe('createTableData', () => {
  it('should create a table cell element and set its textContent', () => {
    createTableDataSpy = expect.createSpy().andCall(function (text) {
      let td = document.createElement("td")
      td.textContent = text
      return td
    })
  
    let res = createTableDataSpy('3')
    expect(res.textContent).toBe('3')
  })
})

describe('getNextNumber', () => {
  getNextNumberSpy = expect.createSpy().andCall(function (num) {
    let nextNum = num + 2
    let oddMultiples = [9, 15, 21]
    if (!oddMultiples.includes(nextNum)) {
      return nextNum
    }
    return getNextNumberSpy(nextNum)
  })
  
  it('should not return a number in oddMultiples array', () => {
    let res = getNextNumberSpy(7)
    expect(res).toNotBe(9).toBe(11).toBeA('number')
  })
  
  it('should return a number not in oddMultiples array', () => {
    let resTwo = getNextNumberSpy(11)
    expect(resTwo).toBe(13).toBeA('number')
  })
})

describe('getMultiples', () => {
  let multiples = [{ firstFactor: 2, secondFactor: 2, value: 4 }]
  let oddMultiples = []

  getMultiplesSpy = expect.createSpy().andCall(function (primes) {
    let secondFactor = primes[primes.length - 1]

    primes.forEach(prime => {
      let multiple = prime * secondFactor
      multiples = [ ...multiples, { firstFactor: prime, secondFactor, value: multiple } ]
      if (multiple % 2 !== 0) {
        oddMultiples = [...oddMultiples, multiple]
      }
    })
  })
  
  it('should add the multiple object to multiples array', () => {
    getMultiplesSpy([2, 3])
    expect(multiples).toInclude({ firstFactor: 2, secondFactor: 3, value: 6 })
    expect(multiples).toInclude({ firstFactor: 3, secondFactor: 3, value: 9 })
    expect(multiples.length).toBe(3)
  })
  
  it('should add odd multiples to oddMultiples array', () => {
    getMultiplesSpy([2, 3, 5])
    expect(oddMultiples).toInclude(9)
    expect(oddMultiples).toInclude(15)
    expect(oddMultiples).toInclude(25)
    expect(oddMultiples.length).toBe(3)
  })
})

describe('displayTable', () => {
  let multiples = [
    { firstFactor: 2, secondFactor: 2, value: 4 },
    { firstFactor: 2, secondFactor: 3, value: 6 },
    { firstFactor: 3, secondFactor: 3, value: 9 }
  ]

  displayTableSpy = expect.createSpy().andCall(function (primes, multiples) {
    let table = document.createElement("table")
    let firstRow = table.insertRow()
    firstRow.append(createTableDataSpy(''))
    primes.forEach(prime => {
      firstRow.append(createTableDataSpy(prime))
    })

    primes.forEach(prime => {
      let primeMultiples = multiples.filter(obj => obj['firstFactor'] === prime || obj['secondFactor'] === prime)
      let data = table.insertRow()
      data.append(createTableDataSpy(prime))
      primeMultiples.forEach(multiple => {
        data.append(createTableDataSpy(multiple.value))
      })
    })
    return table
  })
  
  it('should create a table and table cells with prime numbers and multiples as values', () => {
    let res = displayTableSpy([2, 3], multiples)
    expect(createTableDataSpy).toHaveBeenCalledWith('')
    expect(createTableDataSpy).toHaveBeenCalledWith(2)
    expect(createTableDataSpy).toHaveBeenCalledWith(3)
    expect(createTableDataSpy).toHaveBeenCalledWith(4)
    expect(createTableDataSpy).toHaveBeenCalledWith(6)
    expect(createTableDataSpy).toHaveBeenCalledWith(9)
    expect(res.innerHTML).toBe('<tbody><tr><td></td><td>2</td><td>3</td></tr><tr><td>2</td><td>4</td><td>6</td></tr><tr><td>3</td><td>6</td><td>9</td></tr></tbody>')
  })
})

describe('generatePrimes', () => {
  generatePrimesSpy = expect.createSpy().andCall(function (val) {
    let primes = [2]
    let multiples = [{ firstFactor: 2, secondFactor: 2, value: 4 }]

    if (val === 1) {
      displayTableSpy(primes, multiples)
      return primes
    }

    let n = 3
    while (primes.length < val) {
      primes.push(n)
      getMultiplesSpy(primes)
      n = getNextNumberSpy(n)
    }
    displayTableSpy(primes, multiples)
    return primes
  })

  it('should create an array of prime numbers', () => {
    let res = generatePrimesSpy(4)
    expect(res.length).toBe(4)
    expect(res).toInclude(2)
    expect(res).toInclude(3)
    expect(res).toInclude(5)
    expect(res).toInclude(7)
    expect(res).toBeAn('array')
  })
})