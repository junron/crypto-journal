let calculating = false
onmessage = function(e){
  const numDigits = e.data
  const lower = parseInt("1"+"0".repeat(numDigits-1))
  const upper = parseInt("9".repeat(numDigits))
  while(true){
    const a = Math.floor(Math.random() * upper) + lower 
    const b = Math.floor(Math.random() * upper) + lower 
    const random1 = a * b
    console.log("Trying",a,"*",b,"=",random1)
    const random2 = random1-1
    let sqrt = Math.round(random2**0.5)
    let factor1 = false
    let factor2 = false
    while(sqrt>=10){
      if(random2%sqrt==0){
        factor1 = sqrt
        factor2 = random2/sqrt
        break
      }
    sqrt--
    }
    if(factor1){
      return postMessage([[a,factor1],[factor2,b]])
    }
    console.log("Failed. No factor above 10")
  }
  calculating = false
}
