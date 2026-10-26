"""Bangun extra.generated.json (chat 'mia' + 'prev') langsung dari Temaram.xlsx.
Pakai:  python build_extra.py Temaram.xlsx src/story/extra.generated.json
"""
import json, sys, openpyxl

SRC = sys.argv[1] if len(sys.argv) > 1 else 'Temaram.xlsx'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'extra.generated.json'
wb = openpyxl.load_workbook(SRC)

def hhmm(t):
    return t.strftime('%H:%M') if hasattr(t, 'strftime') else str(t or '')

def read(sheet, prefix, keep_date=False):
    msgs, date = [], None
    for r in wb[sheet].iter_rows(min_row=2, values_only=True):
        if not r[0] or not r[2]:
            continue
        if keep_date and r[5]:
            date = str(r[5]).strip()          # label hari ada di kolom F, dipakai untuk semua pesan hari itu
        text = str(r[2]).strip()
        m = {'id': f'{prefix}-{r[0]}', 'sender': r[1], 'text': text,
             'time': hhmm(r[3]), 'isSelf': r[1] == 'Asahi'}
        if date: m['dateLabel'] = date        # dateLabel = pesan lama, langsung tampil tanpa animasi
        if text.lower() == 'link berita': m['kind'] = 'link'
        msgs.append(m)
    return msgs

data = {
  'chats': [{'id': 'mia', 'title': 'Mia (sepupu)', 'isGroup': False},
            {'id': 'prev', 'title': 'Ujang Kedu💙', 'isGroup': True}],
  'chunks': [{'id': 'mia-1', 'chatId': 'mia', 'messages': read('Mia', 'mia')},
             {'id': 'prev-1', 'chatId': 'prev', 'messages': read('GRUP Ujang Kedu (2025)', 'prev', True)}],
}
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print({c['id']: len(c['messages']) for c in data['chunks']})
