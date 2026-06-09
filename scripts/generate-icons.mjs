#!/usr/bin/env node
// Generates PNG icons for the PWA manifest using only Node.js built-ins.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function u32be(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b }

function chunk(type, data) {
  const t = Buffer.from(type)
  return Buffer.concat([u32be(data.length), t, data, u32be(crc32(Buffer.concat([t, data])))])
}

function makePNG(size, bg, fg) {
  const [br, bg_, bb] = bg
  const [fr, fg_, fb] = fg
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // bit depth 8, RGB colour type

  const raw = Buffer.alloc(size * (1 + size * 3))
  const cx = size / 2, cy = size / 2, r = size * 0.38

  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const inCircle = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) < r
      const px = y * (1 + size * 3) + 1 + x * 3
      raw[px]     = inCircle ? fr : br
      raw[px + 1] = inCircle ? fg_ : bg_
      raw[px + 2] = inCircle ? fb : bb
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public', { recursive: true })

// Dark background (#0f1115) with green accent circle (#34d399)
const dark = [15, 17, 21]
const green = [52, 211, 153]

for (const size of [192, 512]) {
  writeFileSync(`public/pwa-${size}x${size}.png`, makePNG(size, dark, green))
  console.log(`✓ public/pwa-${size}x${size}.png`)
}
writeFileSync('public/apple-touch-icon.png', makePNG(180, dark, green))
console.log('✓ public/apple-touch-icon.png')
