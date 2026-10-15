# -*- coding: utf-8 -*-
# 爆破改枪码：按智能表格「爆破改枪码」实际行序输出，供整列复制粘贴
try:
    import openpyxl
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "openpyxl>=3.1.0"])
    import openpyxl

from openpyxl.styles import Font, PatternFill, Alignment, Side, Border

# 数据：按 级别（手枪→标准→精锐→特种）→ 槽位（1→4）升序，与文档1各流派块行序一致
DATA_001 = [  # 近身不开镜
    ("G17",                "手枪", 1, None),
    ("M1911",              "手枪", 2, "6L8IQCG0FTV7EL2SSC74G"),
    ("93R",                "手枪", 3, "6L8IRRS0FTV7EL2SSC74G"),
    ("沙漠之鹰",            "手枪", 4, "6L8ITMG0FTV7EL2SSC74G"),
    ("725双管霰弹枪",        "标准", 1, "6L8IU1K0FTV7EL2SSC74G"),
    ("M16A4突击步枪",       "标准", 2, "6L8IUOC0FTV7EL2SSC74G"),
    ("勇士冲锋枪",          "标准", 3, "6L8J04S0FTV7EL2SSC74G"),
    ("杠杆式步枪",          "标准", 4, "6L8J2TK0FTV7EL2SSC74G"),
    ("SR-3M紧凑突击步枪",   "精锐", 1, "6L8J3OO0FTV7EL2SSC74G"),
    ("MK4冲锋枪",           "精锐", 2, "6L8J4K40FTV7EL2SSC74G"),
    ("M249轻机枪",          "精锐", 3, "6L8J7B40FTV7EL2SSC74G"),
    ("R93狙击步枪",         "精锐", 4, "6L8J7N80FTV7EL2SSC74G"),
    ("MDR战斗步枪",         "特种", 1, "6L8J9300FTV7EL2SSC74G"),
    ("MP7冲锋枪",           "特种", 2, "6L8J9TG0FTV7EL2SSC74G"),
    ("MK47突击步枪",        "特种", 3, "6L8JALC0FTV7EL2SSC74G"),
    ("AWM狙击步枪",         "特种", 4, "6L8JB6O0FTV7EL2SSC74G"),
]
DATA_002 = [  # 近身爆发（文档1序号2块）
    ("G17",                "手枪", 1, None),
    ("93R",                "手枪", 2, "6L8IR6S0FTV7EL2SSC74G"),
    ("沙漠之鹰",            "手枪", 3, "6L8TTOG0FTV7EL2SSC74G"),
    ("G18",                "手枪", 4, "6L8UIIO0FTV7EL2SSC74G"),
    ("勇士冲锋枪",          "标准", 1, "6L8UAQ00FTV7EL2SSC74G"),
    ("S12K霰弹枪",          "标准", 2, "6L8UB300FTV7EL2SSC74G"),
    ("SMG-45冲锋枪",        "标准", 3, "6L8UBH00FTV7EL2SSC74G"),
    ("SG552突击步枪",       "标准", 4, "6L8UBV40FTV7EL2SSC74G"),
    ("MK4冲锋枪",           "精锐", 1, "6L8UCES0FTV7EL2SSC74G"),
    ("AKM突击步枪",         "精锐", 2, "6L8UCOC0FTV7EL2SSC74G"),
    ("AUG突击步枪",         "精锐", 3, "6L8UD600FTV7EL2SSC74G"),
    ("KC17突击步枪",        "精锐", 4, "6L8UDJO0FTV7EL2SSC74G"),
    ("MP7冲锋枪",           "特种", 1, "6L8UE4G0FTV7EL2SSC74G"),
    ("MK47突击步枪",        "特种", 2, "6L8UIPK0FTV7EL2SSC74G"),
    ("M7战斗步枪",          "特种", 3, "6L8UHKK0FTV7EL2SSC74G"),
    ("M14射手步枪",         "特种", 4, "6L8UIBO0FTV7EL2SSC74G"),
]
DATA_003 = [  # 全距离均衡（文档1序号3块）
    ("G17",                "手枪", 1, None),
    ("G18",                "手枪", 2, "6L8TU7O0FTV7EL2SSC74G"),
    ("93R",                "手枪", 3, "6L8IRRS0FTV7EL2SSC74G"),
    ("沙漠之鹰",            "手枪", 4, "6L8TUCK0FTV7EL2SSC74G"),
    ("SMG-45冲锋枪",        "标准", 1, "6L8U0O40FTV7EL2SSC74G"),
    ("勇士冲锋枪",          "标准", 2, "6L8U12S0FTV7EL2SSC74G"),
    ("SG552突击步枪",       "标准", 3, "6L8U1PS0FTV7EL2SSC74G"),
    ("SKS射手步枪",         "标准", 4, "6L8U27K0FTV7EL2SSC74G"),
    ("AKM突击步枪",         "精锐", 1, "6L8U2VK0FTV7EL2SSC74G"),
    ("M4A1突击步枪",        "精锐", 2, "6L8U4R00FTV7EL2SSC74G"),
    ("MK4冲锋枪",           "精锐", 3, "6L8UJ740FTV7EL2SSC74G"),
    ("SVD狙击步枪",         "精锐", 4, "6L8U6I40FTV7EL2SSC74G"),
    ("AS Val突击步枪",      "特种", 1, "6L8UJC00FTV7EL2SSC74G"),
    ("MK47突击步枪",        "特种", 2, "6L8U8RG0FTV7EL2SSC74G"),
    ("M14射手步枪",         "特种", 3, "6L8U9F00FTV7EL2SSC74G"),
    ("AWM狙击步枪",         "特种", 4, "6L8U9RG0FTV7EL2SSC74G"),
]
DATA_001B = [  # 近身不开镜（另一服务器，文档1第17~20行块，码后缀065L6TGRFFH34T）
    ("G17",                "手枪", 1, None),
    ("M1911",              "手枪", 2, "6LAK184065L6TGRFFH34T"),
    ("93R",                "手枪", 3, "6LAK23C065L6TGRFFH34T"),
    ("沙漠之鹰",            "手枪", 4, "6LAK27K065L6TGRFFH34T"),
    ("725双管霰弹枪",        "标准", 1, "6LAK3UK065L6TGRFFH34T"),
    ("SMG-45冲锋枪",        "标准", 2, "6LAKJAK065L6TGRFFH34T"),
    ("勇士冲锋枪",          "标准", 3, "6LAK4F4065L6TGRFFH34T"),
    ("杠杆式步枪",          "标准", 4, "6LAK4PG065L6TGRFFH34T"),
    ("SR-3M紧凑突击步枪",   "精锐", 1, "6LAK5TG065L6TGRFFH34T"),
    ("MK4冲锋枪",           "精锐", 2, "6LAKCKG065L6TGRFFH34T"),
    ("M249轻机枪",          "精锐", 3, "6LAKD7O065L6TGRFFH34T"),
    ("R93狙击步枪",         "精锐", 4, "6LAKDE4065L6TGRFFH34T"),
    ("M7战斗步枪",          "特种", 1, "6LAKETK065L6TGRFFH34T"),
    ("MP7冲锋枪",           "特种", 2, "6LAKDT0065L6TGRFFH34T"),
    ("MK47突击步枪",        "特种", 3, "6LAKEHO065L6TGRFFH34T"),
    ("AWM狙击步枪",         "特种", 4, "6LAKEO0065L6TGRFFH34T"),
]
SHEETS_GUNCODE = [
    ("001 近身不开镜", DATA_001),
    ("002 近身爆发", DATA_002),
    ("003 全距离均衡", DATA_003),
    ("001 近身不开镜（另一服）", DATA_001B),
]

