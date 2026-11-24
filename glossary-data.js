// Concepts used by Off Key, shared by the tutorial (for link labels) and glossary.html (for the pages).
// Each root concept has its own page; related, narrower ideas are sub-sections of it.
// Ids are used in links: glossary.html#<id> opens the root concept, or the root that holds that sub-section.
window.OFFKEY_GLOSSARY = [
  { group: "Off Key", concepts: [
    { id: "strangeness", title: "Strangeness",
      text: [
        "A number between 0 and 1 computed from the data for every year. 0 means the year looks like the normal past; 1 means it is as far from the past as the saturation allows.",
        "It is the single control that drives every effect: each effect's amount at any moment is its depth × strangeness. It is computed in four steps, described below."
      ],
      subs: [
        { id: "baseline", title: "Baseline", text: [
          "The reference level of a series: the median of its values over the baseline period, by default the first ten years. Every year is divided by it, so values become multiples of the normal past: 1× is normal, 2× is twice the usual.",
          "The median is the middle value of a list once sorted; for ten values, the average of the 5th and 6th. Unlike the mean, it ignores isolated spikes, so one exceptional year barely moves the baseline."
        ] },
        { id: "threshold", title: "Threshold", text: [
          "The multiple of the baseline below which strangeness stays at 0. It absorbs the normal variation from one year to the next.",
          "Example: a threshold of 1.25 means a year must be at least 25% above the baseline before it starts to sound strange."
        ] },
        { id: "saturation", title: "Saturation", text: [
          "How far above the threshold strangeness reaches 1. On the shared scale it is the same for every series, so their strangeness can be compared. On the per-conference scale it is set so that each series reaches 1 in its own peak year: saturation = peak / baseline − threshold."
        ] },
        { id: "gamma", title: "Exponent γ", text: [
          "A power applied to strangeness as the last step: s becomes s^γ. Values above 1 push small values towards 0 and leave large ones near 1, so modest growth stays quiet and only big jumps are heard.",
          "Example with γ = 1.3: 0.3 becomes 0.21, 0.8 becomes 0.75."
        ] },
        { id: "smoothing", title: "Smoothing", text: [
          "Strangeness has one value per year. To avoid jumps at year boundaries, each value is placed at the centre of its year, neighbouring values are joined with straight lines, and the result passes three times through a moving average (an average over a sliding window). Together these approximate a Gaussian filter with a standard deviation of a quarter of a year."
        ] }
      ] },
    { id: "depth", title: "Depth",
      text: [
        "The amount an effect reaches when strangeness is 1. At any other moment the effect is depth × strangeness.",
        "Example: a detune depth of 90 cents with strangeness 0.5 shifts the note by 45 cents."
      ] },
    { id: "ghost-voice", title: "Ghost voice",
      text: [
        "A copy of the note with no effects and a fixed pitch, playing alongside it at 35% volume by default. It shares the note's partials and phases, so at strangeness 0 the two are identical.",
        "As strangeness grows the note drifts away from it, and the difference becomes audible as beating and roughness. Without it, a note that has moved would just sound like another note."
      ] }
  ] },
  { group: "Sound", concepts: [
    { id: "partial", title: "Partial",
      text: ["One of the sine waves that add up to a sound. Each has a frequency (its pitch), an amplitude (its loudness) and a phase. The note in Off Key has 28 partials."],
      subs: [
        { id: "phase", title: "Phase", text: [
          "Where a sine wave is in its cycle at time zero, like the position of a clock hand when you start watching. Changing only the phases changes the shape of a waveform but not its spectrum.",
          "Phase matters when two copies of a sound are added: partials in phase reinforce each other, partials out of phase partly cancel. For this reason each note and its ghost voice share the same phases."
        ] }
      ] },
    { id: "fundamental", title: "Fundamental",
      text: ["The lowest partial of a harmonic sound, written f₀. Its frequency is the pitch we hear: 220 Hz is the A below middle C."] },
    { id: "harmonic-series", title: "Harmonic series",
      text: ["Partials at whole-number multiples of the fundamental: f₀, 2f₀, 3f₀ and so on. For 220 Hz: 220, 440, 660, 880 Hz. The ear fuses them into a single note with the pitch of f₀; most pitched instruments produce roughly this series."] },
    { id: "spectrum", title: "Spectrum",
      text: ["A picture of a sound as its partials: frequency along the horizontal axis, amplitude up the vertical one. A harmonic note shows evenly spaced lines; inharmonicity bends the spacing, and wavefolding adds new lines."],
      subs: [
        { id: "decibel", title: "Decibel (dB)", text: [
          "A logarithmic unit for ratios of amplitude: 20 · log₁₀(ratio). −6 dB is half the amplitude, −20 dB a tenth, −40 dB a hundredth. Spectra are drawn in decibels because the ear compares loudness on a roughly logarithmic scale."
        ] }
      ] },
    { id: "timbre", title: "Timbre",
      text: ["The quality that tells apart two sounds with the same pitch and loudness, such as a flute and a violin on the same note. It depends mostly on how many partials there are and how strong each one is."] },
    { id: "inharmonicity", title: "Inharmonicity",
      text: ["The departure of partials from whole-number multiples of the fundamental. Small amounts are natural in pianos and guitars; large amounts, as in bells and gongs, make the pitch ambiguous and the timbre metallic."],
      subs: [
        { id: "stiff-string", title: "Stiff string", text: [
          "A string that resists bending. Its stiffness raises the frequency of the higher modes: fₖ = k · f₀ · √(1 + B · k²), where B is the inharmonicity coefficient. Off Key uses this model.",
          "Piano strings have B of roughly 0.1–1‰; Off Key goes up to 6‰ so that the effect is easy to hear."
        ] }
      ] },
    { id: "spectral-tilt", title: "Spectral tilt",
      text: ["The overall slope of a spectrum: how fast partial amplitudes fall as frequency rises, measured in dB per octave. A steep tilt (−13 dB per octave) sounds dark and soft; a gentle one (−6 dB per octave, the spectrum of a sawtooth wave) sounds bright."],
      subs: [
        { id: "spectral-centroid", title: "Spectral centroid", text: [
          "The amplitude-weighted average frequency of a spectrum, its centre of mass. It is the most reliable single predictor of perceived brightness: the higher the centroid, the brighter the sound."
        ] }
      ] }
  ] },
  { group: "Pitch and perception", concepts: [
    { id: "cent", title: "Cent",
      text: [
        "A logarithmic unit of pitch: 100 cents make a semitone and 1200 an octave. Cents compare pitches by ratio rather than by difference in hertz.",
        "Example: 12 cents is the same interval at 110 Hz and at 880 Hz, even though it is 0.8 Hz at the first and 6.1 Hz at the second."
      ] },
    { id: "interval", title: "Interval",
      text: ["The distance between two pitches, given by the ratio of their frequencies or, equivalently, in cents. An octave is a ratio of 2 : 1 (1200 cents); a semitone is about 1.059 : 1 (100 cents)."],
      subs: [
        { id: "just-fifth", title: "Just fifth", text: [
          "The interval with frequency ratio 3 : 2, for example 110 Hz and 165 Hz. Because the ratio is simple, many partials of the two notes coincide exactly (330, 660, 990 Hz…), so the interval sounds smooth, with no beating.",
          "The equal-tempered fifth of a piano is slightly narrower (164.81 Hz above 110 Hz) and beats slowly. Off Key's chord uses the just fifth so that it starts perfectly still."
        ] }
      ] },
    { id: "beating", title: "Beating",
      text: [
        "When two tones of nearby frequencies f₁ and f₂ sound together, their sum swells and fades |f₁ − f₂| times per second.",
        "Example: 220 Hz and 223 Hz beat three times a second. Musicians use this to tune: the beats slow down as two strings approach the same pitch, and stop when they match."
      ],
      subs: [
        { id: "roughness", title: "Roughness", text: [
          "When beating becomes too fast to follow as separate pulses, above roughly 15–20 per second, it is heard instead as a rasping, rough quality. It is one of the main ingredients of perceived dissonance."
        ] }
      ] },
    { id: "vibrato", title: "Vibrato",
      text: ["A periodic, regular variation of pitch, typically 5–7 times a second and up to about ±50 cents, used expressively by singers and string players. Jitter differs from vibrato because it has no period: the pitch moves at random."] }
  ] },
  { group: "Signal processing", concepts: [
    { id: "nonlinearity", title: "Nonlinearity",
      text: ["Any processing whose output is not proportional to its input, such as clipping, distortion or wavefolding. A linear process can only change the level of the partials already present; a nonlinear one creates new frequencies that were not in the input: harmonics and intermodulation products."],
      subs: [
        { id: "transfer-function", title: "Transfer function", text: [
          "A rule that maps each input sample value x to an output value y. A straight line, y = x, leaves the sound unchanged; any curve reshapes the waveform. Wavefolding uses y = sin(π/2 · g · x), which bends values and then folds back those that would pass the limit."
        ] }
      ] },
    { id: "intermodulation", title: "Intermodulation",
      text: [
        "When a sound with two or more partials passes through a nonlinearity, new components appear at sums and differences of their frequencies: f₁ + f₂, |f₁ − f₂|, 2f₁ − f₂, 2f₂ − f₁ and so on.",
        "Example on a harmonic note: partials at 660 and 880 Hz produce, among others, 220 Hz (880 − 660), 1540 Hz (660 + 880), 440 Hz (2 · 660 − 880) and 1100 Hz (2 · 880 − 660). All of these are again multiples of the 220 Hz fundamental, so the note stays in tune and only gets richer.",
        "Example on an inharmonic note: partials at 2359 and 5566 Hz produce 3207, 7925, 848 and 8773 Hz, frequencies unrelated to the note. This is why wavefolding on a note that is already strange sounds dissonant rather than just bright."
      ] },
    { id: "sample-rate", title: "Sample rate",
      text: ["How many values per second represent a digital sound: here 44,100, as on a CD. A higher rate can represent higher frequencies."],
      subs: [
        { id: "nyquist", title: "Nyquist frequency", text: [
          "Half the sample rate: 22,050 Hz here. It is the highest frequency that can be represented; anything above it turns into aliasing. Human hearing stops around 20,000 Hz, which is why a rate of 44,100 is enough."
        ] }
      ] },
    { id: "aliasing", title: "Aliasing",
      text: [
        "A frequency above the Nyquist frequency cannot be stored as it is. It does not disappear: it comes back reflected below the limit, at sample rate − frequency.",
        "Example: wavefolding creates a component at 25,000 Hz, which is heard at 44,100 − 25,000 = 19,100 Hz; one at 30,000 Hz comes back at 14,100 Hz. These reflected components bear no relation to the note's harmonics, so they add a grainy, metallic haze.",
        "It is the audio relative of the wagon-wheel effect in films, where a fast wheel seems to turn slowly or backwards. Off Key avoids aliasing when it builds the note by dropping partials above 45% of the sample rate, but wavefolding creates new high components afterwards, so at high gain some aliasing is part of the sound."
      ] },
    { id: "panning", title: "Panning",
      text: ["Placing a sound between the left and right speakers. In Off Key's chord the three notes sit left, centre and right, so they can be told apart."],
      subs: [
        { id: "constant-power", title: "Constant-power panning", text: [
          "A panning law that keeps the perceived loudness the same wherever the sound is placed: gains of √((1 − p) / 2) on the left and √((1 + p) / 2) on the right, for a position p from −1 (left) to +1 (right). Off Key uses p = −0.7, 0 and +0.7."
        ] }
      ] }
  ] }
];
