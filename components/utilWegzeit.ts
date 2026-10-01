export type MovementMode = 'stop' | 'decel' | 'drive'

export interface StopInput {
  vA: number
  vE: number
  tR: number
  tS: number
  am: number
  t: number
}

export interface DecelInput {
  vA: number
  vE: number
  a: number
  s: number
  t: number
}

export interface DriveInput {
  v: number
  s: number
  t: number
}

export interface MovementInput {
  mode: MovementMode
  stop: StopInput
  decel: DecelInput
  drive: DriveInput
}

export interface DiagramPoint {
  t: number
  s: number
  label?: string
}

export interface SpeedTick extends DiagramPoint {
  major: boolean
}

export interface MovementDetailRow {
  label: string
  value: string
}

export interface ValidMovementResult {
  status: 'valid'
  mode: MovementMode
  modeLabel: string
  distanceLabel: string
  duration: number
  endDuration: number
  distance: number
  initialSpeedKmh: number
  finalSpeedKmh: number
  detailRows: MovementDetailRow[]
  markers: DiagramPoint[]
  speedTicks: SpeedTick[]
  points: DiagramPoint[]
  distanceAtTime: (elapsedTime: number) => number
}

export interface InvalidMovementResult {
  status: 'empty' | 'invalid'
  message: string
}

export type MovementResult = ValidMovementResult | InvalidMovementResult

export const MODE_LABELS: Record<MovementMode, string> = {
  stop: 'Anhaltevorgang',
  decel: 'konstante Verzögerung',
  drive: 'Konstantfahrt',
}

const DECEL_KEYS: Array<keyof DecelInput> = ['vA', 'vE', 'a', 's', 't']

const DRIVE_KEYS: Array<keyof DriveInput> = ['v', 's', 't']

export const isEntered = (value: number): boolean => Number.isFinite(value)

export const toMs = (kmh: number): number => kmh / 3.6

export const toKmh = (ms: number): number => ms * 3.6

export const formatNumber = (value: number, digits = 2): string =>
  value.toFixed(digits).replace('.', ',')

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const roundUpToStep = (value: number, step: number): number =>
  Math.ceil(value / step) * step

export const makeStepTicks = (min: number, max: number, step: number): number[] => {
  const ticks: number[] = []
  const start = Math.ceil(min / step) * step
  const end = Math.floor(max / step) * step
  const decimals = step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0

  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(decimals)))
  }

  return ticks
}


const samplePoints = (duration: number, distanceAtTime: (elapsedTime: number) => number): DiagramPoint[] => {
  const steps = duration <= 0 ? 1 : 48

  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = duration <= 0 ? 0 : (duration * index) / steps
    return {
      t,
      s: distanceAtTime(t),
    }
  })
}

const isClose = (actual: number, expected: number): boolean => {
  const tolerance = Math.max(0.05, Math.abs(expected) * 0.005)
  return Math.abs(actual - expected) <= tolerance
}

const makeSpeedTicks = ({
  startSpeedKmh,
  endSpeedKmh,
  startTime,
  acceleration,
  distanceAtTime,
  maxSpeedKmh = Number.POSITIVE_INFINITY,
}: {
  startSpeedKmh: number
  endSpeedKmh: number
  startTime: number
  acceleration: number
  distanceAtTime: (elapsedTime: number) => number
  maxSpeedKmh?: number
}): SpeedTick[] => {
  const highestTick = Math.min(maxSpeedKmh, Math.floor(startSpeedKmh + 0.001))
  const lowestTick = Math.max(0, Math.ceil(endSpeedKmh + 0.001))

  if (highestTick < lowestTick || acceleration <= 0) {
    return []
  }

  return Array.from({ length: highestTick - lowestTick + 1 }, (_, index) => highestTick - index)
    .filter(speed => speed >= endSpeedKmh - 0.001 && speed <= startSpeedKmh + 0.001)
    .map(speed => {
      const elapsedInDecel = (toMs(startSpeedKmh) - toMs(speed)) / acceleration
      const t = startTime + elapsedInDecel

      return {
        t,
        s: distanceAtTime(t),
        label: speed % 10 === 0 ? formatNumber(speed, 0) : undefined,
        major: speed % 5 === 0,
      }
    })
}

