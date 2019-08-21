interface Theme {
  backgroundColor: string;
  color: string;
}

export class Themes {
  // https://coolors.co/474a2c-636940-417b4e-7fb68d-b4e7ce

  static First = { backgroundColor: '#474A2C', color: 'white' };
  static Second = { backgroundColor: '#636940', color: 'white' };
  static Third = { backgroundColor: '#417B4E', color: 'white' };
  static Fourth = { backgroundColor: '#7FB68D', color: '#333' };
  static Fifth = { backgroundColor: '#B4E7CE', color: '#333' };

  static Wheel = [Themes.First, Themes.Second, Themes.Third, Themes.Fourth, Themes.Fifth];

  static getRelativeToIndex(index: number) {
    return Themes.Wheel[index % Themes.Wheel.length];
  }
}
