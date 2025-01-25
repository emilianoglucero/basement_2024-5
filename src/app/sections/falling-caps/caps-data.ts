import { CSSProperties } from 'react'

export interface CapConfiguration {
  positioning: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  displayStyle: {
    transform: string
    display: string
    flexDirection: CSSProperties['flexDirection']
    justifyContent: string
  }
  webglProperties?: {
    verticalAlignment?: 'top' | 'bottom'
    verticalOffset?: number
    size?: number
    rotation?: number
  }
}

export const CAPS_DATA: CapConfiguration[] = [
  {
    positioning: {
      top: '0%',
      left: '3%'
    },
    displayStyle: {
      transform: 'translate(0, 0) scale(0.85) rotate(-15)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start'
    },
    webglProperties: {
      verticalAlignment: 'top',
      verticalOffset: 0.5,
      size: 0.85,
      rotation: 0.3
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
      top: '0%',
      left: '22%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start'
    },
    webglProperties: {
      verticalAlignment: 'top',
      verticalOffset: 0.63,
      size: 0.73,
      rotation: -0.1
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
      bottom: '0%',
      left: '46%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(-10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start'
    },
    webglProperties: {
      verticalAlignment: 'top',
      verticalOffset: 0.52,
      size: 0.75,
      rotation: 0.35
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
      top: '0%',
      left: '70%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start'
    },
    webglProperties: {
      verticalAlignment: 'top',
      verticalOffset: 0.61,
      size: 0.86,
      rotation: -0.04
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.85) rotate(-25deg)',
      top: '0%',
      left: '2%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end'
    },
    webglProperties: {
      verticalAlignment: 'bottom',
      verticalOffset: 0.61,
      size: 0.86,
      rotation: -0.04
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
      top: '0%',
      left: '29%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end'
    },
    webglProperties: {
      verticalAlignment: 'bottom',
      verticalOffset: 0.61,
      size: 0.86,
      rotation: -0.04
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
      bottom: '0%',
      left: '54%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end'
    },
    webglProperties: {
      verticalAlignment: 'bottom',
      verticalOffset: 0.61,
      size: 0.66,
      rotation: 0.2
    }
  },
  {
    positioning: {
      // transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
      top: '0%',
      left: '75%'
    },
    displayStyle: {
      transform: 'scale(0.85) rotate(10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end'
    },
    webglProperties: {
      verticalAlignment: 'bottom',
      verticalOffset: 0.61,
      size: 0.86,
      rotation: -0.24
    }
  }
]
