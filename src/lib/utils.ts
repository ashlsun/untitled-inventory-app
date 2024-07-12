// #region Misc
export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// #endregion

// #region Image
export async function encodeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1] || ''
      resolve(base64String)
    }

    reader.onerror = error => reject(error)

    reader.readAsDataURL(file)
  })
}
// #endregion

// #region Svelte modifiers
export function once<T extends Event>(fn?: (event: T) => void) {
  return function (event: T) {
    if (fn)
      fn(event)
    fn = undefined
  }
}

export function preventDefault<T extends Event>(fn?: (event: T) => void) {
  return function (event: T) {
    event.preventDefault()
    if (fn)
      fn(event)
  }
}

export function stopPropagation<T extends Event>(fn?: (event: T) => void) {
  return function (event: T) {
    event.stopPropagation()
    if (fn)
      fn(event)
  }
}
// #endregion
