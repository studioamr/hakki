#!/usr/local/bin/python3
"""Build the night world (ONI) from the day pages: oni/<page>.html = <page>.html with the
world flag, ../ paths and the demon copy. Rerun after editing any root page."""
import os, re
R = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(R, "oni"), exist_ok=True)

COMMON = [
    ('<html lang="en">', '<html lang="en" data-world="oni">'),
    ('<title>RONIN · No Master', '<title>ONI · Seven Sins'), ('content="RONIN · No Master"', 'content="ONI · Seven Sins"'), ('<title>RONIN', '<title>ONI'), ('content="RONIN', 'content="ONI'),
    ('RONIN: a collection of ronin artworks', 'ONI: seven demons, one for each deadly sin,'),
    ('A collection of ronin on Solana.', 'Seven demons on Solana, the rivals of RONIN.'),
    ('studioamr.github.io/hakki/"', 'studioamr.github.io/hakki/oni/"'),
    ('content="#f2f0eb"', 'content="#07070d"'), ('hakki/og.jpg', 'hakki/og-oni.jpg'),
    ('href="favicon.svg"', 'href="../favicon.svg"'),
    ('href="styles.css', 'href="../styles.css'), ('src="config.js', 'src="../config.js'), ('src="app.js', 'src="../app.js'),
    ('src="img/', 'src="../img/'), ('href="coin.html"', 'href="../coin.html"'),
    ('RONIN <span class="jp">道</span>', 'ONI <span class="jp">鬼</span>'),
    ('RONIN artworks are digital collectibles', 'ONI artworks are digital collectibles'),
    ('Draw your ronin.', 'Draw your demon.'),
    ('The deck spins, the path chooses.', 'The moon turns, a sin chooses you.'),
    ('Draw a ronin →', 'Draw a demon →'),
]
INDEX = [
    ('<div class="peace">PEACE</div>', '<div class="peace">SIN</div>'),
    ('<span>BE CONSISTENT</span><span>BE DISCIPLINED</span><span>BE OBSESSED</span>',
     '<span>SEVEN SINS</span><span>SEVEN DEMONS</span><span>ONE MOON</span>'),
    ('<div class="tag"><b>RONIN</b> <span class="jp">道</span><small>no master</small></div>',
     '<div class="tag"><b>ONI</b> <span class="jp">鬼</span><small>seven sins</small></div>'),
    ('Rather leave it to fate?', 'Rather let the moon decide?'),
    ('<div class="eyebrow jp">運試し · draw</div>', '<div class="eyebrow jp">月の籤 · draw</div>'),
    ('<h2>Draw your ronin.</h2>', '<h2>Draw your demon.</h2>'),
    ('One draw, one price. The deck spins, the path chooses, and one ronin walks out with you.',
     'One draw, one price. The moon turns, a sin chooses you, and one demon follows you home.'),
    ('<h2>Wear the path.</h2>', '<h2>Wear the sin.</h2>'),
    ("Spot a RONIN piece in the street: that's another ronin.", "Spot an ONI piece at night: that's another demon."),
    ('img/escenas/falls.webp" alt="A ronin meditating by a pond, facing a legendary waterfall"',
     'img/escenas/spec-gathering.webp" alt="The seven shadow specters gathered under the full moon"'),
    ('<div class="eyebrow jp">静寂 · stillness</div>', '<div class="eyebrow jp">百鬼夜行 · night parade</div>'),
    ('<h2>Sit with the path.</h2>', '<h2>Join the night parade.</h2>'),
    ("Before the mint opens, the ronin waits by the falls. Leave your email and we'll call you once, when it's time.",
     "Before the mint opens, the seven gather under the moon. Leave your email and we'll call you once, when it's time."),
]
for page in ["index.html", "cards.html", "draw.html", "profile.html"]:
    s = open(os.path.join(R, page), encoding="utf-8").read()
    for a, b in COMMON + (INDEX if page == "index.html" else []):
        s = s.replace(a, b)
    open(os.path.join(R, "oni", page), "w", encoding="utf-8").write(s)
    print("oni/" + page)
