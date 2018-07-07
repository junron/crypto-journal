const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0","1" ,"2","3","4","5","6","7","8","9"," "]    
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
  const result = multiplyMatrix(key,message)
  const flattenedResult = []
  for(let counter = 0;counter<result[0].length;counter++){
    flattenedResult.push(result[0][counter])
    flattenedResult.push(result[1][counter])
  }
  const decoded = intEncode(flattenedResult,false)
  return decoded.join("")
}
function hillCipherDecrypt(message,key){
  if(message.length%2){
    throw new Error("Message must be of even length")
  }
  message = messageToArray(message)
  const decryptKey = inverse(key)
  const result = multiplyMatrix(decryptKey,message)
  const flattenedResult = []
  for(let counter = 0;counter<result[0].length;counter++){
    flattenedResult.push(result[0][counter])
    flattenedResult.push(result[1][counter])
  }
  const decoded = intEncode(flattenedResult,false)
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
  for(const character of message){
    let newCharCode = character.charCodeAt()+num
    if(newCharCode>=90){
      newCharCode = 64 + (newCharCode-90)%26
    }
    if(newCharCode<65){
      newCharCode = 65 + (newCharCode+65)%26
    }
    newString+=String.fromCharCode(newCharCode)
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