# 多语言列：从枪械sheet导出的 /tmp/gun_i18n.json 按物品名称匹配
import json, os
LANGS = ["英语", "德语", "法语", "俄语", "日语", "韩语", "繁体中文",
         "西班牙语", "葡萄牙语", "土耳其语", "阿拉伯语", "越南语", "泰语", "印尼语"]
I18N = {}
_src = "/tmp/gun_i18n.json"
if os.path.exists(_src):
    _d = json.load(open(_src, encoding="utf-8"))
    for _r in _d["values"][0]["rows"]:
        if _r.get("物品名称"):
            I18N[_r["物品名称"]] = _r
# 印尼语单独查询结果合并
_src_id = "/tmp/gun_id.json"
if os.path.exists(_src_id):
    _d = json.load(open(_src_id, encoding="utf-8"))
    for _r in _d["values"][0]["rows"]:
        if _r.get("物品名称"):
            I18N.setdefault(_r["物品名称"], {})["印尼语"] = _r.get("印尼语")

def xl_color(css_hex: str) -> str:
    value = css_hex.removeprefix("#").upper()
    if len(value) != 6:
        raise ValueError(f"Expected #RRGGBB, got: {css_hex}")
    return "FF" + value

XL_HEADER_BG = xl_color("#00B050")   # 三角洲绿系表头
XL_BORDER = xl_color("#BFBFBF")
XL_ALT_BG = xl_color("#F2F8F4")      # 隔行浅绿底

