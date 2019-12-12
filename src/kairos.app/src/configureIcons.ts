import { fad } from '@fortawesome/pro-duotone-svg-icons';
import {
  faPortalEnter,
  faPortalExit,
} from '@fortawesome/pro-duotone-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

export const configureIcons = () => {
  library.add(fad, faPortalEnter, faPortalExit);
};