const makeRampSpeedTicks = ({
  startSpeedKmh,
  endSpeedKmh,
  startTime,
  rampDuration,
  acceleration,
  distanceAtTime,
}: {
  startSpeedKmh: number
  endSpeedKmh: number
  startTime: number
  rampDuration: number
  acceleration: number
  distanceAtTime: (elapsedTime: number) => number
}): SpeedTick[] => {
  if (rampDuration <= 0 || acceleration <= 0 || startSpeedKmh <= endSpeedKmh) {
    return []
  }

  const highestTick = Math.floor(startSpeedKmh + 0.001)
  const lowestTick = Math.ceil(endSpeedKmh + 0.001)

  if (highestTick < lowestTick) {
    return []
  }

  return Array.from({ length: highestTick - lowestTick + 1 }, (_, index) => highestTick - index)
    .filter(speed => speed >= endSpeedKmh - 0.001 && speed <= startSpeedKmh + 0.001)
    .map(speed => {
      const speedDrop = toMs(startSpeedKmh) - toMs(speed)
      const rampTime = speedDrop <= 0
        ? 0
        : Math.sqrt((2 * rampDuration * speedDrop) / acceleration)
      const t = startTime + clamp(rampTime, 0, rampDuration)

      return {
        t,
        s: distanceAtTime(t),
        label: speed % 10 === 0 ? formatNumber(speed, 0) : undefined,
        major: speed % 5 === 0,
      }
    })
}

const makeValidResult = ({
  mode,
  distanceLabel,
  duration,
  endDuration = duration,
  distance,
  initialSpeedKmh,
  finalSpeedKmh,
  detailRows = [],
  markers = [],
  speedTicks = [],
  distanceAtTime,
}: {
  mode: MovementMode
  distanceLabel: string
  duration: number
  endDuration?: number
  distance: number
  initialSpeedKmh: number
  finalSpeedKmh: number
  detailRows?: MovementDetailRow[]
  markers?: DiagramPoint[]
  speedTicks?: SpeedTick[]
  distanceAtTime: (elapsedTime: number) => number
}): MovementResult => {
  if (!Number.isFinite(duration) || !Number.isFinite(endDuration) || !Number.isFinite(distance) || duration <= 0 || endDuration < duration || distance <= 0) {
    return {
      status: 'invalid',
      message: 'Die Eingaben ergeben keine darstellbare Bewegung.',
    }
  }

  return {
    status: 'valid',
    mode,
    modeLabel: MODE_LABELS[mode],
    distanceLabel,
    duration,
    endDuration,
    distance,
    initialSpeedKmh,
    finalSpeedKmh,
    detailRows: [
      {
        label: 'Zeit bis Kollision',
        value: `${formatNumber(duration)} s`,
      },
      {
        label: distanceLabel,
        value: `${formatNumber(distance)} m`,
      },
      {
        label: 'Startgeschwindigkeit',
        value: `${formatNumber(initialSpeedKmh, 0)} km/h`,
      },
      {
        label: 'Geschwindigkeit bei Kollision',
        value: `${formatNumber(finalSpeedKmh, 0)} km/h`,
      },
      ...detailRows,
    ],
    markers,
    speedTicks,
    distanceAtTime,
    points: samplePoints(endDuration, distanceAtTime),
  }
}

