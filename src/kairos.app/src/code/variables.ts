interface Theme {
  backgroundColor: string;
  color: string;
}

export class Themes {
  // https://coolors.co/0a2239-53a2be-1d84b5-132e32-176087

  static First = { backgroundColor: '#0A2239', color: 'white' };
  static Second = { backgroundColor: '#53A2BE', color: '#333' };
  static Third = { backgroundColor: '#1D84B5', color: 'white' };
  static Fourth = { backgroundColor: '#132E32', color: 'white' };
  static Fifth = { backgroundColor: '#176087', color: '#white' };

  static Wheel = [Themes.First, Themes.Second, Themes.Third, Themes.Fourth, Themes.Fifth];

  static getRelativeToIndex(index: number) {
    return Themes.Wheel[index % Themes.Wheel.length];
  }
}
