"""Sonificazione 'perturbante' delle sottomissioni a ICSE, FSE, ASE (2006-2025).

Stessa logica della pagina "Sottomissioni in Suono" (lab.html).

Uso:
    python3 sonify.py                             # impostazioni predefinite -> sottomissioni-accordo.wav
    python3 sonify.py impostazioni.json           # impostazioni esportate dal tool
    python3 sonify.py impostazioni.json --tutte   # accordo + ICSE + FSE + ASE, un file ciascuno

Idea: il suono non dice "quanti", dice "qualcosa non va".
Per ogni conferenza si misura quanto le sottomissioni di un anno si allontanano
dalla norma storica (mediana 2006-2015). Questa "stranezza" (0..1) non alza
volume ne' altezza: deforma la nota.
  stonatura      la nota scivola fuori intonazione (cent)
  tremolio       l'intonazione oscilla in modo irregolare
  armonici       gli armonici si stirano oltre i multipli esatti (campana storta)
  brillantezza   gli armonici alti diventano piu' forti
  ripiegamento   l'onda si ripiega su se stessa (wavefolding)
Ogni nota ha accanto una "voce fantasma": la stessa nota pura e immobile.
Un beat secco segna l'inizio di ogni anno, con accento ogni 5 anni.
"""
import json
import sys
from copy import deepcopy
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d

YEARS = np.arange(2006, 2026)
BASE_END = 2015
# Fonti: emeryberger/csconferences (CSV) e taoxie.cs.illinois.edu/seconferences.htm (FSE 2006-2010)
DATA = {
    "ICSE": [395, 334, 371, 405, 380, 441, 408, 461, 496, 452,
             530, 415, 502, 529, 617, 615, 691, 780, 1049, 1150],
    "FSE":  [125, 251, 152, 217, 169, 203, 201, 251, 273, 291,
             266, 295, 295, 303, 360, 407, 449, 465, 474, 515],
    "ASE":  [121, 312, 280, 220, 190, 252, 138, 254, 276, 289,
             284, 367, 386, 448, 395, 440, 531, 633, 587, 1181],
}
# FSE su 165 Hz: quinta giusta (3:2) con ICSE, cosi' all'inizio non ci sono battimenti
CHORD = [("ICSE", 110.00, -0.7, -1), ("FSE", 165.00, 0.0, +1), ("ASE", 220.00, 0.7, +1)]

DEFAULTS = {
    "sr": 44100, "mode": "chord", "source": "data", "secPerYear": 1.0,
    "beat": 0.5, "beatAccent": True,
    "threshold": 1.25, "saturate": 1.4, "gamma": 1.3,
    "ghost": 0.35, "baseFreq": 220, "partials": 28,
    "satMode": "own",   # "own": negli audio singoli la stranezza vale 1 nell'anno di picco
    "breath": False,    # oscillazione lenta di volume, non legata ai dati
    "fx": {
        "detune": {"on": True, "amt": 90},    # cent
        "jitter": {"on": True, "amt": 20},    # cent
        "inharm": {"on": True, "amt": 2.5},   # B x 1000
        "bright": {"on": True, "amt": 1.2},
        "fold":   {"on": True, "amt": 5},
    },
}


def smooth(a, sigma):
    """Approssima un filtro gaussiano con tre medie mobili (veloce anche con sigma grandi)."""
    if sigma < 1:
        return a
    size = max(1, int(round(np.sqrt(4 * sigma * sigma + 1))))
    size += 1 - size % 2
    for _ in range(3):
        a = uniform_filter1d(a, size, mode="nearest")
    return a


def anomaly(values, p):
    v = np.asarray(values, float)
    norm = np.median(v[YEARS <= BASE_END])
    sat = p["saturate"]
    if p.get("satMode") == "own" and p["mode"] != "chord":
        sat = max(0.05, v.max() / norm - p["threshold"])
    return np.clip((v / norm - p["threshold"]) / sat, 0, 1)


