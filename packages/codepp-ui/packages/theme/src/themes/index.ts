import { basicDarkPalette, darkColorPalette } from "./dark";
import type {
  BasicPalette,
  Color,
  ColorPalette,
  Fonts,
  ITheme,
} from "../types";
import type { DeepPartial } from "../utils/types";
import { basicLightPalette, lightColorPalette } from "./light";

type RawTheme = Omit<ITheme, "colors"> & {
  colors: BasicPalette & { borderColor: Color } & DeepPartial<ColorPalette>;
};
export class ThemeBuilder {
  basicPalette: BasicPalette;
  theme: ITheme;
  constructor(type: "dark" | "light", theme?: RawTheme) {
    if (type === "dark") this.basicPalette = basicDarkPalette;
    else this.basicPalette = basicLightPalette;

    this.theme = {
      name: type === "dark" ? "default-dark" : "default-light",
      colors:
        type === "dark" ? { ...darkColorPalette } : { ...lightColorPalette },
      fonts: {
        urls: [],
        primary:
          "-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,system-ui,Ubuntu,Droid Sans,sans-serif",
        editor:
          '"SF Mono",Monaco,Menlo,Courier,Consolas,"Ubuntu Mono","Liberation Mono","DejaVu Sans Mono","Courier New",monospace',
      },
    };

    if (theme) this.build(theme);
  }

  private build(theme: RawTheme) {
    this.theme.name = theme.name;
    this.buildColors(theme.colors);
    this.buildFonts(theme.fonts);
  }

  private buildColors(
    colors: BasicPalette & { borderColor: Color } & DeepPartial<ColorPalette>
  ) {
    const stack = new Array<{
      color: Record<string, any>;
      theme: Record<string, any>;
    }>();

    stack.push({
      color: colors,
      theme: this.theme.colors,
    });
    while (stack.length > 0) {
      const { color, theme } = stack.pop()!;
      for (const [key] of Object.entries(theme)) {
        if (typeof theme[key] === "object" && color[key])
          stack.push({ color: color[key], theme: theme[key] });
        else if (color[key]) theme[key] = color[key];
      }
    }
  }

  private buildFonts(fonts: Fonts) {
    this.theme.fonts = {
      ...fonts,
    };
  }

  public getTheme(): ITheme {
    return this.theme;
  }
}