export const calculateStop = (input: StopInput): MovementResult => {
  const requiredValues = [input.vA, input.tR, input.tS, input.am]
  const hasEndSpeed = isEntered(input.vE)
  const hasCollisionTime = isEntered(input.t)

  if (!requiredValues.some(isEntered) && !hasEndSpeed && !hasCollisionTime) {
    return {
      status: 'empty',
      message: 'Bitte Werte eingeben.',
    }
  }

  if (!requiredValues.every(isEntered) || (!hasEndSpeed && !hasCollisionTime)) {
    return {
      status: 'empty',
      message: 'Bitte vA, tR, tS, am sowie vE oder tges eingeben.',
    }
  }

  if (
    input.vA < 0
    || input.tR < 0
    || input.tS < 0
    || input.am <= 0
    || (hasEndSpeed && input.vE < 0)
    || (hasCollisionTime && input.t < 0)
  ) {
    return {
      status: 'invalid',
      message: 'Geschwindigkeiten und Zeiten dürfen nicht negativ sein; am muss größer als 0 sein.',
    }
  }

  if (hasEndSpeed && input.vA < input.vE) {
    return {
      status: 'invalid',
      message: 'vA muss größer oder gleich vE sein.',
    }
  }

  const { tR, tS, am } = input
  const vAms = toMs(input.vA)

  // The deceleration ramps linearly from 0 to am during tS; slow vehicles can stop before the ramp ends.
  const rampStopTime = tS > 0 ? Math.sqrt((2 * tS * vAms) / am) : 0
  const stopsInRamp = tS > 0 && rampStopTime < tS
  const rampDuration = stopsInRamp ? rampStopTime : tS
  const fullBrakeStartTime = tR + rampDuration
  const fullBrakeStartSpeed = stopsInRamp ? 0 : vAms - 0.5 * am * tS
  const endDuration = fullBrakeStartTime + fullBrakeStartSpeed / am
  const reactionDistance = vAms * tR
  const rampDistanceAt = (rampTime: number): number =>
    tS === 0 ? 0 : vAms * rampTime - (am * Math.pow(rampTime, 3)) / (6 * tS)
  const rampDistance = rampDistanceAt(rampDuration)

  const speedAtTime = (elapsedTime: number): number => {
    const elapsed = clamp(elapsedTime, 0, endDuration)

    if (elapsed <= tR) {
      return vAms
    }

    if (elapsed <= fullBrakeStartTime) {
      return Math.max(0, vAms - (am * Math.pow(elapsed - tR, 2)) / (2 * tS))
    }

    return Math.max(0, fullBrakeStartSpeed - am * (elapsed - fullBrakeStartTime))
  }

  const distanceAtTime = (elapsedTime: number): number => {
    const elapsed = clamp(elapsedTime, 0, endDuration)

    if (elapsed <= tR) {
      return vAms * elapsed
    }

    if (elapsed <= fullBrakeStartTime) {
      return reactionDistance + rampDistanceAt(elapsed - tR)
    }

    const brakeTime = elapsed - fullBrakeStartTime
    return reactionDistance + rampDistance + fullBrakeStartSpeed * brakeTime - 0.5 * am * brakeTime * brakeTime
  }

  const elapsedAtSpeed = (speed: number): number => {
    if (rampDuration > 0 && speed >= fullBrakeStartSpeed) {
      return tR + Math.sqrt((2 * tS * (vAms - speed)) / am)
    }

    return fullBrakeStartTime + (fullBrakeStartSpeed - speed) / am
  }

  let duration: number
  let finalSpeedKmh: number

  if (hasCollisionTime) {
    if (input.t > endDuration + 0.001) {
      return {
        status: 'invalid',
        message: `tges ist länger als der Anhaltevorgang (${formatNumber(endDuration)} s).`,
      }
    }

    duration = input.t
    finalSpeedKmh = toKmh(speedAtTime(duration))

    if (hasEndSpeed && !isClose(finalSpeedKmh, input.vE)) {
      return {
        status: 'invalid',
        message: `vE und tges passen nicht zusammen; zu tges gehört vE = ${formatNumber(finalSpeedKmh, 1)} km/h.`,
      }
    }
  } else {
    if (input.vE >= input.vA) {
      return {
        status: 'empty',
        message: 'Bei vE = vA liegt die Kollision vor Bremsbeginn. Bitte tges vom Reaktionsbeginn bis zur Kollision eingeben.',
      }
    }

    duration = elapsedAtSpeed(toMs(input.vE))
    finalSpeedKmh = input.vE
  }

  const collisionPhase = duration <= tR + 0.0005
    ? 'Reaktionszeit'
    : duration <= fullBrakeStartTime + 0.0005
      ? 'Schwellphase'
      : 'Vollverzögerung'

  return makeValidResult({
    mode: 'stop',
    distanceLabel: 'Weg bis Kollision',
    duration,
    endDuration,
    distance: distanceAtTime(duration),
    initialSpeedKmh: input.vA,
    finalSpeedKmh,
    detailRows: [
      {
        label: 'Kollision in',
        value: collisionPhase,
      },
      {
        label: 'Reaktionsdauer tR',
        value: `${formatNumber(tR)} s`,
      },
      {
        label: 'Schwellzeit tS',
        value: `${formatNumber(tS)} s`,
      },
      {
        label: 'mittlere Verzögerung',
        value: `-${formatNumber(am, 1)} m/s²`,
      },
      ...(endDuration > duration + 0.001 ? [
        {
          label: 'bis Stillstand nach Kollision',
          value: `${formatNumber(endDuration - duration)} s`,
        },
      ] : []),
    ],
    markers: [
      ...(tR > 0 ? [
        {
          t: 0,
          s: 0,
          label: 'tR',
        },
      ] : []),
      {
        t: tR,
        s: reactionDistance,
        label: 'tS',
      },
    ].filter(marker => marker.t < duration),
    speedTicks: [
      ...makeRampSpeedTicks({
        startSpeedKmh: input.vA,
        endSpeedKmh: toKmh(fullBrakeStartSpeed),
        startTime: tR,
        rampDuration: tS,
        acceleration: am,
        distanceAtTime,
      }),
      ...makeSpeedTicks({
        startSpeedKmh: toKmh(fullBrakeStartSpeed),
        endSpeedKmh: 0,
        startTime: fullBrakeStartTime,
        acceleration: am,
        distanceAtTime,
        maxSpeedKmh: toKmh(fullBrakeStartSpeed),
      }),
    ],
    distanceAtTime,
  })
}

