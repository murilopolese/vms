let dataArray = []
let pixels = 16*16
let rules = 8*16*18

for (let i = 0; i < pixels; i++) {
  dataArray.push(parseInt(Math.random()*16))
}
for (let i = 0; i < rules; i++) {
  dataArray.push(parseInt(Math.random()*16))
}

let length = Math.ceil(dataArray.length/2)
let buff = Buffer.alloc(length)
buff.fill(0)

for (let i = 0; i < length; i++) {
  let n = dataArray[i*2]
  n = n << 4
  n |= dataArray[i*2+1]
  buff[i] = n
}

let encodedData = buff.toString('base64')

console.log('dataArray', dataArray)
console.log('dataArray length', dataArray.length)
console.log('buffer', buff)
console.log('encoded data', encodedData)

let decodedBuffer = Buffer.from(encodedData, 'base64')

console.log('decoded buffer', decodedBuffer)
let decodedArray = []
for (let i = 0; i < decodedBuffer.length; i++) {
  let n = decodedBuffer[i]
  let a = (n & 0xF0) >> 4
  let b = n & 0xF
  decodedArray.push(a)
  decodedArray.push(b)
}

console.log('decoded array', decodedArray)
