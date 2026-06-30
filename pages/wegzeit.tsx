import { useMemo, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import SVG from '../assets/svg'
import StepperInput from '../components/StepperInput'

type MovementMode = 'stop' | 'decel' | 'drive'
type ApproachSide = 'left' | 'right'

interface StopInput {
  vA: number
  vE: number
  tR: number
  tS: number
  am: number
}

interface DecelInput {
  vA: number
  vE: number
  a: number
  s: number
  t: number
}

interface DriveInput {
  v: number
  s: number
  t: number
}

interface MovementInput {
  mode: MovementMode
  stop: StopInput
  decel: DecelInput
  drive: DriveInput
}

interface DiagramPoint {
  t: number
  s: number
  label?: string
  oppositeLabel?: string
}

interface SpeedTick extends DiagramPoint {
  major: boolean
}

interface DiagramCurveLabel {
  startT: number
  endT: number
  label: string
  offsetY: number
}

interface ValidMovementResult {
  status: 'valid'
  mode: MovementMode
  modeLabel: string
  distanceLabel: string
  duration: number
  endDuration: number
  distance: number
  initialSpeedKmh: number
  finalSpeedKmh: number
  markers: DiagramPoint[]
  speedTicks: SpeedTick[]
  labels: DiagramCurveLabel[]
  points: DiagramPoint[]
  distanceAtTime: (elapsedTime: number) => number
}

interface InvalidMovementResult {
  status: 'empty' | 'invalid'
  message: string
}

type MovementResult = ValidMovementResult | InvalidMovementResult

interface MovementScenario {
  id: string
  title: string
  colorClass: string
  stroke: string
  input: MovementInput
  setInput: (input: MovementInput) => void
}

interface DiagramSeries {
  id: string
  title: string
  stroke: string
  side: ApproachSide
  result: MovementResult
}

type ValidDiagramSeries = DiagramSeries & {
  result: ValidMovementResult
}

interface TimeReferenceGuide {
  reference: ValidDiagramSeries
  comparison: ValidDiagramSeries
  referencePosition: number
  comparisonPosition: number
  relativeTime: number
}

interface NumericField<T extends string> {
  key: T
  label: string
  variable: string
  unit: string
  step: number
  max: number
  placeholder: string
}

const CHART_WIDTH = 900
const CHART_HEIGHT = 500
const CHART_PADDING = {
  top: 28,
  right: 34,
  bottom: 62,
  left: 76,
}

const EMPTY_STOP_INPUT: StopInput = {
  vA: NaN,
  vE: NaN,
  tR: NaN,
  tS: NaN,
  am: NaN,
}

const EMPTY_DECEL_INPUT: DecelInput = {
  vA: NaN,
  vE: NaN,
  a: NaN,
  s: NaN,
  t: NaN,
}

const EMPTY_DRIVE_INPUT: DriveInput = {
  v: NaN,
  s: NaN,
  t: NaN,
}

const createEmptyMovementInput = (mode: MovementMode = 'decel'): MovementInput => ({
  mode,
  stop: { ...EMPTY_STOP_INPUT },
  decel: { ...EMPTY_DECEL_INPUT },
  drive: { ...EMPTY_DRIVE_INPUT },
})

const MODE_LABELS: Record<MovementMode, string> = {
  stop: 'Anhaltevorgang',
  decel: 'konstante Verzögerung',
  drive: 'Konstantfahrt',
}

const MODE_OPTIONS: Array<{
  mode: MovementMode
  label: string
}> = [
  {
    mode: 'stop',
    label: 'Anhalt',
  },
  {
    mode: 'decel',
    label: 'konst. Verz.',
  },
  {
    mode: 'drive',
    label: 'Konstantfahrt',
  },
]

const STOP_FIELDS: Array<NumericField<keyof StopInput>> = [
  {
    key: 'vA',
    label: 'Anfangsgeschwindigkeit',
    variable: SVG.vA,
    unit: SVG.kmh,
    step: 1,
    max: 300,
    placeholder: 'v in km/h',
  },
  {
    key: 'vE',
    label: 'Endgeschwindigkeit',
    variable: SVG.vE,
    unit: SVG.kmh,
    step: 1,
    max: 300,
    placeholder: 'v in km/h',
  },
  {
    key: 'tR',
    label: 'Reaktionsdauer',
    variable: SVG.tR,
    unit: SVG.s,
    step: 0.1,
    max: 5,
    placeholder: 't in s',
  },
  {
    key: 'tS',
    label: 'Schwellzeit',
    variable: SVG.tS,
    unit: SVG.s,
    step: 0.1,
    max: 5,
    placeholder: 't in s',
  },
  {
    key: 'am',
    label: 'mittlere Verzögerung',
    variable: SVG.am,
    unit: SVG.ms2,
    step: 0.5,
    max: 20,
    placeholder: 'a in m/s²',
  },
]

const DECEL_FIELDS: Array<NumericField<keyof DecelInput>> = [
  {
    key: 'vA',
    label: 'Anfangsgeschwindigkeit',
    variable: SVG.vA,
    unit: SVG.kmh,
    step: 1,
    max: 300,
    placeholder: 'v in km/h',
  },
  {
    key: 'vE',
    label: 'Endgeschwindigkeit',
    variable: SVG.vE,
    unit: SVG.kmh,
    step: 1,
    max: 300,
    placeholder: 'v in km/h',
  },
  {
    key: 'a',
    label: 'Verzögerung',
    variable: SVG.a,
    unit: SVG.ms2,
    step: 0.5,
    max: 20,
    placeholder: 'a in m/s²',
  },
  {
    key: 's',
    label: 'Verzögerungsstrecke',
    variable: SVG.s,
    unit: SVG.m,
    step: 1,
    max: 1000,
    placeholder: 's in Meter',
  },
  {
    key: 't',
    label: 'Verzögerungsdauer',
    variable: SVG.t,
    unit: SVG.s,
    step: 0.1,
    max: 60,
    placeholder: 't in s',
  },
]

const DRIVE_FIELDS: Array<NumericField<keyof DriveInput>> = [
  {
    key: 'v',
    label: 'Geschwindigkeit',
    variable: SVG.v,
    unit: SVG.kmh,
    step: 1,
    max: 300,
    placeholder: 'v in km/h',
  },
  {
    key: 's',
    label: 'Strecke',
    variable: SVG.s,
    unit: SVG.m,
    step: 1,
    max: 1000,
    placeholder: 's in Meter',
  },
  {
    key: 't',
    label: 'Dauer',
    variable: SVG.t,
    unit: SVG.s,
    step: 0.1,
    max: 60,
    placeholder: 't in s',
  },
]

const isEntered = (value: number): boolean => Number.isFinite(value)

const toMs = (kmh: number): number => kmh / 3.6

const toKmh = (ms: number): number => ms * 3.6

const formatNumber = (value: number, digits = 2): string =>
  value.toFixed(digits).replace('.', ',')

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const roundUpToStep = (value: number, step: number): number =>
  Math.ceil(value / step) * step

const makeStepTicks = (min: number, max: number, step: number): number[] => {
  const ticks: number[] = []
  const start = Math.ceil(min / step) * step
  const end = Math.floor(max / step) * step
  const decimals = step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0

  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(decimals)))
  }

  return ticks
}

