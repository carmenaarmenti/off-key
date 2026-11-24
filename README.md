# Sottomissioni in Suono

Sonificazione delle sottomissioni a ICSE, FSE e ASE dal 2006 al 2025. Ogni conferenza è una nota. Più le sottomissioni di un anno si allontanano dalla norma storica (mediana 2006–2015), più la nota si deforma.

## File

| File | Cosa contiene |
|---|---|
| `tutorial.html` | «Anatomia della Stranezza»: tutorial a slide, un effetto per slide, con esperimenti audio su una sola nota e un quiz di riconoscimento |
| `lab.html` | Il tool completo: tutti i parametri, spettrogramma 3D, barra del tempo, esportazione delle impostazioni |
| `sonify.py` | Genera i file WAV con lo stesso modello, leggendo le impostazioni esportate dal tool |
| `build.sh` | Prepara tutorial e tool per la pubblicazione come un'unica pagina con due viste |

## Modello

1. **Stranezza s(t)** tra 0 e 1: `r = sottomissioni / norma`, `s = clip((r − soglia) / saturazione)^γ`, interpolata tra gli anni e smussata (¼ di anno).
2. **Nota**: somma di N parziali armoniche, ampiezze `k^−2,2`.
3. **Effetti**, ciascuno con intensità `profondità × s(t)`, nell'ordine di calcolo:
   detune → jitter → inarmonicità → spectral tilt → wavefolding.
4. **Voce fantasma**: la nota di partenza senza effetti, aggiunta dopo il wavefolding.
5. **Mix**: accordo ICSE 110 Hz, FSE 165 Hz, ASE 220 Hz (quinta giusta e ottava), panorama stereo, beat annuale con accento ogni 5 anni.

## Uso

Generare i WAV con le impostazioni predefinite (accordo e tre conferenze singole):

```bash
python3 sonify.py --tutte
```

Con le impostazioni esportate dal tool:

```bash
python3 sonify.py impostazioni.json --tutte
```

Preparare le pagine da pubblicare:

```bash
./build.sh dist
```

## Fonti dei dati

- [emeryberger/csconferences](https://github.com/emeryberger/csconferences)
- FSE 2006–2010: [Tao Xie, SE conference statistics](https://taoxie.cs.illinois.edu/seconferences.htm)
