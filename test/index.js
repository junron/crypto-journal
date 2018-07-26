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
  const findDeterminant = matrix => (matrix[0][0] * matrix[1][1]) - (matrix[0][1]*matrix[1][0])
  const key = crypto.hillKeygen(keyLength)
  const determinant = findDeterminant(key)
  return determinant === 1
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
})