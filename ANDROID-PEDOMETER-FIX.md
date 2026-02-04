# 🤖 Android Pedometer Fix - Passi Sempre Zero

## 🐛 Problema

Su Android, i passi rimangono sempre a **0** anche camminando.

**Causa:**
- Android `watchStepCount()` restituisce il **conteggio totale** dall'ultimo riavvio del dispositivo (es: 50,000)
- iOS `watchStepCount()` parte da **~0** quando viene chiamato
- Senza sottrarre il baseline, su Android mostriamo sempre 0 o un numero enorme

---

## ✅ Soluzione Implementata

### 1. Logica Corretta con Baseline

```typescript
let initialStepCount: number | null = null;

subscription = Pedometer.watchStepCount(result => {
  console.log('Pedometer raw value:', result.steps);
  
  // Prima chiamata: memorizza baseline
  if (initialStepCount === null) {
    initialStepCount = result.steps;  // Es: 50000 (totale dal boot)
    setSteps(0);
    return;
  }
  
  // Calcola delta: current - baseline
  const stepsThisWalk = result.steps - initialStepCount;
  // Es: 50010 - 50000 = 10 passi ✅
  
  setSteps(stepsThisWalk);
});
```

**Come Funziona:**

**iOS:**
```
Callback 1: result.steps = 0      → baseline = 0
Callback 2: result.steps = 5      → delta = 5 - 0 = 5
Callback 3: result.steps = 12     → delta = 12 - 0 = 12
```

**Android:**
```
Callback 1: result.steps = 50000  → baseline = 50000
Callback 2: result.steps = 50005  → delta = 50005 - 50000 = 5
Callback 3: result.steps = 50012  → delta = 50012 - 50000 = 12
```

---

### 2. Permessi Android Runtime

**Aggiornato `startWalk()`:**
```typescript
// Request permissions (both iOS and Android)
const { status } = await Pedometer.requestPermissionsAsync();

if (status !== 'granted') {
  Alert.alert(
    'Permission Required',
    'Android: Settings > Apps > Stepco > Permissions > Physical activity'
  );
  return;
}
```

**Permessi in `app.json`:**
```json
"android": {
  "permissions": [
    "ACTIVITY_RECOGNITION"  // ← Necessario per Android 10+
  ]
}
```

---

### 3. Logging Dettagliato

**Ora puoi vedere nel terminale:**
```
Pedometer available: true
Platform: android
Starting pedometer tracking...
Pedometer subscription created
Pedometer raw value: 50000
Initial step count (baseline): 50000
Pedometer raw value: 50005
Steps this walk: 5 = 50005 - 50000
Pedometer raw value: 50012
Steps this walk: 12 = 50012 - 50000
```

---

## 🔍 Debug Checklist

### 1. Verifica Permessi

**Nel terminale Expo, cerca:**
```
Requesting pedometer permissions...
Permission status: granted  ← Deve essere "granted"
```

**Se vedi `denied`:**
1. Apri **Impostazioni** Android
2. **App** → **Stepco**
3. **Permessi** → **Attività fisica** → Consenti

---

### 2. Verifica Pedometer Disponibile

**Nel terminale, cerca:**
```
Pedometer available: true  ← Deve essere true
Platform: android
```

**Se vedi `false`:**
- Il dispositivo non ha sensore di movimento
- Usa un dispositivo fisico (non emulatore)
- L'emulatore Android non supporta il pedometer

---

### 3. Verifica Valori Raw

**Nel terminale, quando cammini:**
```
Starting pedometer tracking...
Pedometer raw value: 50000     ← Valore iniziale
Pedometer raw value: 50003     ← Aumenta di pochi passi
Pedometer raw value: 50008     ← Continua ad aumentare
```

**Se i valori NON aumentano:**
- Il sensore non sta rilevando movimento
- Prova a scuotere vigorosamente il telefono
- Verifica che il sensore non sia disabilitato nelle impostazioni

---

### 4. Verifica Calcolo Delta

**Nel terminale:**
```
Steps this walk: 3 = 50003 - 50000   ← Delta corretto
Steps this walk: 8 = 50008 - 50000   ← Delta aumenta
```

**Se il delta è sempre 0:**
- `result.steps` è uguale a `initialStepCount`
- Il sensore non sta registrando passi
- Problema hardware o sensore disabilitato

---

## 🛠️ Troubleshooting

### Problema 1: "Permission status: denied"

**Soluzione:**
```bash
# Riavvia l'app dopo aver concesso i permessi
# Nel terminale Expo:
r  # Reload
```

**Manuale:**
1. Disinstalla l'app
2. Reinstalla: `npx expo run:android`
3. Concedi permessi quando richiesto

---

### Problema 2: "Pedometer available: false"