thin_side = Side(style="thin", color=XL_BORDER)
thin_border = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)

wb = openpyxl.Workbook()
wb.remove(wb.active)

for sheet_title, DATA in SHEETS_GUNCODE:
    ws = wb.create_sheet(sheet_title)

    # 表头（第1行）：基础4列 + 14语言列
    headers = ["枪械名称（中文）", "级别", "槽位", "改枪码"] + LANGS
    for col, name in enumerate(headers, start=1):
        c = ws.cell(row=1, column=col, value=name)
        c.font = Font(bold=True, color="FFFFFF", size=11)
        c.fill = PatternFill("solid", fgColor=XL_HEADER_BG)
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = thin_border

    # 数据区（第2~17行），全部当文本写入
    for i, (gun, level, slot, code) in enumerate(DATA):
        r = 2 + i
        i18n = I18N.get(gun, {})
        row_vals = [gun, level, slot, code] + [i18n.get(l) for l in LANGS]
        for col, val in enumerate(row_vals, start=1):
            c = ws.cell(row=r, column=col, value=val)
            c.number_format = "@"
            if col in (2, 3):
                c.alignment = Alignment(horizontal="center", vertical="center")
            else:
                c.alignment = Alignment(horizontal="left", vertical="center")
            c.border = thin_border
            if i % 2 == 1:
                c.fill = PatternFill("solid", fgColor=XL_ALT_BG)

    ws.column_dimensions["A"].width = 22
    ws.column_dimensions["B"].width = 8
    ws.column_dimensions["C"].width = 8
    ws.column_dimensions["D"].width = 26
    for _c in "EFGHIJKLMNOPQR":
        ws.column_dimensions[_c].width = 24
    ws.freeze_panes = "A2"

