import { CSSProperties } from 'react'

export interface CapStyle {
  dom: CSSProperties & {
    transform: string
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  webgl: CSSProperties & {
    transform: string
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
}

export const CAPS_DATA: CapStyle[] = [
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.85) rotate(-25deg)',
      top: '7%',
      left: '3%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
      top: '7%',
      left: '3%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
      top: '18%',
      right: '12%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.75) rotate(-12deg)',
      top: '18%',
      right: '20%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
      bottom: '18%',
      right: '35%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.55) rotate(-14deg)',
      bottom: '18%',
      right: '35%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
      top: '2%',
      right: '2%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.65) rotate(10deg)',
      top: '2%',
      right: '2%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) rotate(22deg)',
      top: '10%',
      left: '35%'
    },
    webgl: {
      transform: 'translate(0, 0) rotate(8deg)',
      top: '10%',
      left: '35%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.7) rotate(27deg)',
      bottom: '7%',
      left: '1%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.7) rotate(11deg)',
      bottom: '7%',
      left: '1%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.72) rotate(22deg)',
      bottom: '1%',
      left: '18%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.72) rotate(-14deg)',
      bottom: '1%',
      left: '28%'
    }
  },
  {
    dom: {
      position: 'absolute',
      transform: 'translate(0, 0) scale(0.85) rotate(-8deg)',
      bottom: '1%',
      right: '1%'
    },
    webgl: {
      transform: 'translate(0, 0) scale(0.85) rotate(-12deg)',
      bottom: '4%',
      right: '1%'
    }
  }
]
