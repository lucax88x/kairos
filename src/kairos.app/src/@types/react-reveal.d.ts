declare module 'react-reveal/Fade' {
  export interface IFadeProps {
    duration: number;
    collapse: boolean;
  }

  export class Fade extends React.Component<IFadeProps> {}

  export default Fade;
}
