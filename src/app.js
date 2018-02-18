import Logger from './app/logger'
import Game from './app/game'
import { map_default } from './app/map'

console.log('Program starts...');

const logger = new Logger(true);
const game = new Game(map_default(), logger);
game.start();
