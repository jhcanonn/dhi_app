export const fetchingSimulation = (value: any, secs: number = 1000) => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, secs)
  })
}