# ============ Sheet2：爆破流派码翻译（模型翻译，14种语言） ============
SCHOOL_CN_NAME = "近身不开镜"
SCHOOL_CN_DESC = "主打一个腰射爽玩，纯腰射和腰射开镜双修武器搭配"
# 多流派：每个流派 = (流派ID, 中文名, 中文介绍, [(语言, 名称译文, 介绍译文), ...14种])
SCHOOL_001 = [
    ("英语", "Close-Range Hip-Fire",
     "All about hip-fire fun — a loadout mixing pure hip-fire weapons with hybrid hip-fire/ADS picks."),
    ("德语", "Nahkampf ohne Zielen",
     "Purer Hüftfeuer-Spaß — eine Kombination aus reinen Hüftfeuer-Waffen und Hybridwaffen für Hüftfeuer und Zielen."),
    ("法语", "Mêlée sans visée",
     "Le plaisir du tir au jugé — un arsenal mêlant armes en tir au jugé pur et hybrides tir au jugé/visée."),
    ("俄语", "Ближний бой без прицела",
     "Полное удовольствие от стрельбы от бедра — связка оружия для стрельбы от бедра и гибридных вариантов «от бедра + прицеливание»."),
    ("日语", "腰撃ち近接戦",
     "腰撃ちをとことん楽しむビルド。純粋な腰撃ち武器と、腰撃ちから覗き込みへ繋げる武器のコンビ。"),
    ("韩语", "근접 힙파이어",
     "힙파이어를 끝없이 즐기는 빌드. 순수 힙파이어 무기와 힙파이어→조준 겸용 무기의 조합."),
    ("繁体中文", "近身不開鏡",
     "主打一個腰射爽玩，純腰射和腰射開鏡雙修武器搭配。"),
    ("西班牙语", "Cuerpo a cuerpo sin mira",
     "Pura diversión disparando a la cadera: mezcla de armas de cadera pura y armas híbridas de cadera y mira."),
    ("葡萄牙语", "Curta distância sem mira",
     "Diversão pura no tiro do quadril: mistura de armas só de quadril e híbridas de quadril com mira."),
    ("土耳其语", "Yakın Mesafe Nişansız",
     "Tamamen kalçadan ateş eğlencesi — sadece kalçadan ateş eden silahlarla, kalçadan nişana geçen hibrit silahların kombinasyonu."),
    ("阿拉伯语", "قرب بدون تصويب",
     "متعة إطلاق النار من الخصر — مزيج من أسلحة الإطلاق من الخصر النقية وأسلحة هجينة تجمع بين الخصر والتصويب."),
    ("越南语", "Cận chiến không ngắm",
     "Chơi sướng với bắn hông — bộ vũ khí kết hợp giữa bắn hông thuần và kiểu bắn hông chuyển sang ngắm."),
    ("泰语", "ปะทะใกล้ไม่เล็ง",
     "สนุกกับการยิงไม่เล็ง — ชุดอาวุธผสมระหว่างปืนยิงไม่เล็งล้วนกับปืนที่ยิงไม่เล็งสลับเข้าเล็ง"),
    ("印尼语", "Jarak Dekat Tanpa Bidik",
     "Sensasi hip-fire tanpa henti — kombinasi senjata hip-fire murni dan senjata hibrida hip-fire ke bidik."),
]
SCHOOL_002 = [
    ("英语", "Close-Range Burst",
     "Hip-fire focused with close-quarters combat in mind — assault operators make breaching close-range fights remarkably effective."),
    ("德语", "Nahkampf-Durchbruch",
     "Insgesamt auf Hüftfeuer ausgelegt, mit Fokus auf Nahkampf — mit Sturm-Operatoren gelingt der Durchbruch im Nahbereich besonders effektiv."),
    ("法语", "Percée rapprochée",
     "Axé sur le tir au jugé et le combat rapproché — avec des opérateurs d'assaut, la percée à courte distance est redoutablement efficace."),
    ("俄语", "Прорыв в упор",
     "В основном стрельба от бедра с упором на ближний бой — со штурмовыми операторами прорыв на ближней дистанции особенно эффективен."),
    ("日语", "近接バースト",
     "腰撃ち中心の近距離戦ビルド。突撃オペレーターを使えば、最前線を一気に突破できる。"),
    ("韩语", "근접 폭발",
     "힙파이어 중심의 근접전 빌드. 돌격 오퍼레이터로 근접 지점을 효과적으로 돌파한다."),
    ("繁体中文", "近身爆發",
     "整體以腰射為主，主打近點作戰，利用突擊幹員，能非常有效地做到近點突破。"),
    ("西班牙语", "Estallido a corta distancia",
     "Centrado en el disparo a la cadera y el combate cercano — con operadores de asalto, el asalto a corta distancia es muy eficaz."),
    ("葡萄牙语", "Explosão a curta distância",
     "Focada no tiro do quadril e no combate próximo — com operadores de assalto, a quebra a curta distância é muito eficaz."),
    ("土耳其语", "Yakın Mesafe Patlaması",
     "Genelde kalçadan ateşe ve yakın çatışmaya odaklı — taarruz operatörleriyle yakın mesafede kırmak son derece etkili."),
    ("阿拉伯语", "اختراق قريب",
     "يعتمد أساسًا على إطلاق النار من الخصر والقتال القريب — مع مشغّلي الهجوم، يكون اختراق المسافات القريبة فعالاً للغاية."),
    ("越南语", "Bùng nổ cận chiến",
     "Chủ yếu bắn hông, đánh cự ly gần — cùng chiến binh tấn công có thể đột phá điểm gần cực kỳ hiệu quả."),
    ("泰语", "เบิร์สต์ระยะใกล้",
     "เน้นยิงไม่เล็งและบุกที่ระยะใกล้ — ใช้ออปเปอเรเตอร์สายบุกสามารถทะลวงจุดใกล้ได้อย่างมีประสิทธิภาพสูง"),
    ("印尼语", "Burst Jarak Dekat",
     "Bertumpu pada hip-fire dan pertempuran jarak dekat — dengan operator assault, menembus titik dekat jadi sangat efektif."),
]
SCHOOL_003 = [
    ("英语", "All-Range Balanced",
     "A complete loadout tailor-made for Black Tide Blast — easy for rookies, solid for veterans; one click and you're ready to rush."),
    ("德语", "Ausgewogen auf alle Distanzen",
     "Ein komplettes, maßgeschneidertes Loadout für den Schwarzflut-Sprengmodus — für Anfänger und Veteranen gleich gut; ein Klick und der Einsatz kann beginnen."),
    ("法语", "Équilibré toutes distances",
     "Un arsenal complet taillé pour le mode Explosion Marée Noire — accessible aux débutants, efficace pour les vétérans ; un clic et c'est parti."),
    ("俄语", "Баланс на всех дистанциях",
     "Полный комплект снаряжения, созданный специально для режима «Взрыв Чёрного прилива» — подойдёт и новичкам, и ветеранам: один клик — и в бой."),
    ("日语", "オールレンジバランス",
     "黒潮爆破モードのために作り込んだフル装備。初心者からベテランまで、ワンクリックで対局へ飛び出せる。"),
    ("韩语", "올레인지 밸런스",
     "흑조 폭파 모드를 위해 맞춘 풀 로드아웃. 초보자부터 베테랑까지, 원클릭으로 바로 돌격 가능."),
    ("繁体中文", "全距離均衡",
     "專為黑潮爆破模式量身打造的全套背包配置！新手老手都能用，爆破對局一鍵開衝。"),
    ("西班牙语", "Equilibrado a toda distancia",
     "Un arsenal completo hecho a medida para el modo Explosión Marea Negra — sirve para noveles y veteranos; un clic y a la carga."),
    ("葡萄牙语", "Equilibrado em todas as distâncias",
     "Um conjunto completo feito sob medida para o modo Explosão Maré Negra — serve para novatos e veteranos; um clique e partir para o ataque."),
    ("土耳其语", "Her Menzilde Dengeli",
     "Kara Dalga Patlama moduna özel hazırlanmış komple ekipman — yeni başlayanlar ve veteranlar için ideal; tek tıkla maça hazır."),
    ("阿拉伯语", "توازن على كل المدى",
     "عتاد كامل مصمم خصيصًا لوضع انفجار الموجة السوداء — يناسب المبتدئين والمحترفين؛ بنقرة واحدة تكون جاهزًا للهجوم."),
    ("越南语", "Cân bằng mọi cự ly",
     "Bộ trang bị hoàn chỉnh dành riêng cho chế độ Bùng nổ Thủy triều Đen — người mới lẫn lão làng đều dùng được, một cú click là xông lên."),
    ("泰语", "สมดุลทุกระยะ",
     "ชุดอุปกรณ์ครบเซ็ตที่ออกแบบมาเฉพาะสำหรับโหมดระเบิดกระแสดำ — มือใหม่มือโปรใช้ได้ คลิกเดียวก็พร้อมบุก"),
    ("印尼语", "Seimbang Semua Jarak",
     "Loadout lengkap yang dirancang khusus untuk mode Blast Tide Hitam — cocok untuk pemula maupun veteran; sekali klik, langsung siap tempur."),
]
SCHOOLS = [
    ("001", "近身不开镜", SCHOOL_CN_DESC, SCHOOL_001),
    ("002", "近身爆发", "整体以腰射为主，主打近点作战，利用突击干员，能非常有效的做到近点突破", SCHOOL_002),
    ("003", "全距离均衡", "专为黑潮爆破模式量身打造的全套背包配置！新手老手都能用，爆破对局一键开冲", SCHOOL_003),
]

