export const typedVoskResponse = (data: any): VOSKResponse => {
  const typed = JSON.parse(data)
  typed.listen = typed.listen === 'true'
  const startMs = typed.startMs ? ('000' + typed.startMs).slice(-3) : '000'
  const stopMs = typed.stopMs ? ('000' + typed.stopMs).slice(-3) : '000'
  typed.start = typed.start ? parseInt(`${typed.start}${startMs}`) : undefined
  typed.stop = typed.stop ? parseInt(`${typed.stop}${stopMs}`) : undefined

  // console.log({
  //   text: typed.text,
  //   start: `${typed.start}${startMs}`,
  //   stop: `${typed.stop}${stopMs}`,
  // })

  return typed
}