const oppositeSide = (side: ApproachSide): ApproachSide => side === 'left' ? 'right' : 'left'

const sideLabel = (side: ApproachSide): string => side === 'left' ? 'links' : 'rechts'

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
}: {
  startSpeedKmh: number
  endSpeedKmh: number
  startTime: number
  acceleration: number
  distanceAtTime: (elapsedTime: number) => number
}): SpeedTick[] => {
  const highestTick = Math.min(20, Math.floor(startSpeedKmh - 0.001))
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

function NumberInputTable<T extends string>({
  rows,
  input,
  onChange,
}: {
  rows: Array<NumericField<T>>
  input: Record<T, number>
  onChange: (key: T, value: number) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="calculator-table">
        <thead>
          <tr className="border-b-2 border-primary-700">
            <th className="text-primary-700 font-semibold text-left py-3 px-2">Art</th>
            <th className="text-primary-700 font-semibold text-center py-3 px-2">Var</th>
            <th className="text-primary-700 font-semibold text-center py-3 px-2">Eingabe</th>
            <th className="text-primary-700 font-semibold text-center py-3 px-2">Einheit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.key} className={index === rows.length - 1 ? 'calculator-row-last' : 'calculator-row'}>
              <td className="py-2 px-2 font-medium text-gray-700">{row.label}</td>
              <td className="py-2 px-2 text-center">
                <Image unoptimized src={row.variable} alt={row.key} className="inline-block h-auto w-auto max-w-full" />
              </td>
              <td className="py-2 px-2">
                <div className="flex justify-center">
                  <StepperInput
                    value={input[row.key]}
                    onChange={value => onChange(row.key, value)}
                    step={row.step}
                    min={0}
                    max={row.max}
                    placeholder={row.placeholder}
                    onWheel={event => event.currentTarget.blur()}
                    className="w-32"
                  />
                </div>
              </td>
              <td className="py-2 px-2 text-center">
                <Image unoptimized src={row.unit} alt={row.key} className="inline-block h-auto w-auto max-w-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const makeValidResult = ({
  mode,
  distanceLabel,
  duration,
  endDuration = duration,
  distance,
  initialSpeedKmh,
  finalSpeedKmh,
  markers = [],
  speedTicks = [],
  labels = [],
  distanceAtTime,
}: {
  mode: MovementMode
  distanceLabel: string
  duration: number
  endDuration?: number
  distance: number
  initialSpeedKmh: number
  finalSpeedKmh: number
  markers?: DiagramPoint[]
  speedTicks?: SpeedTick[]
  labels?: DiagramCurveLabel[]
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
    markers,
    speedTicks,
    labels,
    distanceAtTime,
    points: samplePoints(endDuration, distanceAtTime),
  }
}

