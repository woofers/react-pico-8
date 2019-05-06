import { importAll } from './import'

export const icons = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/))

export const legacy = importAll(require.context('./images/old', false, /\.(png|jpe?g|svg)$/));

export const start = icons['start.png']
