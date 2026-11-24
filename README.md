# Off Key

*An anatomy of strangeness in conference submissions.*

Off Key is a sonification of submissions to ICSE, FSE and ASE from 2006 to 2025. Each conference is a note. The further a year's submissions drift from the historical baseline (their median over a baseline period, 2006–2015 by default), the more the note warps out of tune, until the chord no longer sounds right.

A welcome page plays the piece and offers two ways in: **Anatomy of Strangeness**, a step-by-step tutorial on how the sound is built, and **Submissions in Sound**, the full tool.

**Live site:** https://carmenaarmenti.github.io/off-key/ (the welcome page; the tutorial is at `tutorial.html`, the tool at `lab.html`).

## Files

| File | Contents |
|---|---|
| `welcome.html` | The home page: what Off Key is about, a preview of the piece, and links to the tutorial and the tool |
| `tutorial.html` | "Anatomy of Strangeness": a slide tutorial, one effect per slide, with audio experiments on a single note and a recognition quiz. Its first step accepts your own three series as CSV (`year,<name>,<name>,<name>`, one row per consecutive year) |
| `glossary.html` | The glossary: one page per concept, with narrower ideas as its sections, and an index of all concepts |
| `glossary-data.js` | The concepts themselves, shared by the tutorial (for its links) and the glossary page |
| `lab.html` | The full tool: every parameter, a 3D spectrogram, a Pitch view, a time bar, and settings you can save to and load from a JSON file |
| `assets/` | The preview played on the welcome page (`off-key-chord.mp4`, the default chord rendered by `sonify.py` and encoded as AAC with `afconvert -f m4af -d aac -b 128000`; the `.mp4` name is because claude.ai does not serve `.m4a`) |
| `sonify.py` | Renders WAV files with the same model, reading settings exported from the tool |
| `build.sh` | Packages the pages, either for claude.ai or, with `--site`, for an ordinary web host; the welcome page becomes `index.html` |
| `.github/workflows/pages.yml` | Builds the site and publishes it to GitHub Pages on every push to `main` |

## Model

1. **Strangeness s(t)** between 0 and 1: `baseline = median over the baseline period` (its last year is adjustable), `r = submissions / baseline`, `s = clip((r − threshold) / saturation)^γ`, interpolated between years and smoothed (¼ year).
2. **Note**: a sum of N harmonic partials with amplitudes `k^−2.2`.
3. **Effects**, each with amount `depth × s(t)`, in the order they are computed:
   detune → jitter → inharmonicity → spectral tilt → wavefolding.
4. **Ghost voice**: the starting note with no effects, added after wavefolding.
5. **Mix**: a chord of ICSE 110 Hz, FSE 165 Hz, ASE 220 Hz (a just fifth and an octave), stereo panning, and a yearly beat with an accent every 5 years.

## Tutorial

The tutorial opens one step at a time: each step unlocks the next when you press "Got it", and the steps not reached yet stay hidden. A **Glossary** link in the header opens the glossary page. Every step lists its own concepts as links; each link opens the page of that concept only, with its explanation, an example and its narrower ideas as sections (for instance *Strangeness* holds baseline, threshold, saturation, exponent γ and smoothing). A link to one of those narrower ideas opens the concept it belongs to, at that section. **Back to the tutorial** returns to the step you came from. The tool has the same link back to the tutorial, and the tutorial's header has a **Tool** link for readers who want to skip straight to it. **Off Key** in the header of every page leads back to the welcome page.

### Quiz

The Listening step ends with a quiz that asks which effect you hear. It has four modes.

| Mode | What it does |
|---|---|
| Free practice | Random questions with no end. |
| Round of 10 | Each of the five effects appears exactly twice, in random order. At the end it shows your score for each effect, so you can see which ones you confuse. |
| Levels | Five levels of increasing difficulty, four questions each. Three correct answers unlock the next level; fewer restart the level. |
| Adaptive | Random questions, but mistakes bring an effect back until it is learned (see below). The quiz ends when every effect is learned. |

In free practice, the round and the adaptive mode the listening is always the same: a 6-second ramp of strangeness from 0 to 1 on A3 (220 Hz), with the ghost voice on and a single effect at its default depth (detune 90 cents, jitter ±20 cents, inharmonicity B = 2.5‰, spectral tilt T = 1.2, wavefolding G = 5).

The five levels are:

1. **With a reference**: one effect at full depth, ghost voice on.
2. **No reference**: one effect at full depth, no ghost voice.
3. **Subtle**: one effect at half depth, ghost voice on.
4. **Two at once**: two effects together; both must be named.
5. **In the piece**: the last six years of the full chord, first complete (A), then with one effect missing (B); name the missing effect.

The adaptive mode keeps a debt for each effect:

- a wrong answer adds 2 to the debt of the effect that was playing, and 1 to the debt of the effect you picked by mistake, since the two are being confused;
- a right answer removes 1 from the debt of that effect;
- three times out of four, the next question is drawn among the effects with a debt, in proportion to it; otherwise it is drawn among the effects not yet learned;
- an effect counts as learned once it has no debt and has been recognised twice in a row.

A wrong answer therefore brings an effect back at least twice more, and one that keeps being confused with another keeps returning until it is recognised reliably.

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

## Deploying

The site is published by GitHub Pages. Every push to `main` runs the workflow in `.github/workflows/pages.yml`, which builds the pages with `build.sh --site` and deploys them; there is nothing to do by hand. Pages must be enabled once in the repository settings: **Settings → Pages → Source: GitHub Actions**.

To build the site locally and look at it before pushing:

```bash
./build.sh _site --site
python3 -m http.server --directory _site
```

Then open http://localhost:8000.

Settings saved from the tool (`settings.json`) can be loaded back into it later, or passed to `sonify.py` to render the same configuration as WAV files.

## Data sources

- [emeryberger/csconferences](https://github.com/emeryberger/csconferences)
- FSE 2006–2010: [Tao Xie, SE conference statistics](https://taoxie.cs.illinois.edu/seconferences.htm)
