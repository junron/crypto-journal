const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0","1" ,"2","3","4","5","6","7","8","9"," "]    

const node = (typeof module != "undefined" && typeof module.exports != undefined)

function deflatten(array){
  return [[array[0],array[1]],[array[2],array[3]]]
}
function messageToArray(message){
  const result = [[],[]]
  let counter = 1
  for(const char of message){
    const charCode = intEncode(char,true)[0]
    if(counter%2){
      result[0].push(charCode)
    }else{
      result[1].push(charCode)
    }
    counter+=1
  }
  return result
}
function multiplyMatrix(key,message){
  const result = [[],[]]
  for(let pairNum = 0; pairNum<message[0].length;pairNum++){
    const pair = [message[0][pairNum],message[1][pairNum]]
    let keyPairNum = 0
    for(const keyPair of key){
      const sum = keyPair[0] * pair[0] + keyPair[1] * pair[1]
      result[keyPairNum][pairNum] = sum % 37
      keyPairNum += 1
    }
  }
  return result
}
function hillCipherEncrypt(message,key){
  if(message.length%2){
    throw new Error("Message must be of even length")
  }
  message = messageToArray(message)
  console.log("Int message",message)
  console.log("Multiplying",key,"and",message)
  const result = multiplyMatrix(key,message)
  console.log("result:",result)
  const flattenedResult = []
  for(let counter = 0;counter<result[0].length;counter++){
    flattenedResult.push(result[0][counter])
    flattenedResult.push(result[1][counter])
  }
  const decoded = intEncode(flattenedResult,false)
  console.log("Decode back to characters",decoded)
  return decoded.join("")
}
function hillCipherDecrypt(message,key){
  if(message.length%2){
    throw new Error("Message must be of even length")
  }
  message = messageToArray(message)
  const decryptKey = inverse(key)
  console.log("Int message",message)
  console.log("inverse of key",decryptKey)
  console.log("Multiplying",decryptKey,"and",message)
  const result = multiplyMatrix(decryptKey,message)
  console.log("result:",result)
  const flattenedResult = []
  for(let counter = 0;counter<result[0].length;counter++){
    flattenedResult.push(result[0][counter])
    flattenedResult.push(result[1][counter])
  }
  const decoded = intEncode(flattenedResult,false)
  console.log("Decode back to characters",decoded)
  return decoded.join("")
}
const determinant = matrix => (matrix[0][0] * matrix[1][1]) - (matrix[0][1]*matrix[1][0])
function inverse(matrix){
  if(determinant(matrix)!=1){
    throw new Error("Determinant must be equal to 1")
  }
  [matrix[0][0],matrix[1][1]] = [matrix[1][1],matrix[0][0]]
  matrix[0][1]= -matrix[0][1]
  matrix[1][0]= -matrix[1][0]
  return matrix
}
function shift(message,num){
  message = message.toUpperCase()
  let newString = ""
  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  for(const character of message){
    const pos = alphabet.indexOf(character)
    if(pos<0){
      throw new Error("Invalid character")
    }
    let newCharCode = (alphabet.indexOf(character)+num)%26
    if(newCharCode<0){
      newCharCode = 26 + newCharCode
    }
   //console.log(newCharCode)
    newString += alphabet[newCharCode]
  }
  return newString
}
function intEncode(message,encode){
  const result = []
  if(encode){
    message = message.toUpperCase()
    for(const char of message){
      if(alphabets.includes(char)){
        result.push(alphabets.indexOf(char))
      }else{
        throw new Error("Invalid character")
      }
    }
  }else{
    for(let integer of message){
      integer = parseInt(integer)
      if(isNaN(integer)){
        throw new Error("Invalid character")
      }
      if(integer>=37){
        integer = integer % 37
      }else if(integer<0){
        integer = integer % 37 + 37
      }
      let thisAlphabet = alphabets[integer]
      result.push(alphabets[integer])
    }
  }
  return result
}

const hillKeygen = numDigits => {
  const lower = parseInt("1"+"0".repeat(numDigits-1))
  const upper = parseInt("9".repeat(numDigits))
  while(true){
    const a = Math.floor(Math.random() * upper) + lower 
    const b = Math.floor(Math.random() * upper) + lower 
    const random1 = a * b
    //console.log("Trying",a,"*",b,"=",random1)
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
      return [[a,factor1],[factor2,b]]
    }
    //console.log("Failed. No factor above 10")
  }
}

if (node){
  module.exports = Object.freeze({
    intEncode,
    shift,
    hillCipherDecrypt,
    hillCipherEncrypt,
    hillKeygen
  })
}