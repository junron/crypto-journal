if(typeof BigInt==="undefined"){
  console.log("BigInt not supported")
  BigInt = string=>{
    const n = Number(string)
    if(Number.isNaN(n)){
      throw new Error("Invalid number")
    }
    return n
  }
}
function getSquareRoot(n){
  x = n
  y = BigInt(1)
  while(x > y){
    x = (x+y)/BigInt(2)
    y = n/x
  }
  if(x*x>n){
    return x
  }
  return x + BigInt(1)
}
onmessage = function(e){
  const numDigits = e.data
  const lower = parseInt("1"+"0".repeat(numDigits-1))
  const upper = parseInt("9".repeat(numDigits))
  const minFactor = BigInt(Math.min("1"+"0".repeat(Math.max(numDigits-3,0))),10)
  console.log(minFactor)
  while(true){
    const a = BigInt(Math.floor(Math.random() * upper) + lower)
    const b = BigInt(Math.floor(Math.random() * upper) + lower)
    const random1 = a * b
    console.log("Trying",a,"*",b,"=",random1)
    const random2 = random1-BigInt(1)
    console.log(getSquareRoot(random2))
    let sqrt = getSquareRoot(random2)
    let factor1 = false
    let factor2 = false
    if(!(sqrt%BigInt(2))){
      sqrt--
    }
    console.log((sqrt-minFactor)/BigInt(2))
    while(sqrt>=minFactor){
      if(random2%sqrt==BigInt(0)){
        factor1 = sqrt
        factor2 = random2/sqrt
        break
      }
    sqrt-=BigInt(2)
    }
    if(factor1){
      return postMessage([[a,factor1],[factor2,b]])
    }
    console.log("Failed. No factor above "+minFactor)
  }
}
