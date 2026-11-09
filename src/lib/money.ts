/**
 * 金额工具。
 * 所有金额在程序内部都以「分」为单位的整数保存，避免浮点误差；只在输入和显示时与「元」互转。
 */

/** 把用户输入的金额（元，最多两位小数）解析成分；格式不对或超出安全整数范围时返回 null。 */
export function parseAmount(input: string): number | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input.trim())
  if (!match) return null
  // 按「元」和「角分」两段拼成整数，不经过浮点乘法（0.29 * 100 会得到 28.999999999999996）。
  const yuan = Number(match[1])
  const fen = Number((match[2] ?? '').padEnd(2, '0'))
  const cents = yuan * 100 + fen
  if (!Number.isSafeInteger(cents)) return null
  return cents
}

/** 把分格式化成带千分位的人民币字符串，例如 123456 -> "¥1,234.56"。 */
export function formatMoney(cents: number): string {
  const value = Number.isSafeInteger(cents) ? cents : 0
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  // 分成「元」「分」两段拼字符串，不用 abs / 100 取整（1e21 这类数会被格式化成指数形式）。
  const digits = String(abs).padStart(3, '0')
  const yuan = digits
    .slice(0, -2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const fen = digits.slice(-2)
  return `${sign}¥${yuan}.${fen}`
}