const calculateStop = (input: StopInput): MovementResult => {
  const values = [input.vA, input.vE, input.tR, input.tS, input.am]

  if (!values.some(isEntered)) {
    return {
      status: 'empty',
      message: 'Bitte Werte eingeben.',
    }
  }

  if (!values.every(isEntered)) {
    return {
      status: 'empty',
      message: 'Bitte vA, vE, tR, tS und am vollständig eingeben.',
    }
  }

  if (input.vA < input.vE) {
    return {
      status: 'invalid',
      message: 'vA muss größer oder gleich vE sein.',
    }
  }

  if (input.vA < 0 || input.vE < 0 || input.tR < 0 || input.tS < 0 || input.am <= 0) {
    return {
      status: 'invalid',
      message: 'Geschwindigkeiten und Zeiten dürfen nicht negativ sein; am muss größer als 0 sein.',
    }
  }

  const vAms = toMs(input.vA)
  const vEms = toMs(input.vE)
  const rampDrop = 0.5 * input.am * input.tS
  const fullBrakeStartSpeed = vAms - rampDrop

  if (fullBrakeStartSpeed < vEms) {
    return {
      status: 'invalid',
      message: 'Die Schwellphase unterschreitet bereits die Endgeschwindigkeit.',
    }
  }

  const reactionDistance = vAms * input.tR
  const rampDistance = input.tS === 0
    ? 0
    : vAms * input.tS - (input.am * Math.pow(input.tS, 2)) / 6
  const fullBrakeDuration = (fullBrakeStartSpeed - vEms) / input.am
  const fullBrakeDistance = (Math.pow(fullBrakeStartSpeed, 2) - Math.pow(vEms, 2)) / (2 * input.am)
  const duration = input.tR + input.tS + fullBrakeDuration
  const distance = reactionDistance + rampDistance + fullBrakeDistance
  const fullStopBrakeDuration = fullBrakeStartSpeed / input.am
  const endDuration = input.tR + input.tS + fullStopBrakeDuration
  const fullStopDistance = reactionDistance + rampDistance + Math.pow(fullBrakeStartSpeed, 2) / (2 * input.am)

  const distanceAtTime = (elapsedTime: number): number => {
    const elapsed = clamp(elapsedTime, 0, endDuration)

    if (elapsed <= input.tR) {
      return vAms * elapsed
    }

    if (elapsed <= input.tR + input.tS) {
      const rampTime = elapsed - input.tR
      const rampProgress = input.tS === 0
        ? 0
        : vAms * rampTime - (input.am * Math.pow(rampTime, 3)) / (6 * input.tS)
      return reactionDistance + rampProgress
    }

    const brakeTime = elapsed - input.tR - input.tS
    return clamp(
      reactionDistance + rampDistance + fullBrakeStartSpeed * brakeTime - 0.5 * input.am * brakeTime * brakeTime,
      0,
      fullStopDistance,
    )
  }

  return makeValidResult({
    mode: 'stop',
    distanceLabel: 'Anhalteweg',
    duration,
    endDuration,
    distance,
    initialSpeedKmh: input.vA,
    finalSpeedKmh: input.vE,
    markers: [
      {
        t: 0,
        s: 0,
        label: 'tR',
        oppositeLabel: `${formatNumber(input.vA, 0)} km/h`,
      },
      {
        t: input.tR,
        s: reactionDistance,
        label: 'tS',
      },
      {
        t: input.tR + input.tS,
        s: reactionDistance + rampDistance,
        label: `-${formatNumber(input.am, 1)} m/s²`,
      },
    ].filter(marker => marker.t >= 0 && marker.t < duration),
    speedTicks: makeSpeedTicks({
      startSpeedKmh: toKmh(fullBrakeStartSpeed),
      endSpeedKmh: 0,
      startTime: input.tR + input.tS,
      acceleration: input.am,
      distanceAtTime,
    }),
    labels: [],
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
  DECEL_FIELDS.every(field => !isEntered(input[field.key]) || isClose(candidate[field.key], input[field.key]))

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

const calculateDecel = (input: DecelInput): MovementResult => {
  const values = DECEL_FIELDS.map(field => input[field.key])
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
      message: 'Die eingegebenen Werte sind nicht konsistent oder physikalisch nicht möglich.',
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
    speedTicks: makeSpeedTicks({
      startSpeedKmh: candidate.vA,
      endSpeedKmh: 0,
      startTime: 0,
      acceleration: candidate.a,
      distanceAtTime,
    }),
    labels: [
      {
        label: `a = -${formatNumber(candidate.a, 1)} m/s²`,
        startT: candidate.t * 0.18,
        endT: candidate.t * 0.72,
        offsetY: 28,
      },
    ],
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
  DRIVE_FIELDS.every(field => !isEntered(input[field.key]) || isClose(candidate[field.key], input[field.key]))

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

const calculateDrive = (input: DriveInput): MovementResult => {
  const values = DRIVE_FIELDS.map(field => input[field.key])
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
      message: 'Die eingegebenen Werte sind nicht konsistent oder unvollständig.',
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
    distanceAtTime,
  })
}

const calculateMovement = (input: MovementInput): MovementResult => {
  if (input.mode === 'stop') {
    return calculateStop(input.stop)
  }

  if (input.mode === 'drive') {
    return calculateDrive(input.drive)
  }

  return calculateDecel(input.decel)
}

function MovementInputCard({ scenario }: { scenario: MovementScenario }) {
  const result = calculateMovement(scenario.input)

  const setMode = (mode: MovementMode) => {
    scenario.setInput({
      ...scenario.input,
      mode,
    })
  }

  const reset = () => {
    scenario.setInput(createEmptyMovementInput(scenario.input.mode))
  }

  return (
    <div className="calculator-card">
      <div className="calculator-card-header">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${scenario.colorClass}`} aria-hidden="true" />
          <h2 className="text-lg font-semibold">{scenario.title}</h2>
        </div>
        <button
          onClick={reset}
          className="calculator-header-button"
          title="Alle Eingaben zurücksetzen"
        >
          Reset
        </button>
      </div>
      <div className="p-4">
        <div className="mb-4 flex flex-wrap rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm">
          {MODE_OPTIONS.map(option => (
            <button
              key={option.mode}
              type="button"
              onClick={() => setMode(option.mode)}
              className={`rounded-md px-3 py-2 font-medium transition-colors ${
                scenario.input.mode === option.mode
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-primary-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {scenario.input.mode === 'stop' && (
          <NumberInputTable
            rows={STOP_FIELDS}
            input={scenario.input.stop}
            onChange={(key, value) => {
              scenario.setInput({
                ...scenario.input,
                stop: {
                  ...scenario.input.stop,
                  [key]: value,
                },
              })
            }}
          />
        )}

        {scenario.input.mode === 'decel' && (
          <NumberInputTable
            rows={DECEL_FIELDS}
            input={scenario.input.decel}
            onChange={(key, value) => {
              scenario.setInput({
                ...scenario.input,
                decel: {
                  ...scenario.input.decel,
                  [key]: value,
                },
              })
            }}
          />
        )}

        {scenario.input.mode === 'drive' && (
          <NumberInputTable
            rows={DRIVE_FIELDS}
            input={scenario.input.drive}
            onChange={(key, value) => {
              scenario.setInput({
                ...scenario.input,
                drive: {
                  ...scenario.input.drive,
                  [key]: value,
                },
              })
            }}
          />
        )}

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          {result.status === 'valid' ? (
            <div className="grid gap-2 text-slate-700 sm:grid-cols-2">
              <p>
                Zeit bis Kollision:{' '}
                <span className="font-semibold text-primary-700">
                  {formatNumber(result.duration)} s
                </span>
              </p>
              <p>
                {result.distanceLabel}:{' '}
                <span className="font-semibold text-primary-700">
                  {formatNumber(result.distance)} m
                </span>
              </p>
              <p>
                Geschwindigkeit bei Kollision:{' '}
                <span className="font-semibold text-primary-700">
                  {formatNumber(result.finalSpeedKmh)} km/h
                </span>
              </p>
            </div>
          ) : (
            <p className={result.status === 'invalid' ? 'font-medium text-red-600' : 'text-slate-500'}>
              {result.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function WegZeitDiagram({
  series,
  firstSide,
  onFirstSideChange,
}: {
  series: DiagramSeries[]
  firstSide: ApproachSide
  onFirstSideChange: (side: ApproachSide) => void
}) {
  const validSeries = series.filter((item): item is ValidDiagramSeries => item.result.status === 'valid')
  const hasSeries = validSeries.length > 0
  const maxDuration = Math.max(0, ...validSeries.map(item => item.result.duration))
  const maxAfterDuration = Math.max(0, ...validSeries.map(item => item.result.endDuration - item.result.duration))
  const maxDistance = Math.max(
    0,
    ...validSeries.flatMap(item => item.result.points.map(point => Math.abs(point.s - item.result.distance))),
    ...validSeries.map(item => item.result.distance),
  )
  const rawDistanceLimit = maxDistance > 0 ? maxDistance * 1.15 : 10
  const distanceRoundStep = rawDistanceLimit > 30 ? 10 : 5
  const distanceLimit = Math.max(10, roundUpToStep(rawDistanceLimit, distanceRoundStep))
  const distanceGridStep = distanceLimit > 30 ? 20 : 10
  const timeBeforeLimit = Math.max(1, roundUpToStep(maxDuration > 0 ? maxDuration * 1.12 : 1, 1))
  const timeAfterLimit = Math.max(1, roundUpToStep(maxAfterDuration > 0 ? maxAfterDuration * 1.12 : timeBeforeLimit * 0.2, 1))
  const xMin = -distanceLimit
  const xMax = distanceLimit
  const yMin = -timeBeforeLimit
  const yMax = timeAfterLimit
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
  const xTicks = makeStepTicks(xMin, xMax, distanceGridStep)
  const yTicks = makeStepTicks(yMin, yMax, 1)
  const xRulerTicks = makeStepTicks(xMin, xMax, 1)
  const yRulerTicks = makeStepTicks(yMin, yMax, 0.1)

  const xScale = (value: number): number =>
    CHART_PADDING.left + ((value - xMin) / (xMax - xMin)) * plotWidth

  const yScale = (value: number): number =>
    CHART_PADDING.top + ((value - yMin) / (yMax - yMin)) * plotHeight

  const formatDistanceTick = (value: number): string =>
    `${formatNumber(value, 0)} m`

  const formatTimeTick = (value: number): string => {
    const displayedValue = Math.abs(value) < 0.001 ? 0 : -value
    return `${formatNumber(displayedValue, 0)} s`
  }

  const signedStartDistance = (item: ValidDiagramSeries): number =>
    item.side === 'left' ? -item.result.distance : item.result.distance

  const getTimeReferenceGuide = (): TimeReferenceGuide | null => {
    if (validSeries.length < 2) {
      return null
    }

    const first = validSeries[0]
    const second = validSeries[1]

    if (!first || !second) {
      return null
    }

    if (Math.abs(first.result.duration - second.result.duration) < 0.01) {
      return null
    }

    const reference = first.result.duration < second.result.duration ? first : second
    const comparison = reference.id === first.id ? second : first
    const comparisonElapsedTime = comparison.result.duration - reference.result.duration
    const comparisonTravel = comparison.result.distanceAtTime(comparisonElapsedTime)
    const comparisonStart = signedStartDistance(comparison)
    const comparisonPosition = comparison.side === 'left'
      ? comparisonStart + comparisonTravel
      : comparisonStart - comparisonTravel

    return {
      reference,
      comparison,
      referencePosition: signedStartDistance(reference),
      comparisonPosition,
      relativeTime: -reference.result.duration,
    }
  }

  const pointToPath = (item: ValidDiagramSeries): string => {
    const startDistance = signedStartDistance(item)

    return item.result.points
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L'
        const position = item.side === 'left'
          ? startDistance + point.s
          : startDistance - point.s
        const time = point.t - item.result.duration

        return `${command} ${xScale(position).toFixed(2)} ${yScale(time).toFixed(2)}`
      })
      .join(' ')
  }

  const pointToSignedPosition = (item: ValidDiagramSeries, point: DiagramPoint): {
    x: number
    y: number
  } => {
    const startDistance = signedStartDistance(item)
    const position = item.side === 'left'
      ? startDistance + point.s
      : startDistance - point.s
    const time = point.t - item.result.duration

    return {
      x: xScale(position),
      y: yScale(time),
    }
  }

  const elapsedToSignedPosition = (item: ValidDiagramSeries, elapsedTime: number): {
    x: number
    y: number
  } => pointToSignedPosition(item, {
    t: elapsedTime,
    s: item.result.distanceAtTime(elapsedTime),
  })

  const markerLabelPosition = (
    item: ValidDiagramSeries,
    marker: DiagramPoint,
    side: 1 | -1,
  ): {
    x: number
    y: number
    textAnchor: 'start' | 'end'
  } => {
    const markerPosition = pointToSignedPosition(item, marker)
    const sampleStep = Math.max(item.result.duration * 0.025, 0.05)
    const sampleTime = marker.t + sampleStep <= item.result.duration
      ? marker.t + sampleStep
      : Math.max(marker.t - sampleStep, 0)
    const samplePosition = elapsedToSignedPosition(item, sampleTime)
    const dx = samplePosition.x - markerPosition.x
    const dy = samplePosition.y - markerPosition.y
    const length = Math.hypot(dx, dy) || 1
    let normalX = -dy / length
    let normalY = dx / length

    if (normalY > 0) {
      normalX *= -1
      normalY *= -1
    }

    const offset = 18
    const x = clamp(markerPosition.x + normalX * offset * side, CHART_PADDING.left + 8, CHART_WIDTH - CHART_PADDING.right - 8)
    const y = clamp(markerPosition.y + normalY * offset * side + 4, CHART_PADDING.top + 12, CHART_PADDING.top + plotHeight - 8)

    return {
      x,
      y,
      textAnchor: x >= markerPosition.x ? 'start' : 'end',
    }
  }

  const tangentNormalAtTime = (item: ValidDiagramSeries, elapsedTime: number): {
    normalX: number
    normalY: number
  } => {
    const markerPosition = elapsedToSignedPosition(item, elapsedTime)
    const sampleStep = Math.max(item.result.duration * 0.015, 0.03)
    const sampleTime = elapsedTime + sampleStep <= item.result.duration
      ? elapsedTime + sampleStep
      : Math.max(elapsedTime - sampleStep, 0)
    const samplePosition = elapsedToSignedPosition(item, sampleTime)
    const dx = samplePosition.x - markerPosition.x
    const dy = samplePosition.y - markerPosition.y
    const length = Math.hypot(dx, dy) || 1
    let normalX = -dy / length
    let normalY = dx / length

    if (normalY < 0) {
      normalX *= -1
      normalY *= -1
    }

    return {
      normalX,
      normalY,
    }
  }

  const labelPath = (item: ValidDiagramSeries, label: DiagramCurveLabel): string => {
    const steps = 18
    const points = Array.from({ length: steps + 1 }, (_, index) => {
      const elapsed = label.startT + ((label.endT - label.startT) * index) / steps
      const traveled = item.result.distanceAtTime(elapsed)
      const position = item.side === 'left'
        ? signedStartDistance(item) + traveled
        : signedStartDistance(item) - traveled
      const relativeTime = elapsed - item.result.duration

      return {
        x: xScale(position),
        y: clamp(yScale(relativeTime) + label.offsetY, CHART_PADDING.top + 14, CHART_PADDING.top + plotHeight - 14),
      }
    })

    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const readablePoints = firstPoint && lastPoint && firstPoint.x > lastPoint.x
      ? [...points].reverse()
      : points

    return readablePoints
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L'
        return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
      })
      .join(' ')
  }

  const originX = xScale(0)
  const originY = yScale(0)
  const timeReferenceGuide = getTimeReferenceGuide()

  return (
    <div className="calculator-card xl:col-span-2">
      <div className="calculator-card-header">
        <h2 className="text-lg font-semibold">Weg-Zeit-Diagramm</h2>
        <div className="flex rounded-md border border-white bg-white/10 p-1 text-sm" aria-label="Anfahrtsseite Bewegung 1">
          {(['left', 'right'] as ApproachSide[]).map(side => (
            <button
              key={side}
              type="button"
              onClick={() => onFirstSideChange(side)}
              className={`rounded px-3 py-1.5 font-medium transition-colors ${
                firstSide === side
                  ? 'bg-white text-primary-700'
                  : 'text-white hover:bg-primary-800'
              }`}
            >
              {`1 von ${sideLabel(side)}`}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {!hasSeries ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-slate-500">
            Sobald mindestens ein Eingabesatz vollständig und gültig ist, wird hier das Diagramm gezeichnet.
          </div>
        ) : (
          <>
            <div className="mb-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              {validSeries.map(item => {
                const startDistance = signedStartDistance(item)

                return (
                  <div key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className="h-1.5 w-8 rounded-full"
                      style={{ backgroundColor: item.stroke }}
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-slate-800">{`${item.title} (${item.result.modeLabel}) von ${sideLabel(item.side)}`}</span>
                    <span>{`Start: ${formatNumber(startDistance)} m`}</span>
                    <span>{`Zeit bis Kollision: ${formatNumber(item.result.duration)} s`}</span>
                    <span>{`${item.result.distanceLabel}: ${formatNumber(item.result.distance)} m`}</span>
                  </div>
                )
              })}
            </div>
            {timeReferenceGuide && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <span className="font-semibold text-slate-800">Zeitvergleich: </span>
                {`Bei Start ${timeReferenceGuide.reference.title} war ${timeReferenceGuide.comparison.title} bei ${formatNumber(timeReferenceGuide.comparisonPosition)} m.`}
              </div>
            )}
            <div className="overflow-x-auto">
              <svg
                role="img"
                aria-label="Weg-Zeit-Diagramm mit Kollisionspunkt im Ursprung"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="min-w-[720px] w-full rounded-lg border border-slate-200 bg-white"
              >
                <rect
                  x={CHART_PADDING.left}
                  y={CHART_PADDING.top}
                  width={plotWidth}
                  height={plotHeight}
                  fill="#ffffff"
                />
                <defs>
                  {validSeries.flatMap(item => item.result.labels.map((label, index) => (
                    <path
                      key={`${item.id}-curve-label-path-${index}`}
                      id={`${item.id}-curve-label-path-${index}`}
                      d={labelPath(item, label)}
                    />
                  )))}
                </defs>

                {yTicks.map(tick => (
                  <g key={`y-${tick}`}>
                    <line
                      x1={CHART_PADDING.left}
                      y1={yScale(tick)}
                      x2={CHART_WIDTH - CHART_PADDING.right}
                      y2={yScale(tick)}
                      stroke="#94a3b8"
                      strokeWidth="0.8"
                    />
                    <text
                      x={CHART_PADDING.left - 12}
                      y={yScale(tick) + 4}
                      textAnchor="end"
                      className="fill-slate-900 text-[13px] font-semibold"
                    >
                      {formatTimeTick(tick)}
                    </text>
                    <text
                      x={CHART_WIDTH - CHART_PADDING.right + 12}
                      y={yScale(tick) + 4}
                      textAnchor="start"
                      className="fill-slate-900 text-[13px] font-semibold"
                    >
                      {formatTimeTick(tick)}
                    </text>
                  </g>
                ))}

                {xTicks.map(tick => (
                  <g key={`x-${tick}`}>
                    <line
                      x1={xScale(tick)}
                      y1={CHART_PADDING.top}
                      x2={xScale(tick)}
                      y2={CHART_PADDING.top + plotHeight}
                      stroke="#94a3b8"
                      strokeWidth="0.8"
                    />
                    <text
                      x={xScale(tick)}
                      y={CHART_PADDING.top - 12}
                      textAnchor="middle"
                      className="fill-slate-900 text-[13px] font-semibold"
                    >
                      {formatDistanceTick(tick)}
                    </text>
                    <text
                      x={xScale(tick)}
                      y={CHART_HEIGHT - CHART_PADDING.bottom + 28}
                      textAnchor="middle"
                      className="fill-slate-900 text-[13px] font-semibold"
                    >
                      {formatDistanceTick(tick)}
                    </text>
                  </g>
                ))}

                <rect
                  x={CHART_PADDING.left}
                  y={CHART_PADDING.top}
                  width={plotWidth}
                  height={plotHeight}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="0.8"
                />

                <line
                  x1={CHART_PADDING.left}
                  y1={originY}
                  x2={CHART_WIDTH - CHART_PADDING.right}
                  y2={originY}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <line
                  x1={originX}
                  y1={CHART_PADDING.top}
                  x2={originX}
                  y2={CHART_PADDING.top + plotHeight}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                {xRulerTicks.map(tick => {
                  const roundedTick = Math.round(tick)
                  const isMajor = roundedTick % 5 === 0
                  const tickLength = isMajor ? 14 : 8

                  return (
                    <line
                      key={`x-ruler-${tick}`}
                      x1={xScale(tick)}
                      y1={originY - tickLength}
                      x2={xScale(tick)}
                      y2={originY + tickLength}
                      stroke="#0f172a"
                      strokeWidth={isMajor ? '0.9' : '0.7'}
                    />
                  )
                })}
                {yRulerTicks.map(tick => {
                  const roundedTick = Math.round(tick * 10)
                  const isMajor = roundedTick % 5 === 0
                  const tickLength = isMajor ? 12 : 7

                  return (
                    <line
                      key={`y-ruler-${tick}`}
                      x1={originX - tickLength}
                      y1={yScale(tick)}
                      x2={originX + tickLength}
                      y2={yScale(tick)}
                      stroke="#0f172a"
                      strokeWidth={isMajor ? '0.9' : '0.7'}
                    />
                  )
                })}
                {timeReferenceGuide && (
                  <g>
                    <line
                      x1={xScale(timeReferenceGuide.referencePosition)}
                      y1={yScale(timeReferenceGuide.relativeTime)}
                      x2={xScale(timeReferenceGuide.comparisonPosition)}
                      y2={yScale(timeReferenceGuide.relativeTime)}
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeDasharray="7 7"
                    />
                    <line
                      x1={xScale(timeReferenceGuide.referencePosition)}
                      y1={yScale(timeReferenceGuide.relativeTime)}
                      x2={xScale(timeReferenceGuide.referencePosition)}
                      y2={originY}
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeDasharray="7 7"
                    />
                    <line
                      x1={xScale(timeReferenceGuide.comparisonPosition)}
                      y1={yScale(timeReferenceGuide.relativeTime)}
                      x2={xScale(timeReferenceGuide.comparisonPosition)}
                      y2={originY}
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeDasharray="7 7"
                    />
                  </g>
                )}

                {validSeries.map(item => {
                  const startDistance = signedStartDistance(item)
                  const startX = xScale(startDistance)
                  const startY = yScale(-item.result.duration)
                  const speedLabelX = startX + (item.side === 'left' ? 10 : -10)
                  const speedLabelY = Math.max(startY - 10, CHART_PADDING.top + 16)
                  const speedTextAnchor = item.side === 'left' ? 'start' : 'end'

                  return (
                    <g key={item.id}>
                      <path
                        d={pointToPath(item)}
                        fill="none"
                        stroke={item.stroke}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx={startX} cy={startY} r="5" fill={item.stroke} />
                      {item.result.mode !== 'stop' && (
                        <text
                          x={speedLabelX}
                          y={speedLabelY}
                          textAnchor={speedTextAnchor}
                          className="fill-slate-700 text-[12px] font-semibold"
                        >
                          {`v = ${formatNumber(item.result.initialSpeedKmh, 0)} km/h`}
                        </text>
                      )}
                      {item.result.speedTicks.map((tick, index) => {
                        const tickPosition = pointToSignedPosition(item, tick)
                        const { normalX, normalY } = tangentNormalAtTime(item, tick.t)
                        const tickLength = tick.major ? 10 : 5
                        const labelOffset = tickLength + 15
                        const x1 = tickPosition.x
                        const y1 = tickPosition.y
                        const x2 = tickPosition.x + normalX * tickLength
                        const y2 = tickPosition.y + normalY * tickLength
                        const labelX = tickPosition.x + normalX * labelOffset
                        const labelY = tickPosition.y + normalY * labelOffset + 4

                        return (
                          <g key={`${item.id}-speed-tick-${index}`}>
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={item.stroke}
                              strokeWidth={tick.major ? '1.4' : '0.8'}
                            />
                            {tick.label && (
                              <text
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                className="fill-slate-700 text-[12px] font-semibold"
                              >
                                {tick.label}
                              </text>
                            )}
                          </g>
                        )
                      })}
                      {item.result.markers.map((marker, index) => {
                        const markerPosition = pointToSignedPosition(item, marker)
                        const labelPosition = markerLabelPosition(item, marker, 1)
                        const oppositeLabelPosition = markerLabelPosition(item, marker, -1)

                        return (
                          <g key={`${item.id}-marker-${index}`}>
                            <circle
                              cx={markerPosition.x}
                              cy={markerPosition.y}
                              r="4"
                              fill="#ffffff"
                              stroke={item.stroke}
                              strokeWidth="2.5"
                            />
                            {marker.label && (
                              <text
                                x={labelPosition.x}
                                y={labelPosition.y}
                                textAnchor={labelPosition.textAnchor}
                                className="fill-slate-700 text-[12px] font-semibold"
                              >
                                {marker.label}
                              </text>
                            )}
                            {marker.oppositeLabel && (
                              <text
                                x={oppositeLabelPosition.x}
                                y={oppositeLabelPosition.y}
                                textAnchor={oppositeLabelPosition.textAnchor}
                                className="fill-slate-700 text-[12px] font-semibold"
                              >
                                {marker.oppositeLabel}
                              </text>
                            )}
                          </g>
                        )
                      })}
                      {item.result.labels.map((label, index) => {
                        return (
                          <text
                            key={`${item.id}-label-${index}`}
                            className="fill-slate-700 text-[12px] font-semibold"
                          >
                            <textPath href={`#${item.id}-curve-label-path-${index}`} startOffset="50%" textAnchor="middle">
                              {label.label}
                            </textPath>
                          </text>
                        )
                      })}
                    </g>
                  )
                })}

                {timeReferenceGuide && (
                  <circle
                    cx={xScale(timeReferenceGuide.comparisonPosition)}
                    cy={yScale(timeReferenceGuide.relativeTime)}
                    r="6"
                    fill="#ffffff"
                    stroke={timeReferenceGuide.comparison.stroke}
                    strokeWidth="3"
                  />
                )}

                <text
                  x={CHART_PADDING.left + plotWidth / 2}
                  y={CHART_HEIGHT - 16}
                  textAnchor="middle"
                  className="fill-slate-700 text-[14px] font-semibold"
                >
                  Weg relativ zur Kollision s [m]
                </text>
                <text
                  transform={`translate(22 ${CHART_PADDING.top + plotHeight / 2}) rotate(-90)`}
                  textAnchor="middle"
                  className="fill-slate-700 text-[14px] font-semibold"
                >
                  Zeit vor/nach Kollision t [s]
                </text>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Wegzeit() {
  const [firstInput, setFirstInput] = useState<MovementInput>(createEmptyMovementInput('decel'))
  const [secondInput, setSecondInput] = useState<MovementInput>(createEmptyMovementInput('decel'))
  const [firstSide, setFirstSide] = useState<ApproachSide>('left')

  const firstResult = useMemo(() => calculateMovement(firstInput), [firstInput])
  const secondResult = useMemo(() => calculateMovement(secondInput), [secondInput])

  const scenarios: MovementScenario[] = [
    {
      id: 'movement-1',
      title: 'Bewegung 1',
      colorClass: 'bg-primary-700',
      stroke: '#0059a9',
      input: firstInput,
      setInput: setFirstInput,
    },
    {
      id: 'movement-2',
      title: 'Bewegung 2',
      colorClass: 'bg-orange-700',
      stroke: '#c2410c',
      input: secondInput,
      setInput: setSecondInput,
    },
  ]

  return (
    <>
      <Head>
        <title>PPCAVS | Weg-Zeit-Diagramm</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
      </Head>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 xl:grid-cols-2">
        {scenarios.map(scenario => (
          <MovementInputCard key={scenario.id} scenario={scenario} />
        ))}

        <WegZeitDiagram
          firstSide={firstSide}
          onFirstSideChange={setFirstSide}
          series={[
            {
              id: 'movement-1',
              title: 'Bewegung 1',
              stroke: '#0059a9',
              side: firstSide,
              result: firstResult,
            },
            {
              id: 'movement-2',
              title: 'Bewegung 2',
              stroke: '#c2410c',
              side: oppositeSide(firstSide),
              result: secondResult,
            },
          ]}
        />
      </div>
    </>
  )
}

export default Wegzeit