interface DecelResolved {
  vA: number
  vE: number
  a: number
  s: number
  t: number
}

const validDecelCandidate = (candidate: DecelResolved): DecelResolved | null => {
  const values = [candidate.vA, candidate.vE, candidate.a, candidate.s, candidate.t]

  if (!values.every(Number.isFinite)) {
    return null
  }

  if (candidate.vA < 0 || candidate.vE < 0 || candidate.a <= 0 || candidate.s < 0 || candidate.t < 0) {
    return null
  }

  if (candidate.vA + 0.001 < candidate.vE) {
    return null
  }

  return {
    vA: Math.max(0, candidate.vA),
    vE: Math.max(0, candidate.vE),
    a: candidate.a,
    s: Math.max(0, candidate.s),
    t: Math.max(0, candidate.t),
  }
}

const candidateMatchesInput = (candidate: DecelResolved, input: DecelInput): boolean =>
  DECEL_KEYS.every(key => !isEntered(input[key]) || isClose(candidate[key], input[key]))

const decelCandidatesFromInput = (input: DecelInput): DecelResolved[] => {
  const candidates: DecelResolved[] = []
  const has = (key: keyof DecelInput): boolean => isEntered(input[key])
  const add = (candidate: DecelResolved | null) => {
    if (!candidate) {
      return
    }

    const valid = validDecelCandidate(candidate)
    if (valid) {
      candidates.push(valid)
    }
  }

  const vAms = toMs(input.vA)
  const vEms = toMs(input.vE)

  if (has('vA') && has('vE') && has('a')) {
    const t = (vAms - vEms) / input.a
    const s = (Math.pow(vAms, 2) - Math.pow(vEms, 2)) / (2 * input.a)
    add({ vA: input.vA, vE: input.vE, a: input.a, s, t })
  }

  if (has('vA') && has('vE') && has('s')) {
    const a = (Math.pow(vAms, 2) - Math.pow(vEms, 2)) / (2 * input.s)
    const t = (2 * input.s) / (vAms + vEms)
    add({ vA: input.vA, vE: input.vE, a, s: input.s, t })
  }

  if (has('vA') && has('vE') && has('t')) {
    const a = (vAms - vEms) / input.t
    const s = ((vAms + vEms) / 2) * input.t
    add({ vA: input.vA, vE: input.vE, a, s, t: input.t })
  }

  if (has('vA') && has('a') && has('s')) {
    const radicand = Math.pow(vAms, 2) - 2 * input.a * input.s
    if (radicand >= 0) {
      const vE = toKmh(Math.sqrt(radicand))
      const t = (vAms - toMs(vE)) / input.a
      add({ vA: input.vA, vE, a: input.a, s: input.s, t })
    }
  }

  if (has('vA') && has('a') && has('t')) {
    const vE = toKmh(vAms - input.a * input.t)
    const s = vAms * input.t - 0.5 * input.a * Math.pow(input.t, 2)
    add({ vA: input.vA, vE, a: input.a, s, t: input.t })
  }

  if (has('vA') && has('s') && has('t')) {
    const a = (2 * (vAms * input.t - input.s)) / Math.pow(input.t, 2)
    const vE = toKmh(vAms - a * input.t)
    add({ vA: input.vA, vE, a, s: input.s, t: input.t })
  }

  if (has('vE') && has('a') && has('s')) {
    const vA = toKmh(Math.sqrt(Math.pow(vEms, 2) + 2 * input.a * input.s))
    const t = (toMs(vA) - vEms) / input.a
    add({ vA, vE: input.vE, a: input.a, s: input.s, t })
  }

  if (has('vE') && has('a') && has('t')) {
    const vA = toKmh(vEms + input.a * input.t)
    const s = vEms * input.t + 0.5 * input.a * Math.pow(input.t, 2)
    add({ vA, vE: input.vE, a: input.a, s, t: input.t })
  }

  if (has('vE') && has('s') && has('t')) {
    const vA = toKmh((2 * input.s) / input.t - vEms)
    const a = (toMs(vA) - vEms) / input.t
    add({ vA, vE: input.vE, a, s: input.s, t: input.t })
  }

  if (has('a') && has('s') && has('t')) {
    const vA = toKmh((input.s + 0.5 * input.a * Math.pow(input.t, 2)) / input.t)
    const vE = toKmh(toMs(vA) - input.a * input.t)
    add({ vA, vE, a: input.a, s: input.s, t: input.t })
  }

  return candidates.filter(candidate => candidateMatchesInput(candidate, input))
}

