declare module 'simple-icons/icons' {
  export interface SimpleIcons {
    hex: string;
    path: string;
    slug: string;
    source: string;
    svg: string;
    title: string;
  }

  export const Icon: SimpleIcons;
  export default icon;

  export type SimpleIconsType = 'github' | 'linkedin';

}

declare module 'simple-icons/icons/github' {
  export const Icon: SimpleIcons;
  export default icon;
}
declare module 'simple-icons/icons/linkedin' {
  export const Icon: SimpleIcons;
  export default icon;
}
