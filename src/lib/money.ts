/**
 * 金额工具。
 * 所有金额在程序内部都以「分」为单位的整数保存，避免浮点误差；只在输入和显示时与「元」互转。
 */

/** 把用户输入的金额（元，最多两位小数）解析成分；格式不对时返回 null。 */
export function parseAmount(input: string): number | null {
  const text = input.trim()
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null
  return Math.round(Number(text) * 100)
}

/** 把分格式化成带千分位的人民币字符串，例如 123456 -> "¥1,234.56"。 */
export function formatMoney(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const yuan = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const fen = String(abs % 100).padStart(2, '0')
  return `${sign}¥${yuan}.${fen}`
}
