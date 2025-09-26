// https://viereck.ch/latex-to-svg/

import v from './images/v.svg';
import vA from './images/vA.svg'
import vE from './images/vE.svg'
import tR from './images/tR.svg'
import tS from './images/tS.svg'
import a from './images/a.svg'

import alpha from './images/alpha.svg'
import degree from './images/degree.svg'
import percent from './images/percent.svg'
import p from './images/p.svg'
import alphaToP from './images/alpha_to_p.svg'
import pToAlpha from './images/p_to_alpha.svg'
import asteig from './images/asteig.svg'

import am from './images/am.svg'
import kmh from './images/kmh.svg'
import s from './images/s.svg'
import t from './images/t.svg'
import m from './images/m.svg'
import mm from './images/mm.svg'
import ms2 from './images/ms2.svg'
import sR from './images/sR.svg'
import sS from './images/sS.svg'
import vV from './images/vV.svg'
import sB from './images/sB.svg'
import tB from './images/tB.svg'
import sges from './images/sges.svg'
import tges from './images/tges.svg'
import tn from './images/tn.svg'
import ts from './images/ts.svg'
import sn from './images/sn.svg'
import ss from './images/ss.svg'

import vAvE from './images/vAvE.svg'

import sRF from './images/sRF.svg'
import sSF from './images/sSF.svg'
import vVF from './images/vVF.svg'
import sBF from './images/sBF.svg'
import tBF from './images/tBF.svg'
import sgesF from './images/sgesF.svg'
import tgesF from './images/tgesF.svg'

import dvF from './images/dvF.svg'
import dsF from './images/dsF.svg'
import dtF from './images/dtF.svg'

import dVA1 from './images/dVA1.svg'
import dVA2 from './images/dVA2.svg'
import dVA3 from './images/dVA3.svg'
import dVA4 from './images/dVA4.svg'

import dVE1 from './images/dVE1.svg'
import dVE2 from './images/dVE2.svg'
import dVE3 from './images/dVE3.svg'
import dVE4 from './images/dVE4.svg'

import dA1 from './images/dA1.svg'
import dA2 from './images/dA2.svg'
import dA3 from './images/dA3.svg'
import dA4 from './images/dA4.svg'

import dS1 from './images/dS1.svg'
import dS2 from './images/dS2.svg'
import dS3 from './images/dS3.svg'
import dS4 from './images/dS4.svg'

import dT1 from './images/dT1.svg'
import dT2 from './images/dT2.svg'
import dT3 from './images/dT3.svg'
import dT4 from './images/dT4.svg'


import aVA1 from './images/aVA1.svg'
import aVA2 from './images/aVA2.svg'
import aVA3 from './images/aVA3.svg'
import aVA4 from './images/aVA4.svg'

import aVE1 from './images/aVE1.svg'
import aVE2 from './images/aVE2.svg'
import aVE3 from './images/aVE3.svg'
import aVE4 from './images/aVE4.svg'

import aA1 from './images/aA1.svg'
import aA2 from './images/aA2.svg'
import aA3 from './images/aA3.svg'
import aA4 from './images/aA4.svg'

import aS1 from './images/aS1.svg'
import aS2 from './images/aS2.svg'
import aS3 from './images/aS3.svg'
import aS4 from './images/aS4.svg'

import aT1 from './images/aT1.svg'
import aT2 from './images/aT2.svg'
import aT3 from './images/aT3.svg'
import aT4 from './images/aT4.svg'

import ERROR from './images/Error.svg'
import NULL from './images/null.svg'

interface svgInterface { 
    v: string,
    vA: string,
    vE: string,
    tR: string,
    tS: string,
    a: string,
    am: string,

    alpha: string,
    degree: string,
    percent: string,
    p: string,
    alphaToP: string,
    pToAlpha: string,
    asteig: string,

    kmh: string,
    s: string,
    t: string,
    m: string,
    mm: string,
    ms2: string,

    sR: string,
    sS: string,
    vV: string,
    sB: string,
    tB: string,
    sges: string,
    tges: string,
    tn: string,
    ts: string,
    sn: string,
    ss: string,

    vAvE: string,

    sRF: string,
    sSF: string,
    vVF: string,
    sBF: string,
    tBF: string,
    sgesF: string,
    tgesF: string,

    dvF: string,
    dsF: string,
    dtF: string,

    dVA1: string,
    dVA2: string,
    dVA3: string,
    dVA4: string,

    dVE1: string,
    dVE2: string,
    dVE3: string,
    dVE4: string,
    
    dA1: string,
    dA2: string,
    dA3: string,
    dA4: string,
    
    dS1: string,
    dS2: string,
    dS3: string,
    dS4: string,
    
    dT1: string,
    dT2: string,
    dT3: string,
    dT4: string,

    aVA1: string,
    aVA2: string,
    aVA3: string,
    aVA4: string,

    aVE1: string,
    aVE2: string,
    aVE3: string,
    aVE4: string,
    
    aA1: string,
    aA2: string,
    aA3: string,
    aA4: string,
    
    aS1: string,
    aS2: string,
    aS3: string,
    aS4: string,
    
    aT1: string,
    aT2: string,
    aT3: string,
    aT4: string,

    ERROR: string,
    NULL: string,
}

const SVG: svgInterface = {
    v: v,
    vA: vA,
    vE: vE,
    tR: tR,
    tS: tS,
    a: a,
    am: am,

    alpha: alpha,
    degree: degree,
    percent: percent,
    p: p,
    alphaToP: alphaToP,
    pToAlpha: pToAlpha,
    asteig: asteig,

    kmh: kmh,
    s: s,
    t: t,
    m: m,
    mm: mm,
    ms2: ms2,

    sR: sR,
    sS: sS,
    vV: vV,
    sB: sB,
    tB: tB,
    sges: sges,
    tges: tges,
    tn: tn,
    ts: ts,
    sn: sn,
    ss: ss,

    vAvE: vAvE,

    sRF: sRF,
    sSF: sSF,
    vVF: vVF,
    sBF: sBF,
    tBF: tBF,
    sgesF: sgesF,
    tgesF: tgesF,

    dvF: dvF,
    dsF: dsF,
    dtF: dtF,

    dVA1: dVA1,
    dVA2: dVA2,
    dVA3: dVA3,
    dVA4: dVA4,

    dVE1: dVE1,
    dVE2: dVE2,
    dVE3: dVE3,
    dVE4: dVE4,

    dA1: dA1,
    dA2: dA2,
    dA3: dA3,
    dA4: dA4,

    dS1: dS1,
    dS2: dS2,
    dS3: dS3,
    dS4: dS4,

    dT1: dT1,
    dT2: dT2,
    dT3: dT3,
    dT4: dT4,

    aVA1: aVA1,
    aVA2: aVA2,
    aVA3: aVA3,
    aVA4: aVA4,

    aVE1: aVE1,
    aVE2: aVE2,
    aVE3: aVE3,
    aVE4: aVE4,

    aA1: aA1,
    aA2: aA2,
    aA3: aA3,
    aA4: aA4,
        
    aS1: aS1,
    aS2: aS2,
    aS3: aS3,
    aS4: aS4,
        
    aT1: aT1,
    aT2: aT2,
    aT3: aT3,
    aT4: aT4,

    ERROR: ERROR,
    NULL: NULL,
}

export default SVG
