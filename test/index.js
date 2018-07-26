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
})