export const calculateDecel = (input: DecelInput): MovementResult => {
  const values = DECEL_KEYS.map(key => input[key])
  const enteredCount = values.filter(isEntered).length

  if (enteredCount === 0) {
    return {
      status: 'empty',
      message: 'Bitte Werte eingeben.',
    }
  }

  if (enteredCount < 3) {
    return {
      status: 'empty',
      message: 'Bitte mindestens drei Werte eingeben.',
    }
  }

  const candidate = decelCandidatesFromInput(input)[0]

  if (!candidate) {
    return {
      status: 'invalid',
      message: enteredCount > 3
        ? 'Die Werte widersprechen sich. Drei Werte genügen; überzählige Felder leeren.'
        : 'Die eingegebenen Werte sind physikalisch nicht möglich.',
    }
  }

  const vAms = toMs(candidate.vA)
  const endDuration = vAms / candidate.a
  const fullStopDistance = Math.pow(vAms, 2) / (2 * candidate.a)
  const distanceAtTime = (elapsedTime: number): number => {
    const elapsed = clamp(elapsedTime, 0, endDuration)
    return clamp(vAms * elapsed - 0.5 * candidate.a * elapsed * elapsed, 0, fullStopDistance)
  }

  return makeValidResult({
    mode: 'decel',
    distanceLabel: 'Bremsweg',
    duration: candidate.t,
    endDuration,
    distance: candidate.s,
    initialSpeedKmh: candidate.vA,
    finalSpeedKmh: candidate.vE,
    detailRows: [
      {
        label: 'Verzögerung',
        value: `-${formatNumber(candidate.a, 1)} m/s²`,
      },
      ...(endDuration > candidate.t + 0.001 ? [
        {
          label: 'bis Stillstand nach Kollision',
          value: `${formatNumber(endDuration - candidate.t)} s`,
        },
      ] : []),
    ],
    speedTicks: makeSpeedTicks({
      startSpeedKmh: candidate.vA,
      endSpeedKmh: 0,
      startTime: 0,
      acceleration: candidate.a,
      distanceAtTime,
      maxSpeedKmh: candidate.vA,
    }),
    distanceAtTime,
  })
}

