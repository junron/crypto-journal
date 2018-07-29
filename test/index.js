const chai = require("chai")
const expect = chai.expect
const mocha = require("mocha")
const { check, gen, property} = require('testcheck')

const crypto = require("../crypto")

function testShift(msg,key){
  msg = msg.toUpperCase()
  return msg == crypto.shift(crypto.shift(msg,key),-key)
}

function testIntEncode(msg){
  msg = msg.toUpperCase()
  return msg == crypto.intEncode(crypto.intEncode(msg,true),false).join("")
}

function testHillKeygen(keyLength){
  const key = crypto.hillKeygen(keyLength)
  const determinant = crypto.determinant(key)
  return determinant === 1
}
function testHillCipher(text,keyLength){
  text = text.toUpperCase()
  if(text.length%2){
    text+="A"
  }
  const key = crypto.hillKeygen(keyLength)
  const determinant = crypto.determinant(key)
  if(determinant!==1){
    throw new Error("determinant is not 1")
  }
  const encrypted = crypto.hillCipherEncrypt(text,key,false)
  const decrypted = crypto.hillCipherDecrypt(encrypted,key,false)
  if(decrypted!=text){
    console.log(key,encrypted,decrypted,text)
  }
  return text == decrypted
}

describe("Crypto",function(){
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

  it("Should be able to generate keys for the hill cipher",function(){
    this.timeout(3000)
    const result = check(property(
      gen.intWithin(2,6),
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
      gen.intWithin(2,6),
      testHillCipher),
      { numTests: 1000 }
    )
    if(!result.result){
      console.log(result)
    }
    expect(result.result).to.be.true
  })
})