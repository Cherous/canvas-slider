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
      linesColor: 'rgba(255,255,255,0.5)',
      smallLineColor: '#fff',
      smallLineInertia: 20,
      slideNumberSeparatorColor: 'rgba(255,255,255,.7)',
      slideNumberColor: '#fff',
      slideNumberFontSize: '44',
      slideNumberFontFamily: 'Gilroy',
      rightTextFontSize: '12',
      rightTextOffsetLeft: '95',
      rightTextOffsetTop: '93',
      rightTextAlign: 'right',
      overlayFirstColor: 'grey',
      overlaySecondColor: '#000',
      overlayOpacity: 0.3
    });
  } break;

  /** No page found */
  default: console.warn('Undefined page');
}
