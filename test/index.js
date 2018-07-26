const chai = require("chai")
const expect = chai.expect
const mocha = require("mocha")
const { check, gen, property, sample } = require('testcheck')

const crypto = require("../crypto")

function testShift(msg,key){
  msg = msg.toUpperCase()
  return msg == crypto.shift(crypto.shift(msg,key),-key)
}

describe("Crypto",function(){
  it("Should be able to use the shift cipher",function(){
    console.log(sample(gen.substring("ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(100))))
    const result = check(property(
      gen.substring("ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(100)),
      gen.int,
      testShift),
      { numTests: 1000 }
    )
    console.log(result)
    expect(result.result).to.be.true()
  })
})