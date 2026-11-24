# Off Key

*An anatomy of strangeness in conference submissions.*

Off Key is a sonification of submissions to ICSE, FSE and ASE from 2006 to 2025. Each conference is a note. The further a year's submissions drift from the historical baseline (their median over a baseline period, 2006–2015 by default), the more the note warps out of tune, until the chord no longer sounds right.

It has two pages: **Anatomy of Strangeness**, a step-by-step tutorial on how the sound is built, and **Submissions in Sound**, the full tool.

## Files

| File | Contents |
|---|---|
| `tutorial.html` | "Anatomy of Strangeness": a slide tutorial, one effect per slide, with audio experiments on a single note and a recognition quiz. Its first step accepts your own three series as CSV (`year,<name>,<name>,<name>`, one row per consecutive year) |
| `lab.html` | The full tool: every parameter, a 3D spectrogram, a time bar and settings export |
| `sonify.py` | Renders WAV files with the same model, reading settings exported from the tool |
| `build.sh` | Packages the tutorial and the tool for publishing as one page with two views |

## Model

1. **Strangeness s(t)** between 0 and 1: `baseline = median over the baseline period` (its last year is adjustable), `r = submissions / baseline`, `s = clip((r − threshold) / saturation)^γ`, interpolated between years and smoothed (¼ year).
2. **Note**: a sum of N harmonic partials with amplitudes `k^−2.2`.
3. **Effects**, each with amount `depth × s(t)`, in the order they are computed:
   detune → jitter → inharmonicity → spectral tilt → wavefolding.
4. **Ghost voice**: the starting note with no effects, added after wavefolding.
5. **Mix**: a chord of ICSE 110 Hz, FSE 165 Hz, ASE 220 Hz (a just fifth and an octave), stereo panning, and a yearly beat with an accent every 5 years.

## Usage

Render the WAV files with the default settings (the chord and each conference on its own):

```bash
python3 sonify.py --all
```

With settings exported from the tool:

```bash
python3 sonify.py settings.json --all
```

Package the pages for publishing:

```bash
./build.sh dist
```

## Data sources

- [emeryberger/csconferences](https://github.com/emeryberger/csconferences)
- FSE 2006–2010: [Tao Xie, SE conference statistics](https://taoxie.cs.illinois.edu/seconferences.htm)
