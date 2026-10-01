import { type MouseEvent as ReactMouseEvent, useMemo, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import SVG from '../assets/svg'
import StepperInput from '../components/StepperInput'
import {
  type DecelInput,
  type DiagramPoint,
  type DriveInput,
  type MovementInput,
  type MovementMode,
  type MovementResult,
  type StopInput,
  type ValidMovementResult,
  calculateMovement,
  clamp,
  formatNumber,
  makeStepTicks,
  roundUpToStep,
} from '../components/utilWegzeit'

type ApproachSide = 'left' | 'right'

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
const AFTER_COLLISION_OPACITY = 0.5

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
  t: NaN,
}

const DEFAULT_FIRST_STOP_INPUT: StopInput = {
  vA: 50,
  vE: 10,
  tR: 0.8,
  tS: 0.2,
  am: 7.5,
  t: NaN,
}

const DEFAULT_SECOND_STOP_INPUT: StopInput = {
  vA: 45,
  vE: 5,
  tR: 0.8,
  tS: 0.2,
  am: 5,
  t: NaN,
}

const DEFAULT_FIRST_DECEL_INPUT: DecelInput = {
  vA: 50,
  vE: 10,
  a: 7.5,
  s: NaN,
  t: NaN,
}

const DEFAULT_SECOND_DECEL_INPUT: DecelInput = {
  vA: 45,
  vE: 5,
  a: 5,
  s: NaN,
  t: NaN,
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
  t: NaN,
}

const DEFAULT_SECOND_DRIVE_INPUT: DriveInput = {
  v: 45,
  s: 25,
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
  {
    key: 't',
    label: 'Zeit bis Kollision',
    variable: SVG.tges,
    unit: SVG.s,
    step: 0.1,
    max: 60,
    placeholder: 't in s',
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

const oppositeSide = (side: ApproachSide): ApproachSide => side === 'left' ? 'right' : 'left'

const sideLabel = (side: ApproachSide): string => side === 'left' ? 'links' : 'rechts'

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
    ...validSeries.flatMap(item => item.result.afterPoints.map(point => Math.abs(point.s - item.result.distance))),
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

  const pointToPath = (item: ValidDiagramSeries, points: DiagramPoint[]): string => {
    const startDistance = signedStartDistance(item)

    return points
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
              {validSeries.some(item => item.result.afterPoints.length > 0) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 md:col-span-2">
                  <svg className="h-1.5 w-8" viewBox="0 0 32 6" aria-hidden="true">
                    <line x1="0" y1="3" x2="32" y2="3" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />
                  </svg>
                  <span>nach Kollision: theoretischer Verlauf bis Stillstand</span>
                </div>
              )}
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
                  const fullPath = pointToPath(item, [...item.result.points, ...item.result.afterPoints.slice(1)])

                  return (
                    <g key={item.id}>
                      {hoveredSeriesId === item.id && (
                        <path
                          d={fullPath}
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
                        d={pointToPath(item, item.result.points)}
                        fill="none"
                        stroke={item.stroke}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {item.result.afterPoints.length > 0 && (
                        <path
                          d={pointToPath(item, item.result.afterPoints)}
                          fill="none"
                          stroke={item.stroke}
                          strokeWidth="2"
                          strokeDasharray="5 5"
                          strokeLinejoin="round"
                          opacity={AFTER_COLLISION_OPACITY}
                        />
                      )}
                      <path
                        d={fullPath}
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
                        const isAfterCollision = tick.t > item.result.duration + 0.0005

                        return (
                          <g
                            key={`${item.id}-speed-tick-${index}`}
                            opacity={isAfterCollision ? AFTER_COLLISION_OPACITY : undefined}
                          >
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
