import type { ChallengeState, DayRecord } from './types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS } from './types'
import { todayStr, getTodayRecord } from './storage'

// Obsidian PARA vault config — mirrors the workout app's convention.
// Change `folder` to '' to export bare .md files at the zip root.
const OBSIDIAN = {
  tags: ['area', 'Health', 'challenge', '75hard'],
  folder: 'PARA Folders/2.Area Folders/Health/75 Hard',
}

function dayNumber(state: ChallengeState, date: string): number {
  const idx = state.history.findIndex((r) => r.date === date)
  return idx === -1 ? 1 : idx + 1
}

function dayMarkdown(record: DayRecord, day: number): string {
  const d = new Date(record.date + 'T00:00')
  const pretty = d.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const tasksDone = Object.values(record.tasks).filter(Boolean).length

  const lines = [
    '---',
    'tags:',
    ...OBSIDIAN.tags.map((t) => `  - ${t}`),
    `date: ${record.date}`,
    `day: ${day}`,
    `completed: ${record.completed}`,
    `tasks_done: ${tasksDone}`,
    '---',
    `## ${pretty} — Day ${day}`,
    '',
    '| Task | Done |',
    '| --- | --- |',
  ]

  for (const key of TASK_ORDER) {
    const done = record.tasks[key]
    lines.push(`| ${TASK_ICONS[key]} ${TASK_LABELS[key]} | ${done ? '✓' : '✕'} |`)
  }

  lines.push('')
  return lines.join('\n')
}

export function exportToday(state: ChallengeState): void {
  const record = getTodayRecord(state)
  if (!record) { alert('Nothing logged today yet.'); return }
  const day = dayNumber(state, record.date)
  downloadText(`${record.date}.md`, dayMarkdown(record, day))
}

export function exportAll(state: ChallengeState): void {
  if (!state.history.length) { alert('No history to export yet.'); return }
  const enc = new TextEncoder()
  const dir = OBSIDIAN.folder ? OBSIDIAN.folder.replace(/\/$/, '') + '/' : ''
  const files = state.history.map((record) => ({
    name: `${dir}${record.date}.md`,
    data: enc.encode(dayMarkdown(record, dayNumber(state, record.date))),
  }))
  downloadBlob(`75hard-${todayStr()}.zip`, buildZip(files))
}

// ---------- Download helpers ----------

function downloadText(filename: string, text: string): void {
  downloadBlob(filename, new Blob([text], { type: 'text/markdown' }))
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ---------- Minimal ZIP writer (no compression) — same as workout app ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c >>> 0
  }
  return t
})()

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function buildZip(files: { name: string; data: Uint8Array<ArrayBuffer> }[]): Blob {
  const enc = new TextEncoder()
  const locals: BlobPart[] = []
  const central: BlobPart[] = []
  let offset = 0

  for (const f of files) {
    const nameBytes = enc.encode(f.name)
    const checksum = crc32(f.data)
    const size = f.data.length

    const lh = new Uint8Array(new ArrayBuffer(30 + nameBytes.length))
    const lv = new DataView(lh.buffer)
    lv.setUint32(0, 0x04034b50, true)
    lv.setUint16(4, 20, true)
    lv.setUint32(14, checksum, true)
    lv.setUint32(18, size, true)
    lv.setUint32(22, size, true)
    lv.setUint16(26, nameBytes.length, true)
    lh.set(nameBytes, 30)
    locals.push(lh, f.data)

    const ch = new Uint8Array(new ArrayBuffer(46 + nameBytes.length))
    const cv = new DataView(ch.buffer)
    cv.setUint32(0, 0x02014b50, true)
    cv.setUint16(4, 20, true)
    cv.setUint16(6, 20, true)
    cv.setUint32(16, checksum, true)
    cv.setUint32(20, size, true)
    cv.setUint32(24, size, true)
    cv.setUint16(28, nameBytes.length, true)
    cv.setUint32(42, offset, true)
    ch.set(nameBytes, 46)
    central.push(ch)

    offset += lh.length + f.data.length
  }

  const centralSize = (central as Uint8Array[]).reduce((s, c) => s + c.length, 0)
  const eocd = new Uint8Array(new ArrayBuffer(22))
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(8, files.length, true)
  ev.setUint16(10, files.length, true)
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, offset, true)

  return new Blob([...locals, ...central, eocd], { type: 'application/zip' })
}
