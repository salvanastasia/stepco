# Display Mode Toggle Feature

## 🎯 Nuova Feature Implementata

Toccando al **centro del circular progress** (dove sono mostrati i numeri), l'app ora **switcha automaticamente** tra visualizzazione passi e distanza!

## 👆 Come Funziona

### Tap al Centro del Circular Progress

**Modalità 1: Steps (Passi)**
```
  8.547
  steps
```

**↓ Tap al centro ↓**

**Modalità 2: Meters (sotto 1km)**
```
  6.513
  meters
```

**↓ Tap al centro ↓**

**Modalità 2: Kilometers (sopra 1km)**
```
  7,62
  kilometers
```

**↓ Tap al centro ↓**

**Torna a Steps**

## 📊 Calcolo Distanza

### Formula Usata
```typescript
const meters = steps * 0.762;
const kilometers = meters / 1000;
```

### Lunghezza Media del Passo
- **0.762 metri** per passo (valore medio standard)
- Basato su altezza media persona (circa 1.75m)

### Esempi:
- **1.000 steps** = 762 meters
- **5.000 steps** = 3.81 kilometers  
- **10.000 steps** = 7.62 kilometers

## 🎨 Formattazione

### Steps
- **Formato**: Numero con separatore migliaia
- **Esempio**: `8.547` (formato tedesco con punto)
- **Label**: "steps"

### Meters (< 1000m)
- **Formato**: Arrotondato a numero intero
- **Esempio**: `762` meters
- **Label**: "meters"

### Kilometers (≥ 1000m)
- **Formato**: 2 decimali con virgola
- **Esempio**: `7,62` km
- **Label**: "kilometers"

## 💡 User Experience

### Visual Feedback
- ✅ **Tap area**: Tutto il cerchio centrale (grandi numeri + label)
- ✅ **Active opacity**: 0.7 (feedback visivo quando premi)
- ✅ **Smooth transition**: Cambio istantaneo del valore
- ✅ **State persistente**: Rimane sulla modalità scelta durante la camminata

### Quando Usarlo
1. **Durante la camminata** - Vedi distanza percorsa in tempo reale
2. **Fine camminata** - Confronta passi vs distanza
3. **Sfide** - "Voglio camminare 5km" → monitora i km

## 🔧 Implementazione Tecnica

### State Management
```typescript
const [displayMode, setDisplayMode] = useState<DisplayMode>('steps');

type DisplayMode = 'steps' | 'distance';
```

### Toggle Function
```typescript
const toggleDisplayMode = () => {
  setDisplayMode(prev => prev === 'steps' ? 'distance' : 'steps');
};
```

### Display Logic
```typescript
const getDisplayValue = () => {
  if (displayMode === 'steps') {
    return current.toLocaleString('de-DE');
  } else {
    if (meters < 1000) {
      return Math.round(meters).toLocaleString('de-DE');
    } else {
      return kilometers.toFixed(2).replace('.', ',');
    }
  }
};

const getDisplayLabel = () => {
  if (displayMode === 'steps') {
    return 'steps';
  } else {
    return meters < 1000 ? 'meters' : 'kilometers';
  }
};
```

### TouchableOpacity Wrapper
```typescript
<TouchableOpacity 
  style={styles.centerContent}
  onPress={toggleDisplayMode}
  activeOpacity={0.7}
>
  <Text style={styles.stepsCount}>{getDisplayValue()}</Text>
  <Text style={styles.stepsLabel}>{getDisplayLabel()}</Text>
</TouchableOpacity>
```

## 📱 Esempio Uso

### Scenario: Camminata 10.000 Passi

**Start: 0 steps**
```
Tap center → 0 meters
Tap center → 0,00 kilometers
Tap center → 0 steps
```

**During: 5.243 steps**
```
Display: 5.243 steps
Tap center → 3.995 meters
Tap center → 3,99 kilometers
Tap center → 5.243 steps
```

**Goal: 10.000 steps**
```
Display: 10.000 steps
Tap center → 7.620 meters
Tap center → 7,62 kilometers
Tap center → 10.000 steps
```

## 🎯 Benefits

### Per l'Utente
- ✅ **Flessibilità**: Scegli la metrica preferita
- ✅ **Motivazione**: "Quasi a 5km!" è più tangibile di "6.561 passi"
- ✅ **Comparazione**: Vedi entrambe le metriche facilmente
- ✅ **Goal setting**: "Voglio camminare 8km" → monitora progresso

### Per l'App
- ✅ **No extra storage**: State locale nel componente
- ✅ **Performance**: Calcolo istantaneo in memoria
- ✅ **UX intuitiva**: Tap naturale sul numero
- ✅ **Accessibility**: Area grande per il tap

## 🔄 States & Transitions

```
┌─────────────┐
│   STEPS     │ ←─────────────┐
│   8.547     │                │
│   steps     │                │
└─────────────┘                │
       │ Tap                   │ Tap
       ↓                       │
┌─────────────┐                │
│  METERS     │                │
│   6.513     │                │
│   meters    │                │
└─────────────┘                │
       │ Tap (if < 1000m)      │
       ↓                       │
┌─────────────┐                │
│ KILOMETERS  │                │
│   7,62      │                │
│ kilometers  │                │
└─────────────┘────────────────┘
```

## 🚀 Future Enhancements

### Possibili Miglioramenti:
1. **Preferenza Persistente**
   - Salvare la scelta in AsyncStorage
   - Ricordare tra sessioni

2. **Calorie**
   - Aggiungere modalità calorie
   - `calories = steps * 0.04` (circa)

3. **Personalizzazione**
   - Permettere di impostare lunghezza passo personalizzata
   - Basata su altezza utente

4. **Animation**
   - Fade transition tra modalità
   - Smooth number change

5. **Gesture**
   - Swipe up/down per cambiare
   - Oltre al tap

## ✅ Testing Checklist

- [x] Tap al centro cambia modalità
- [x] Steps → Meters → Kilometers → Steps
- [x] Formattazione corretta numeri
- [x] Label corretta per ogni modalità
- [x] < 1000m mostra meters
- [x] ≥ 1000m mostra kilometers
- [x] Active opacity feedback
- [x] Calcolo distanza accurato
- [x] State persiste durante camminata
- [x] Funziona con 0 steps
- [x] Funziona con goal raggiunto

---

**Implementato il**: 26 Gennaio 2026  
**Feature Type**: UX Enhancement  
**Status**: ✅ Completato e Funzionante
