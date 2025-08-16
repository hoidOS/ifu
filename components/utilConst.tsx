// Calculate speed from distance and time (converts to km/h)
export function getSpeed(s: number, t: number): string {
    return ((s / t) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
}

// Calculate distance from velocity and time (converts km/h to m/s)
export function getDistance(v: number, t: number): string {
    return ((v / 3.6) * t).toFixed(2).replace(".", ",") + ' m'
}

// Calculate time from distance and velocity
export function getTime(s: number, v: number): string {
    return (s / (v / 3.6)).toFixed(2).replace(".", ",") + ' s'
}

// Calculate initial velocity from end velocity, acceleration and distance (deceleration case)
export function getdVA1(vE: number, a: number, s: number): string {
    return (
        (3.6 * Math.sqrt((2 * a * s) + (Math.pow(vE / 3.6, 2)))).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from end velocity, acceleration and time (deceleration case)
export function getdVA2(vE: number, a: number, t: number): string {
    return (
        (3.6 * ((vE / 3.6) + a * t)).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from end velocity, distance and time (deceleration case)
export function getdVA3(vE: number, s: number, t: number): string {
    return (
        (((2 * (s / t)) - (vE / 3.6)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from acceleration, distance and time (deceleration case)
export function getdVA4(a: number, s: number, t: number): string {
    return (
        (((s + 0.5 * a * Math.pow(t, 2)) / t) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, acceleration and distance (deceleration case)
export function getdVE1(vA: number, a: number, s: number): string {
    return (
        ((Math.sqrt((Math.pow((vA / 3.6), 2) - 2 * a * s))) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, acceleration and time (deceleration case)
export function getdVE2(vA: number, a: number, t: number): string {
    return (
        (((vA / 3.6) - (a * t)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, distance and time (deceleration case)
export function getdVE3(vA: number, s: number, t: number): string {
    return (
        ((((2 * s) / t) - (vA / 3.6)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from acceleration, distance and time (deceleration case)
export function getdVE4(a: number, s: number, t: number): string {
    return (
        (((s / t) - (0.5 * a * t)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate deceleration from initial velocity, end velocity and distance
export function getDecel1(vA: number, vE: number, s: number): string {
    return (
        (
            (Math.pow((vA / 3.6), 2) - Math.pow((vE / 3.6), 2)) / (2 * s)
        ).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate deceleration from initial velocity, end velocity and time
export function getDecel2(vA: number, vE: number, t: number): string {
    return (
        (((vA / 3.6) - (vE / 3.6)) / t).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate deceleration from initial velocity, distance and time
export function getDecel3(vA: number, s: number, t: number): string {
    return (
        ((2 * ((vA / 3.6) * t - s) / Math.pow(t, 2))).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate deceleration from end velocity, distance and time
export function getDecel4(vE: number, s: number, t: number): string {
    return (
        ((2 / t) * ((s / t) - (vE / 3.6))).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate braking distance from initial velocity, end velocity and acceleration
export function getBD1(vA: number, vE: number, a: number): string {
    return (
        (Math.pow((vA / 3.6), 2) - Math.pow((vE / 3.6), 2)) /
        (
            2 * a
        )
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate braking distance from initial velocity, end velocity and time
export function getBD2(vA: number, vE: number, t: number): string {
    return (
        (((vA / 3.6) + (vE / 3.6)) / 2) * t
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate braking distance from initial velocity, acceleration and time
export function getBD3(vA: number, a: number, t: number): string {
    return (
        ((vA / 3.6) * t - 0.5 * a * Math.pow(t, 2))
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate braking distance from end velocity, acceleration and time
export function getBD4(vE: number, a: number, t: number): string {
    return (
        ((vE / 3.6) * t + 0.5 * a * Math.pow(t, 2))
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate braking time from initial velocity, end velocity and acceleration
export function getBT1(vA: number, vE: number, a: number): string {
    return (
        (
            ((vA / 3.6) - (vE / 3.6)) / a
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate braking time from initial velocity, end velocity and distance
export function getBT2(vA: number, vE: number, s: number): string {
    return (
        (
            ((2 * s) / ((vA / 3.6) + (vE / 3.6)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate braking time from initial velocity, acceleration and distance
export function getBT3(vA: number, a: number, s: number): string {
    return (
        (
            ((vA / 3.6) / a) - (Math.sqrt((Math.pow((vA / 3.6), 2) / Math.pow(a, 2)) - (2 * s / a)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate braking time from end velocity, acceleration and distance
export function getBT4(vE: number, a: number, s: number): string {
    return (
        (
            (-(vE / 3.6) / a) + (Math.sqrt((Math.pow((vE / 3.6), 2) / Math.pow(a, 2)) + (2 * s / a)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}


// Calculate initial velocity from end velocity, acceleration and distance (acceleration case)
export function getaVA1(vE: number, a: number, s: number): string {
    return (
        (3.6 * Math.sqrt(Math.abs(Math.pow((vE / 3.6), 2) - 2 * a * s))).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from end velocity, acceleration and time (acceleration case)
export function getaVA2(vE: number, a: number, t: number): string {
    return (
        (3.6 * ((vE / 3.6) - a * t)).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from end velocity, distance and time (acceleration case)
export function getaVA3(vE: number, s: number, t: number): string {
    return (
        (((2 * (s / t)) - (vE / 3.6)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate initial velocity from acceleration, distance and time (acceleration case)
export function getaVA4(a: number, s: number, t: number): string {
    return (
        (((s - 0.5 * a * Math.pow(t, 2)) / t) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, acceleration and distance (acceleration case)
export function getaVE1(vA: number, a: number, s: number): string {
    return (
        ((Math.sqrt(Math.abs(Math.pow((vA / 3.6), 2) + 2 * a * s))) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, acceleration and time (acceleration case)
export function getaVE2(vA: number, a: number, t: number): string {
    return (
        (((vA / 3.6) + (a * t)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from initial velocity, distance and time (acceleration case)
export function getaVE3(vA: number, s: number, t: number): string {
    return (
        ((((2 * s) / t) - (vA / 3.6)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate end velocity from acceleration, distance and time (acceleration case)
export function getaVE4(a: number, s: number, t: number): string {
    return (
        (((s / t) + (0.5 * a * t)) * 3.6).toFixed(2).replace(".", ",") + ' km/h'
    )
}

// Calculate acceleration from initial velocity, end velocity and distance
export function getAccel1(vA: number, vE: number, s: number): string {
    return (
        (
            (Math.pow((vE / 3.6), 2) - Math.pow((vA / 3.6), 2)) / (2 * s)
        ).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate acceleration from initial velocity, end velocity and time
export function getAccel2(vA: number, vE: number, t: number): string {
    return (
        (((vE / 3.6) - (vA / 3.6)) / t).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate acceleration from initial velocity, distance and time
export function getAccel3(vA: number, s: number, t: number): string {
    return (
        ((2 * (s - (vA / 3.6) * t) / Math.pow(t, 2))).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate acceleration from end velocity, distance and time
export function getAccel4(vE: number, s: number, t: number): string {
    return (
        ((2 / t) * ((vE / 3.6) - (s / t))).toFixed(2).replace(".", ",") + ' m/s²'
    )
}

// Calculate acceleration distance from initial velocity, end velocity and acceleration
export function getAD1(vA: number, vE: number, a: number): string {
    return (
        (Math.pow((vE / 3.6), 2) - Math.pow((vA / 3.6), 2)) /
        (
            2 * a
        )
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate acceleration distance from initial velocity, end velocity and time
export function getAD2(vA: number, vE: number, t: number): string {
    return (
        (((vA / 3.6) + (vE / 3.6)) / 2) * t
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate acceleration distance from initial velocity, acceleration and time
export function getAD3(vA: number, a: number, t: number): string {
    return (
        ((vA / 3.6) * t + 0.5 * a * Math.pow(t, 2))
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate acceleration distance from end velocity, acceleration and time
export function getAD4(vE: number, a: number, t: number): string {
    return (
        ((vE / 3.6) * t - 0.5 * a * Math.pow(t, 2))
    ).toFixed(2).replace(".", ",") + ' m'
}

// Calculate acceleration time from initial velocity, end velocity and acceleration
export function getAT1(vA: number, vE: number, a: number): string {
    return (
        (
            ((vE / 3.6) - (vA / 3.6)) / a
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate acceleration time from initial velocity, end velocity and distance
export function getAT2(vA: number, vE: number, s: number): string {
    return (
        (
            ((2 * s) / ((vA / 3.6) + (vE / 3.6)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate acceleration time from initial velocity, acceleration and distance
export function getAT3(vA: number, a: number, s: number): string {
    return (
        (
            (-(vA / 3.6) / a) + (Math.sqrt((Math.pow((vA / 3.6), 2) / Math.pow(a, 2)) + (2 * s / a)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}

// Calculate acceleration time from end velocity, acceleration and distance
export function getAT4(vE: number, a: number, s: number): string {
    return (
        (
            ((vE / 3.6) / a) - (Math.sqrt((Math.pow((vE / 3.6), 2) / Math.pow(a, 2)) - (2 * s / a)))
        )
    ).toFixed(2).replace(".", ",") + ' s'
}