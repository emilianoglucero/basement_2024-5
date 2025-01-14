export const calculateViewportFactor = () => {
  const viewportWidth = window.innerWidth
  let factor = 1

  if (viewportWidth >= 1920) {
    factor = 3
  } else if (viewportWidth >= 1440) {
    factor = 2
  } else if (viewportWidth >= 1024) {
    factor = 1.5
  } else if (viewportWidth >= 768) {
    factor = 1.2
  } else {
    factor = 1
  }

  return factor
}
