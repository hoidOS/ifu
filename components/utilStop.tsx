// Calculate reaction distance during reaction time before braking
export function getReaction(vA: number, tR: number): string {
    return ((vA / 3.6) * tR).toFixed(2).replace(".", ",") + ' m'
}

// Calculate distance traveled during brake delay/threshold time
export function getBreakDelay(vA: number, tS: number, am: number): string {
    return ((vA / 3.6) * tS - (0.5 * (am / 2) * Math.pow(tS, 2))).toFixed(2).replace(".", ",") + ' m'
}

// Calculate velocity at start of full braking (after brake threshold period)
export function getFullSend(vA: number, am: number, tS: number): string {
    return (((vA / 3.6) - (am / 2) * tS) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
}

// Calculate actual braking distance from full deceleration to end velocity
export function getBreakDistance(vA: number, tS: number, vE: number, am: number): string {
    return (
        (
            (Math.pow(((vA / 3.6) - (am / 2) * tS), 2)) - (Math.pow((vE / 3.6), 2))
        ) / (2 * am)
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate duration of the full braking phase
export function getBreakDuration(vA: number, tS: number, am: number, vE: number): string {
    return (
        (
            ((vA / 3.6) - (am / 2) * tS) - (vE / 3.6)
        ) / (am)
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate total stopping distance (reaction + brake delay + braking distance)
export function getFullDistance(vA: number, vE: number, tR: number, tS: number, am: number): string {
    return (
        ((vA / 3.6) * tR) + ((vA / 3.6) * tS - (0.5 * (am / 2) * Math.pow(tS, 2))) +
        (
            (Math.pow(((vA / 3.6) - (am / 2) * tS), 2)) - (Math.pow((vE / 3.6), 2))
        ) / (2 * am)

    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate total stopping time (reaction + brake delay + braking time)
export function getFullTime(vA: number, vE: number, tR: number, tS: number, am: number): string {
    return (
        tR + tS +
        (
            ((vA / 3.6) - (am / 2) * tS) - (vE / 3.6)
        ) / (am)
    ).toFixed(2).replace(".", ",") + ' s'
}