ws2 = wb.create_sheet("流派翻译")

# 表头（第1行）：语言横向排列，A列为流派/字段
_langs = [l for l, _, _ in SCHOOL_001]
for col, name in enumerate(["流派 / 字段"] + _langs, start=1):
    c = ws2.cell(row=1, column=col, value=name)
    c.font = Font(bold=True, color="FFFFFF", size=11)
    c.fill = PatternFill("solid", fgColor=XL_HEADER_BG)
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = thin_border

# 每个流派两行：名称 + 一句话介绍
r = 2
for sid, cn_name, cn_desc, i18n in SCHOOLS:
    for label, values, is_desc in [
        (f"{sid} {cn_name}｜名称", [n for _, n, _ in i18n], False),
        (f"{sid} {cn_name}｜介绍", [d for _, _, d in i18n], True),
    ]:
        c = ws2.cell(row=r, column=1, value=label)
        c.font = Font(bold=True, size=11)
        c.alignment = Alignment(horizontal="left", vertical="center")
        c.border = thin_border
        for col, val in enumerate(values, start=2):
            c = ws2.cell(row=r, column=col, value=val)
            c.number_format = "@"
            c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=is_desc)
            c.border = thin_border
            if is_desc:
                c.fill = PatternFill("solid", fgColor=XL_ALT_BG)
        r += 1

# 中文原文参考（末尾，浅色，B列=名称、C列=介绍）
for sid, cn_name, cn_desc, _ in SCHOOLS:
    r += 1
    c = ws2.cell(row=r, column=1, value=f"{sid} 中文原文")
    c.font = Font(bold=True, size=11)
    c.alignment = Alignment(horizontal="left", vertical="center")
    ws2.cell(row=r, column=2, value=cn_name).font = Font(italic=True, color="808080")
    ws2.cell(row=r, column=3, value=cn_desc).font = Font(italic=True, color="808080")

ws2.column_dimensions["A"].width = 20
for i in range(2, 2 + len(_langs)):
    ws2.column_dimensions[openpyxl.utils.get_column_letter(i)].width = 34
ws2.freeze_panes = "B2"

wb.properties.title = "爆破改枪码"
wb.save("/Users/jimmmywang/Documents/DFoversea/outputs/爆破改枪码.xlsx")
print("saved")
