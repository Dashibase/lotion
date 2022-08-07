export const REGULAR = [
  { str: 'aaaaaB aaaaaa', idx: 6, tags: [] },
  { str: 'aaaaa aBaaaaa', idx: 8, tags: [] },
  { str: 'aaaaa aaaaaBa', idx: 12, tags: [] },
]

export const BOLD = [
  { str: '<strong>aaaaaB</strong> aaaaaa', idx: 6, tags: ['strong'] },
  { str: 'aaa<strong>aa aB</strong>aaaaa', idx: 8, tags: ['strong'] },
  { str: '<strong>a</strong>aaaa aaaaaBa', idx: 12, tags: [] },
]

export const ITALIC = [
  { str: '<em>aaaaaB</em> aaaaaa', idx: 6, tags: ['em'] },
  { str: 'aaa<em>aa aB</em>aaaaa', idx: 8, tags: ['em'] },
  { str: '<em>a</em>aaaa aaaaaBa', idx: 12, tags: [] },
]

export const BOLD_ITALIC = [
  { str: '<strong>a<em>a</em>aaaB</strong> aaaaaa', idx: 6, tags: ['strong'] },
  { str: '<strong>a<em>aaaaB</em></strong> aaaaaa', idx: 6, tags: ['strong', 'em'] },
  { str: 'aaaaa <em>a</em><strong><em>Baa</em></strong><em>aa</em>a', idx: 8, tags: ['strong', 'em'] },
  { str: '<strong>aaa</strong>aa <em>a</em><strong><em>Baa</em></strong><em>aa</em>a', idx: 8, tags: ['strong', 'em'] },
  { str: '<strong>aaa<em>aa</em></strong> aaaaaBa', idx: 12, tags: [] },
  { str: 'a<em>aaaa</em> aaa<strong><em>aaB</em>a</strong>', idx: 12, tags: ['strong', 'em'] },
]