def render(p):
    sr, spy, ny = p["sr"], p["secPerYear"], len(YEARS)
    n = int(round(ny * spy * sr))
    i = np.arange(n)
    t = i / sr
    rng = np.random.default_rng(7)
    fx = p["fx"]
    det = fx["detune"]["amt"] if fx["detune"]["on"] else 0
    jit = fx["jitter"]["amt"] if fx["jitter"]["on"] else 0
    B = fx["inharm"]["amt"] / 1000 if fx["inharm"]["on"] else 0
    br = fx["bright"]["amt"] if fx["bright"]["on"] else 0
    fold = fx["fold"]["amt"] if fx["fold"]["on"] else 0
    voices = CHORD if p["mode"] == "chord" else [(p["mode"], float(p["baseFreq"]), 0.0, +1)]

    L = np.zeros(n)
    R = np.zeros(n)
    fade = np.minimum(1, i / (0.4 * sr))
    for name, f0, pan, sign in voices:
        if p["source"] == "ramp":
            s = i / (n - 1)
        else:
            an = anomaly(DATA[name], p)
            s = np.interp(t / spy, np.arange(ny) + 0.5, an)
            s = np.clip(smooth(s, 0.25 * spy * sr), 0, None) ** p["gamma"]

        cents = sign * det * s
        if jit > 0:
            j = smooth(rng.standard_normal(n), 0.03 * sr)
            cents = cents + jit * s * j / np.abs(j).max()
        f = f0 * 2 ** (cents / 1200)

        x = np.zeros(n)
        for k in range(1, p["partials"] + 1):
            fk = k * f * np.sqrt(1 + B * s * k * k)
            amp = np.where(fk < 0.45 * sr, k ** (-2.2 + br * s), 0.0)
            x += amp * np.sin(2 * np.pi * (np.cumsum(fk) / sr + rng.uniform()))
        x /= np.abs(x).max()
        if fold > 0:
            x = (1 - s) * x + s * np.sin(np.pi / 2 * (1 + fold * s) * x)
        if p.get("breath"):
            x *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t + f0) ** 2

        if p["ghost"] > 0:   # la stessa nota, pura e immobile
            g = sum(k ** -2.2 * np.sin(2 * np.pi * k * f0 * t) for k in range(1, p["partials"] + 1))
            x += p["ghost"] * g / np.abs(g).max()
        x *= fade
        L += x * np.sqrt((1 - pan) / 2)
        R += x * np.sqrt((1 + pan) / 2)

    out = np.stack([L, R], 1)
    out *= 0.85 / np.abs(out).max()

    if p["beat"] > 0:   # un colpo all'inizio di ogni anno
        tt = np.arange(int(0.3 * sr)) / sr
        click = 0.7 * np.sin(2 * np.pi * 1250 * tt) * np.exp(-tt / 0.010) \
              + 0.35 * np.sin(2 * np.pi * 2780 * tt) * np.exp(-tt / 0.006)
        thump = 0.9 * np.sin(2 * np.pi * 62 * tt) * np.exp(-tt / 0.09)
        for y, year in enumerate(YEARS):
            accent = p["beatAccent"] and year % 5 == 0
            st = int(round(y * spy * sr))
            v = p["beat"] * ((click + thump) * 0.9 if accent else click * 0.5)
            m = min(len(v), n - st)
            out[st:st + m] += v[:m, None]
        peak = np.abs(out).max()
        if peak > 0.98:
            out *= 0.98 / peak
    return out


def merge(base, over):
    for k, v in over.items():
        if isinstance(v, dict) and isinstance(base.get(k), dict):
            merge(base[k], v)
        else:
            base[k] = v
    return base


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    p = deepcopy(DEFAULTS)
    stem = "sottomissioni"
    if args:
        merge(p, json.loads(Path(args[0]).read_text()))
        stem = Path(args[0]).stem
    modes = ["chord", "ICSE", "FSE", "ASE"] if "--tutte" in sys.argv else [p["mode"]]
    for mode in modes:
        q = deepcopy(p)
        q["mode"] = mode
        out = render(q)
        label = "accordo" if mode == "chord" else mode
        name = f"{stem}-{label}.wav"
        wavfile.write(name, q["sr"], (out * 32767).astype(np.int16))
        print(f"scritto {name} ({len(out) / q['sr']:.1f} s)")


if __name__ == "__main__":
    main()
