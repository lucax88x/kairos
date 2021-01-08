import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';

export const configureIcons  = () => {
  library.add(faPlay, faStop);
};