**Causa:** Emulatore Android non supporta pedometer

**Soluzione:**
- Usa un **dispositivo fisico** Android
- Collega via USB
- `npx expo run:android --device`

**Verifica sensore su dispositivo:**
```bash
# Verifica se il sensore esiste
adb shell dumpsys sensorservice | grep -i step
```

---

### Problema 3: Valori raw non aumentano

**Test rapido:**
1. Avvia walk
2. **Scuoti vigorosamente** il telefono per 5 secondi
3. Guarda i log: `Pedometer raw value:` dovrebbe aumentare

**Se non aumenta:**
- Sensore disabilitato
- Hardware difettoso
- Permessi non concessi correttamente

**Android Settings Check:**
```
Settings > Google > Fitness & Wellness > Track your activities
→ Deve essere ON
```

---

### Problema 4: "Could not start step tracking"

**Errore completo nel terminale:**
```
Error requesting permissions: [Error description]
```

**Soluzioni:**

**A) Clear App Data**
```bash
adb shell pm clear com.stepco.app
npx expo start --clear
```

**B) Reinstall App**
```bash
npx expo run:android --device
```

**C) Check AndroidManifest.xml**
```bash
# Verifica che i permessi siano stati aggiunti
npx expo prebuild --clean
# Controlla: android/app/src/main/AndroidManifest.xml
```

---

## 📱 Test su Dispositivo Reale

### Setup

1. **Abilita USB Debugging**
   ```
   Settings > About Phone > Tap "Build Number" 7 times
   Settings > Developer Options > USB Debugging ON
   ```

2. **Connetti via USB**
   ```bash
   adb devices  # Verifica connessione
   ```

3. **Run su dispositivo**
   ```bash
   npx expo run:android --device
   ```

4. **Avvia walk e cammina davvero**
   - Cammina almeno 10-20 passi
   - I sensori Android possono avere 1-2 secondi di delay

---

## 🎯 Expected Behavior

### Scenario Corretto

```
1. User preme "START WALK"
   → Log: Requesting pedometer permissions...
   → Log: Permission status: granted
   → Log: Permissions granted, starting walk
   
2. User cammina
   → Log: Starting pedometer tracking...
   → Log: Pedometer subscription created
   → Log: Pedometer raw value: 50000
   → Log: Initial step count (baseline): 50000
   
3. Dopo 5 passi
   → Log: Pedometer raw value: 50005
   → Log: Steps this walk: 5 = 50005 - 50000
   → Display mostra: "5 steps"
   
4. Dopo 10 passi totali
   → Log: Pedometer raw value: 50010
   → Log: Steps this walk: 10 = 50010 - 50000
   → Display mostra: "10 steps"
```

---

## 🔧 Alternative: Force Simulation Mode

Se il pedometer continua a non funzionare su Android, puoi forzare la modalità simulazione:

```typescript
// In App.tsx, modifica checkPedometer:
const checkPedometer = async () => {
  const available = await Pedometer.isAvailableAsync();
  
  // Force simulation on Android for testing
  if (Platform.OS === 'android') {
    setIsPedometerAvailable(false);
    console.log('Forcing simulation mode on Android');
  } else {
    setIsPedometerAvailable(available);
  }
};
```

**Nota:** Usa solo per testing! Rimuovi per produzione.

---

## 📊 Compare iOS vs Android

| Feature | iOS | Android |
|---------|-----|---------|
| **Pedometer API** | ✅ HealthKit | ✅ Step Counter Sensor |
| **watchStepCount()** | Parte da ~0 | Totale dal boot |
| **Baseline necessario** | No (ma funziona) | Sì (essenziale) |
| **Runtime Permission** | Sì (Motion) | Sì (Activity Recognition) |
| **Emulator Support** | ❌ No | ❌ No |
| **Delay** | Quasi real-time | 1-2 secondi |

---

## ✅ Commit Changes

Se tutto funziona su dispositivo reale, committa le modifiche:

```bash
git add App.tsx app.json
git commit -m "Fix Android pedometer: add baseline calculation and runtime permissions"
```

---

## 📚 References

**Expo Pedometer Docs:**
- https://docs.expo.dev/versions/latest/sdk/pedometer/

**Android Step Counter:**
- Sensor: `TYPE_STEP_COUNTER`
- Returns: Total steps since last boot
- Docs: https://developer.android.com/reference/android/hardware/Sensor#TYPE_STEP_COUNTER

**iOS Pedometer:**
- Framework: CoreMotion / CMPedometer
- Returns: Steps since query started
- Docs: https://developer.apple.com/documentation/coremotion/cmpedometer

---

**Status:** ✅ Fix Implementato  
**Test Required:** Dispositivo Android fisico  
**Data:** 27 Gennaio 2026
