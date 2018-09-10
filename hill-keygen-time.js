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
const {hillKeygen,determinant} = require("./crypto")(false)
const iter = 100
const keyLength = 5

console.time(`Hill keygen: ${iter} keys, length ${keyLength}`)
for(let i=0;i<iter;i++){
  const key = hillKeygen(keyLength)
  if(i==5){
    console.log(key)
  }
  if(determinant(key)!==BigInt(1)){
    console.log(key)
    throw new Error("Determinant is not 1")
  }
}
console.timeEnd(`Hill keygen: ${iter} keys, length ${keyLength}`)