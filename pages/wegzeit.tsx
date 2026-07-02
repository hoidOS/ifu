import { type MouseEvent as ReactMouseEvent, useMemo, useState } from 'react'
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
}

interface SpeedTick extends DiagramPoint {
  major: boolean
}

interface MovementDetailRow {
  label: string
  value: string
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
  detailRows: MovementDetailRow[]
  markers: DiagramPoint[]
  speedTicks: SpeedTick[]
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
  side: ApproachSide
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

interface SelectedGuide {
  id: string
  seriesId: string
  elapsedTime: number
}

interface GuidePoint {
  x: number
  y: number
  position: number
  elapsedTime: number
  relativeTime: number
}

interface GuideRenderData {
  guide: SelectedGuide
  selectedSeries: ValidDiagramSeries
  selectedPoint: GuidePoint
  comparisonSeries?: ValidDiagramSeries
  comparisonPoint?: GuidePoint
  readoutItems: Array<{
    title: string
    stroke: string
    position: number
  }>
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

const DEFAULT_FIRST_STOP_INPUT: StopInput = {
  vA: 50,
  vE: 10,
  tR: 0.8,
  tS: 0.2,
  am: 7.5,
}

const DEFAULT_SECOND_STOP_INPUT: StopInput = {
  vA: 45,
  vE: 5,
  tR: 0.8,
  tS: 0.2,
  am: 5,
}

const DEFAULT_FIRST_DECEL_INPUT: DecelInput = {
  vA: 50,
  vE: 10,
  a: 7.5,
  s: 12.35,
  t: 1.48,
}

const DEFAULT_SECOND_DECEL_INPUT: DecelInput = {
  vA: 45,
  vE: 5,
  a: 5,
  s: 15.43,
  t: 2.22,
}

const EMPTY_DECEL_INPUT: DecelInput = {
  vA: NaN,
  vE: NaN,
  a: NaN,
  s: NaN,
  t: NaN,
}

const DEFAULT_FIRST_DRIVE_INPUT: DriveInput = {
  v: 50,
  s: 25,
  t: 1.8,
}

const DEFAULT_SECOND_DRIVE_INPUT: DriveInput = {
  v: 45,
  s: 25,
  t: 2,
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

const createDefaultMovementInput = ({
  stop,
  decel,
  drive,
}: {
  stop: StopInput
  decel: DecelInput
  drive: DriveInput
}): MovementInput => ({
  mode: 'stop',
  stop: { ...stop },
  decel: { ...decel },
  drive: { ...drive },
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
    detailRows: [
      {
        label: 'Reaktionsdauer tR',
        value: `${formatNumber(input.tR)} s`,
      },
      {
        label: 'Schwellzeit tS',
        value: `${formatNumber(input.tS)} s`,
      },
      {
        label: 'mittlere Verzögerung',
        value: `-${formatNumber(input.am, 1)} m/s²`,
      },
      ...(endDuration > duration + 0.001 ? [
        {
          label: 'bis Stillstand nach Kollision',
          value: `${formatNumber(endDuration - duration)} s`,
        },
      ] : []),
    ],
    markers: [
      {
        t: 0,
        s: 0,
        label: 'tR',
      },
      {
        t: input.tR,
        s: reactionDistance,
        label: 'tS',
      },
    ].filter(marker => marker.t >= 0 && marker.t < duration),
    speedTicks: [
      ...makeRampSpeedTicks({
        startSpeedKmh: input.vA,
        endSpeedKmh: toKmh(fullBrakeStartSpeed),
        startTime: input.tR,
        rampDuration: input.tS,
        acceleration: input.am,
        distanceAtTime,
      }),
      ...makeSpeedTicks({
        startSpeedKmh: toKmh(fullBrakeStartSpeed),
        endSpeedKmh: 0,
        startTime: input.tR + input.tS,
        acceleration: input.am,
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
  const resultRows = result.status === 'valid'
    ? [
      {
        label: `Startposition (${sideLabel(scenario.side)})`,
        value: `${formatNumber(scenario.side === 'left' ? -result.distance : result.distance)} m`,
      },
      ...result.detailRows,
    ]
    : []

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
          <div>
            <h2 className="text-lg font-semibold leading-tight">{scenario.title}</h2>
            <p className="text-xs font-medium text-white/80">{`von ${sideLabel(scenario.side)}`}</p>
          </div>
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
            <div>
              <p className="mb-2 font-semibold text-slate-800">Diagrammwerte</p>
              <dl className="grid gap-x-4 gap-y-2 text-slate-700 sm:grid-cols-2">
                {resultRows.map(row => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-slate-200 pb-1 last:border-b-0">
                    <dt>{row.label}</dt>
                    <dd className="whitespace-nowrap font-semibold text-primary-700">{row.value}</dd>
                  </div>
                ))}
              </dl>
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
  const [selectedGuides, setSelectedGuides] = useState<SelectedGuide[]>([])
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null)
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

  const elapsedToGuidePoint = (item: ValidDiagramSeries, elapsedTime: number): GuidePoint => {
    const elapsed = clamp(elapsedTime, 0, item.result.endDuration)
    const startDistance = signedStartDistance(item)
    const traveled = item.result.distanceAtTime(elapsed)
    const position = item.side === 'left'
      ? startDistance + traveled
      : startDistance - traveled
    const relativeTime = elapsed - item.result.duration

    return {
      x: xScale(position),
      y: yScale(relativeTime),
      position,
      elapsedTime: elapsed,
      relativeTime,
    }
  }

  const relativeTimeExistsOnSeries = (item: ValidDiagramSeries, relativeTime: number): boolean =>
    relativeTime >= -item.result.duration - 0.001
      && relativeTime <= item.result.endDuration - item.result.duration + 0.001

  const findNearestElapsedTime = (
    item: ValidDiagramSeries,
    target: { x: number; y: number },
  ): number => {
    const steps = 180
    let nearestElapsedTime = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    for (let index = 0; index <= steps; index += 1) {
      const elapsedTime = (item.result.endDuration * index) / steps
      const point = elapsedToGuidePoint(item, elapsedTime)
      const distance = Math.hypot(point.x - target.x, point.y - target.y)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestElapsedTime = elapsedTime
      }
    }

    return nearestElapsedTime
  }

  const svgPointFromEvent = (event: ReactMouseEvent<SVGPathElement>): {
    x: number
    y: number
  } | null => {
    const svg = event.currentTarget.ownerSVGElement
    const transform = svg?.getScreenCTM()

    if (!svg || !transform) {
      return null
    }

    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY

    return point.matrixTransform(transform.inverse())
  }

  const selectGuidePoint = (item: ValidDiagramSeries, event: ReactMouseEvent<SVGPathElement>) => {
    event.stopPropagation()

    const svgPoint = svgPointFromEvent(event)
    if (!svgPoint) {
      return
    }

    const elapsedTime = findNearestElapsedTime(item, svgPoint)

    setSelectedGuides(current => {
      const duplicate = current.some(guide =>
        guide.seriesId === item.id && Math.abs(guide.elapsedTime - elapsedTime) < 0.02,
      )

      if (duplicate) {
        return current
      }

      return [
        ...current,
        {
          id: `${item.id}-${elapsedTime.toFixed(3)}-${current.length}`,
          seriesId: item.id,
          elapsedTime,
        },
      ]
    })
  }

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

    const offset = 12
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

  const originX = xScale(0)
  const originY = yScale(0)
  const guideRenderData: GuideRenderData[] = selectedGuides
    .map<GuideRenderData | null>(guide => {
      const selectedSeries = validSeries.find(item => item.id === guide.seriesId)

      if (!selectedSeries) {
        return null
      }

      const selectedPoint = elapsedToGuidePoint(selectedSeries, guide.elapsedTime)
      const comparisonSeries = validSeries.find(item =>
        item.id !== selectedSeries.id && relativeTimeExistsOnSeries(item, selectedPoint.relativeTime),
      )
      const comparisonPoint = comparisonSeries
        ? elapsedToGuidePoint(comparisonSeries, comparisonSeries.result.duration + selectedPoint.relativeTime)
        : undefined

      return {
        guide,
        selectedSeries,
        selectedPoint,
        comparisonSeries,
        comparisonPoint,
        readoutItems: [
          {
            title: selectedSeries.title,
            stroke: selectedSeries.stroke,
            position: selectedPoint.position,
          },
          ...(comparisonPoint && comparisonSeries ? [
            {
              title: comparisonSeries.title,
              stroke: comparisonSeries.stroke,
              position: comparisonPoint.position,
            },
          ] : []),
        ],
      }
    })
    .filter((guide): guide is GuideRenderData => guide !== null)

  return (
    <div className="calculator-card xl:col-span-2">
      <div className="calculator-card-header">
        <h2 className="text-lg font-semibold">Weg-Zeit-Diagramm</h2>
        {guideRenderData.length > 0 && (
          <div className="order-last flex w-full flex-wrap items-center gap-2 text-sm text-white xl:order-none xl:w-auto">
            {guideRenderData.map(data => (
              <div
                key={data.guide.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-white/30 bg-white/10 px-3 py-1.5"
              >
                <span className="font-semibold">
                  {`t = ${formatNumber(-data.selectedPoint.relativeTime)} s`}
                </span>
                {data.readoutItems.map(item => (
                  <span key={item.title} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-6 rounded-full ring-1 ring-white/70"
                      style={{ backgroundColor: item.stroke }}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      {`: ${formatNumber(item.position)} m`}
                    </span>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedGuides(current => current.filter(guide => guide.id !== data.guide.id))}
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded border border-white/40 text-xs font-semibold leading-none text-white hover:bg-white hover:text-primary-700"
                  aria-label="Hilfslinie entfernen"
                  title="Hilfslinie entfernen"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex rounded-md border border-white bg-white/10 p-1 text-sm" aria-label="Anfahrtsseite KL">
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
              {`KL von ${sideLabel(side)}`}
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
              {validSeries.map(item => (
                <div key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className="h-1.5 w-8 rounded-full"
                    style={{ backgroundColor: item.stroke }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-slate-800">{`${item.title} (${item.result.modeLabel}) von ${sideLabel(item.side)}`}</span>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <svg
                role="img"
                aria-label="Weg-Zeit-Diagramm mit Kollisionspunkt im Ursprung"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="min-w-[720px] w-full rounded-lg border border-slate-200 bg-white"
                onClick={() => setSelectedGuides([])}
              >
                <rect
                  x={CHART_PADDING.left}
                  y={CHART_PADDING.top}
                  width={plotWidth}
                  height={plotHeight}
                  fill="#ffffff"
                />

                {yTicks.map(tick => (
                  <g key={`y-${tick}`}>
                    <line
                      x1={CHART_PADDING.left}
                      y1={yScale(tick)}
                      x2={CHART_WIDTH - CHART_PADDING.right}
                      y2={yScale(tick)}
                      stroke="#cbd5e1"
                      strokeWidth="0.7"
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
                      stroke="#cbd5e1"
                      strokeWidth="0.7"
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

                {guideRenderData.map(data => (
                  <g key={`${data.guide.id}-lines`} pointerEvents="none">
                    {data.comparisonPoint && (
                      <line
                        x1={data.selectedPoint.x}
                        y1={data.selectedPoint.y}
                        x2={data.comparisonPoint.x}
                        y2={data.comparisonPoint.y}
                        stroke="#94a3b8"
                        strokeWidth="1.4"
                        strokeDasharray="7 7"
                      />
                    )}
                    <line
                      x1={data.selectedPoint.x}
                      y1={data.selectedPoint.y}
                      x2={data.selectedPoint.x}
                      y2={originY}
                      stroke="#94a3b8"
                      strokeWidth="1.4"
                      strokeDasharray="7 7"
                    />
                    {data.comparisonPoint && (
                      <line
                        x1={data.comparisonPoint.x}
                        y1={data.comparisonPoint.y}
                        x2={data.comparisonPoint.x}
                        y2={originY}
                        stroke="#94a3b8"
                        strokeWidth="1.4"
                        strokeDasharray="7 7"
                      />
                    )}
                  </g>
                ))}

                {validSeries.map(item => {
                  const startDistance = signedStartDistance(item)
                  const startX = xScale(startDistance)
                  const startY = yScale(-item.result.duration)

                  return (
                    <g key={item.id}>
                      {hoveredSeriesId === item.id && (
                        <path
                          d={pointToPath(item)}
                          fill="none"
                          stroke={item.stroke}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.14"
                          pointerEvents="none"
                        />
                      )}
                      <path
                        d={pointToPath(item)}
                        fill="none"
                        stroke={item.stroke}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={pointToPath(item)}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0"
                        pointerEvents="stroke"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoveredSeriesId(item.id)}
                        onMouseLeave={() => setHoveredSeriesId(current => current === item.id ? null : current)}
                        onClick={event => selectGuidePoint(item, event)}
                      />
                      <circle cx={startX} cy={startY} r="5" fill={item.stroke} />
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
                        const showTickLabel = Boolean(tick.label)
                          && Math.abs(labelX - originX) > 18
                          && Math.abs(labelY - originY) > 18

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
                            {showTickLabel && (
                              <text
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                className="fill-slate-600 text-[11px] font-medium"
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
                          </g>
                        )
                      })}
                    </g>
                  )
                })}

                {guideRenderData.map(data => (
                  <g key={`${data.guide.id}-points`} pointerEvents="none">
                    <circle
                      cx={data.selectedPoint.x}
                      cy={data.selectedPoint.y}
                      r="4"
                      fill="#ffffff"
                      stroke={data.selectedSeries.stroke}
                      strokeWidth="1.8"
                    />
                    {data.comparisonPoint && data.comparisonSeries && (
                      <circle
                        cx={data.comparisonPoint.x}
                        cy={data.comparisonPoint.y}
                        r="4"
                        fill="#ffffff"
                        stroke={data.comparisonSeries.stroke}
                        strokeWidth="1.8"
                      />
                    )}
                  </g>
                ))}

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
  const [firstInput, setFirstInput] = useState<MovementInput>(() => createDefaultMovementInput({
    stop: DEFAULT_FIRST_STOP_INPUT,
    decel: DEFAULT_FIRST_DECEL_INPUT,
    drive: DEFAULT_FIRST_DRIVE_INPUT,
  }))
  const [secondInput, setSecondInput] = useState<MovementInput>(() => createDefaultMovementInput({
    stop: DEFAULT_SECOND_STOP_INPUT,
    decel: DEFAULT_SECOND_DECEL_INPUT,
    drive: DEFAULT_SECOND_DRIVE_INPUT,
  }))
  const [firstSide, setFirstSide] = useState<ApproachSide>('left')

  const firstResult = useMemo(() => calculateMovement(firstInput), [firstInput])
  const secondResult = useMemo(() => calculateMovement(secondInput), [secondInput])

  const scenarios: MovementScenario[] = [
    {
      id: 'movement-1',
      title: 'KL',
      colorClass: 'bg-primary-700',
      stroke: '#0059a9',
      side: firstSide,
      input: firstInput,
      setInput: setFirstInput,
    },
    {
      id: 'movement-2',
      title: 'BK',
      colorClass: 'bg-orange-700',
      stroke: '#c2410c',
      side: oppositeSide(firstSide),
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
              title: 'KL',
              stroke: '#0059a9',
              side: firstSide,
              result: firstResult,
            },
            {
              id: 'movement-2',
              title: 'BK',
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