interface DriveResolved {
  v: number
  s: number
  t: number
}

const validDriveCandidate = (candidate: DriveResolved): DriveResolved | null => {
  const values = [candidate.v, candidate.s, candidate.t]

  if (!values.every(Number.isFinite) || candidate.v <= 0 || candidate.s <= 0 || candidate.t <= 0) {
    return null
  }

  return candidate
}

const candidateMatchesDriveInput = (candidate: DriveResolved, input: DriveInput): boolean =>
  DRIVE_KEYS.every(key => !isEntered(input[key]) || isClose(candidate[key], input[key]))

const driveCandidatesFromInput = (input: DriveInput): DriveResolved[] => {
  const candidates: DriveResolved[] = []
  const has = (key: keyof DriveInput): boolean => isEntered(input[key])
  const add = (candidate: DriveResolved | null) => {
    if (!candidate) {
      return
    }

    const valid = validDriveCandidate(candidate)
    if (valid) {
      candidates.push(valid)
    }
  }

  if (has('v') && has('s')) {
    add({ v: input.v, s: input.s, t: input.s / toMs(input.v) })
  }

  if (has('v') && has('t')) {
    add({ v: input.v, s: toMs(input.v) * input.t, t: input.t })
  }

  if (has('s') && has('t')) {
    add({ v: toKmh(input.s / input.t), s: input.s, t: input.t })
  }

  return candidates.filter(candidate => candidateMatchesDriveInput(candidate, input))
}

export const calculateDrive = (input: DriveInput): MovementResult => {
  const values = DRIVE_KEYS.map(key => input[key])
  const enteredCount = values.filter(isEntered).length

  if (enteredCount === 0) {
    return {
      status: 'empty',
      message: 'Bitte Werte eingeben.',
    }
  }

  if (enteredCount < 2) {
    return {
      status: 'empty',
      message: 'Bitte mindestens zwei Werte eingeben.',
    }
  }

  const candidate = driveCandidatesFromInput(input)[0]

  if (!candidate) {
    return {
      status: 'invalid',
      message: enteredCount > 2
        ? 'Die Werte widersprechen sich. Zwei Werte genügen; überzähliges Feld leeren.'
        : 'Geschwindigkeit, Strecke und Dauer müssen größer als 0 sein.',
    }
  }

  const distanceAtTime = (elapsedTime: number): number => {
    const elapsed = clamp(elapsedTime, 0, candidate.t)
    return clamp(toMs(candidate.v) * elapsed, 0, candidate.s)
  }

  return makeValidResult({
    mode: 'drive',
    distanceLabel: 'Strecke',
    duration: candidate.t,
    distance: candidate.s,
    initialSpeedKmh: candidate.v,
    finalSpeedKmh: candidate.v,
    speedTicks: [
      {
        t: 0,
        s: 0,
        label: `${formatNumber(candidate.v, 0)}`,
        major: true,
      },
    ],
    distanceAtTime,
  })
}

export const calculateMovement = (input: MovementInput): MovementResult => {
  if (input.mode === 'stop') {
    return calculateStop(input.stop)
  }

  if (input.mode === 'drive') {
    return calculateDrive(input.drive)
  }

  return calculateDecel(input.decel)
}
