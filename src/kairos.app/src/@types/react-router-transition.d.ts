declare module 'react-router-transition' {
  import { OpaqueConfig } from 'react-motion';

  export interface IAnimatedSwitchTransition {
    opacity?: number | OpaqueConfig;
    offset?: number | OpaqueConfig;
  }
  export interface IAnimatedSwitchProps {
    atEnter: IAnimatedSwitchTransition;
    atLeave: IAnimatedSwitchTransition;
    atActive: IAnimatedSwitchTransition;
    className: string;
    mapStyles: (styles: IAnimatedSwitchTransition) => {};
  }
  export class AnimatedSwitch extends React.PureComponent<IAnimatedSwitchProps> {}
}
