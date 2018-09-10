const chai = require("chai")
const expect = chai.expect
const mocha = require("mocha")
const { check, gen, property} = require('testcheck')

const crypto = require("../crypto")(true)

function testShift(msg,key){
  msg = msg.toUpperCase()
  key = BigInt(key)
  return msg == crypto.shift(crypto.shift(msg,key),-key)
}

function testShiftInvalidChar(alphaNum,string,key){
  key = BigInt(key)
  let text = alphaNum+string
  if(text.length==0||/^[a-zA-Z]+$/.test(text)){
    //This test case is invalid, skip
    return true
  }
  if(text.toUpperCase().length!=text.length){
    //Another invalid test case
    //For example
    // "ßC".toUpperCase()
    // => "SSC"
    return true
  }
  text = text.toUpperCase()
  try{
    const encrypted = crypto.shift(text,key)
    return false
  }catch(e){
    try{
      const decrypted = crypto.shift(text,-key)
      return false
    }catch(e){
      return true
    }
  }
}

function testIntEncode(msg){
  msg = msg.toUpperCase()
  const multiplier = 7//parseInt(Math.random().toString()[6])
  const encoded = crypto.intEncode(msg,true)

  for(let i = 0 ;i<encoded.length;i++){
    encoded[i] += BigInt(37 * multiplier)
  }
  return msg == crypto.intEncode(encoded,false).join("")
}

function testIntEncodeInvalidChar(alphaNum,string){
  let text = (alphaNum+string).trim()
  if(text.length==0||text.includes(" ")||text.includes(",")||/^[a-z0-9]+$/i.test(text)){
    //This test case is invalid, skip
    return true
  }
  if(text.toUpperCase().length!=text.length){
    //Another invalid test case
    //For example
    // "ßC".toUpperCase()
    // => "SSC"
    return true
  }
  text = text.toUpperCase()
  try{
    const encrypted = crypto.intEncode(text,true)
    return false
  }catch(e){
    try{
      const array = text.split(",")
      for(const part of array){
        if(!isNaN(parseInt(part))){
          //Another invalid test case
          return true
        }
      }
      const decrypted = crypto.intEncode(array,false)
      return false
    }catch(e){
      return true
    }
  }
}

function testHillKeygen(keyLength){
  const key = crypto.hillKeygen(keyLength)
  const determinant = crypto.determinant(key)
  // if(determinant!==1){
  //   console.log(key)
  //   process.exit(1)
  // }
  return determinant === BigInt(1)
}
function testHillCipherUnevenText(key){
  return text=>{
    text = text.toUpperCase()
    if(!(text.length%2)){
      text+="A"
    }
    try{
      const encrypted = crypto.hillCipherEncrypt(text,key,true)
      return false
    }catch(e){
      try{
        const decrypted = crypto.hillCipherDecrypt(text,key,true)
        return false
      }catch(e){
        return true
      }
    }
  }
}
function testHillCipher(text,keyLength){
  text = text.toUpperCase()
  if(text.length%2){
    text+="A"
  }
  const key = crypto.hillKeygen(keyLength)
  const determinant = crypto.determinant(key)
  if(determinant!==BigInt(1)){
    throw new Error("determinant is not 1")
  }
  const encrypted = crypto.hillCipherEncrypt(text,key,true)
  const decrypted = crypto.hillCipherDecrypt(encrypted,key,true)
  if(decrypted!=text){
    console.log(key,encrypted,decrypted,text)
  }
  return text == decrypted
}

describe("Crypto without BigInt",function(){
  this.timeout(3500)
  it("Should have BigInt disabled",()=>{
    expect(BigInt.toString()).to.include("string")
  })
  it("Should be able to use the shift cipher",function(){
    const result = check(property(
      gen.substring("ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(100)),
      gen.int,
      testShift),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })
  it("Should be able to detect and reject invalid characters in shift cipher",function(){
    const result = check(property(
      gen.alphaNumString,
      gen.string,
      gen.int,
      testShiftInvalidChar),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })

  it("Should be able to use the integer encoding/decoding",function(){
    const result = check(property(
      gen.alphaNumString,
      testIntEncode),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })

  it("Should be able to detect and reject invalid characters in integer encoding",function(){
    const result = check(property(
      gen.alphaNumString,
      gen.string,
      testIntEncodeInvalidChar),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })

  it("Should be able to generate keys for the hill cipher",function(){
    this.timeout(4000)
    const result = check(property(
      gen.intWithin(1,4),
      testHillKeygen),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })
  
  it("Should be able to encrypt and decrypt using hill cipher",function(){
    this.timeout(5000)
    const result = check(property(
      gen.alphaNumString,
      gen.intWithin(1,4),
      testHillCipher),
      { numTests: 500 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })

  it("Should be able to detect and reject errors in hill cipher input",function(){
    this.timeout(5000)
    const key = crypto.hillKeygen(5)
    const result = check(property(
      gen.alphaNumString,
      testHillCipherUnevenText(key)),
      { numTests: 500 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
    const badFn = ()=>{
      const key = crypto.hillKeygen(5)
      key[0][0] = key[0][0]+BigInt(100)
      return crypto.hillCipherDecrypt("hi",key,true)
    }
    expect(badFn).to.throw()
  })
  it("Should be able to log steps in hill cipher encryption and decryption",function(){
    this.timeout(5000)
    const key = crypto.hillKeygen(5)
    const message = "The hill cipher implementation works"
    const encrypted = crypto.hillCipherEncrypt(message,key)
    const decrypted = crypto.hillCipherDecrypt(encrypted,key)
    expect(decrypted).to.equal(message.toUpperCase())
  })
})