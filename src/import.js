
// Snippet from:
// https://stackoverflow.com/q/42118296/9129020
export const importAll = (r) => {
  let images = {}
  r.keys().map((item, index) => {
    images[item.replace('./', '')] = r(item)
  })
  return images
}
