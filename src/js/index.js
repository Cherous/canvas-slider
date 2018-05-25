'use strict';

/**
 * App entry point.
 *
 * @module App
 */

/** Import initialized-by-default modules/libs */
import './components/Common';
import './components/PublicAPI';
import Slider from './components/Slider';

/** Import page controllers */
import Home from './pages/Home';

import { currentPage } from './modules/dev/_helpers';

/**
 * Run appropriate scripts for each page.
 **/
switch (currentPage) {
  /** Home page */
  case 'home': {
    new Slider('.canvas-wrapper', {
      linesColor: 'rgba(211,131,18,0.5)',
      smallLineColor: 'rgba(255,255,255,.5)',
      slideNumberColor: 'rgba(255,255,255,0.5)',
      overlayFirstColor: '#D38312',
      overlaySecondColor: 'deepskyblue',
      overlayOpacity: 0.3,
      rightText: 'E N J O Y'
    });
  } break;

  /** No page found */
  default: console.warn('Undefined page');
}
