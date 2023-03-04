// This script is based 'tailwindcolorshades' by Javis V. Pérez:
// https://github.com/javisperez/tailwindcolorshades/blob/master/src/composables/colors.ts

export type Palette = {
	[key: number]: {
		/** The hex color. */
		hex: string;
		/** The RGB color. */
		rgb: string;
		/** The overlapping text/fill color. */
		on: string;
	};
};

// Applies the sRGB to linear transfer function to a single number
function sRGBToLinearTransferFunction(value: number): number
{
	let result: number = value;

	// As per https://en.wikipedia.org/wiki/SRGB
	if (result <= 0.04045)
	{
		result /= 12.92;
	}
	else
	{
		result = Math.pow((result + 0.055) / 1.055, 2.4);
	}

	return result;
}

// Apply the linear to sRGB transfer function
function linearToSRGBTransferFunction(value: number): number
{
	let result: number = value;

	// As per https://en.wikipedia.org/wiki/SRGB
	if (result <= 0.0031308)
	{
		result *= 12.92;
	}
	else
	{
		result = Math.pow(result * 1.055, 1.0/2.4) - 0.055;
	}

	return result;
}

type Rgb = {
	r: number;
	g: number;
	b: number;
};

// In sRGB, these values are expected to be from 0.0-1.0, not 0-255, so divide by 255.0 when creating
class Color {
	r: number;
	g: number;
	b: number;

	constructor(r = 0.0, g = 0.0, b = 0.0) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	// Constants for use in XYZ<->LAB conversion
	static readonly ReferenceWhite: Color = new Color(95.047, 100.000, 108.883);
	static readonly Epsilon = 0.008856;
	static readonly Kappa = 903.3;

	// Applies the sRGB to linear transfer function to a colo
	sRGBColorToLinear()
	{
		this.r = sRGBToLinearTransferFunction(this.r);
		this.g = sRGBToLinearTransferFunction(this.g);
		this.b = sRGBToLinearTransferFunction(this.b);
	}

	// Applies the sRGB to linear transfer function to a color
	LinearColorToSRGB()
	{
		this.r = linearToSRGBTransferFunction(this.r);
		this.g = linearToSRGBTransferFunction(this.g);
		this.b = linearToSRGBTransferFunction(this.b);
	}

	// Convert from XYZ to Rec709 primaries
	XYZtoRec709()
	{
		// First scale down the XYZ values to 1/100th of their current
		const scaledXYZ: Color = new Color(this.r * 0.01, this.g * 0.01, this.b * 0.01);

		// The recombine them back to Rec709 primaries
		this.r = scaledXYZ.r * 3.2406 + scaledXYZ.g * -1.5372 + scaledXYZ.b * -0.4986;
		this.g = scaledXYZ.r * -0.9689 + scaledXYZ.g * 1.8758 + scaledXYZ.b * 0.0415;
		this.b = scaledXYZ.r * 0.0557 + scaledXYZ.g * -0.2040 + scaledXYZ.b * 1.0570;
	}

	Rec709ToXYZ()
	{
		// X
		const R = this.r * 0.4124 + this.g * 0.3576 + this.b * 0.1805;
		// Y
		const G = this.r * 0.2126 + this.g * 0.7152 + this.b * 0.0722;
		// Z
		const B = this.r * 0.0193 + this.g * 0.1192 + this.b * 0.9505;

		// And multiply it by 100 to get the final XYZ values
		this.r = R * 100.0;
		this.g = G * 100.0;
		this.b = B * 100.0;
	}

	LABtoXYZ()
	{
		const lab = new Color(this.r, this.g, this.b);

		const y = (this.r + 16.0) / 116.0;
		const x = (this.g / 500.0) + y;
		const z = y - (this.b / 200.0);

		const xCubed = x * x * x;
		const zCubed = z * z * z;

		this.r = Color.ReferenceWhite.r * (xCubed > Color.Epsilon ? xCubed : (x - (16.0 / 116.0)) / 7.787);
		this.g = Color.ReferenceWhite.g * (lab.r > (Color.Kappa * Color.Epsilon) ? Math.pow((lab.r + 16.0) / 116.0, 3.0) : lab.r / Color.Kappa);
		this.b = Color.ReferenceWhite.b * (zCubed > Color.Epsilon ? zCubed : (z - (16.0 / 116.0)) / 7.787);
	}

	XYZtoLAB()
	{
		// Lamdba to convert our XYZ across
		const pivotXYZ = (value: number) =>
		{
			let result = 0.0;

			if (value > Color.Epsilon)
			{
				result = Math.pow(value, 1.0 / 3.0);
			}
			else
			{
				result = (Color.Kappa * value + 16.0) / 116.0;
			}

			return result;
		};

		const x = pivotXYZ(this.r / Color.ReferenceWhite.r);
		const y = pivotXYZ(this.g / Color.ReferenceWhite.g);
		const z = pivotXYZ(this.b / Color.ReferenceWhite.b);

		this.r = Math.max(0.0, 116.0 * y - 16.0);
		this.g = 500.0 * (x - y);
		this.b = 200.0 * (y - z);
	}

	LCHtoLAB()
	{
		// Convert degrees to radians
		const hueRadians = this.b / 180.0 * Math.PI;

		const chrominance = this.g;

		// L, which is in the R channel, remains unchanged
		this.g = Math.cos(hueRadians) * chrominance;
		this.b = Math.sin(hueRadians) * chrominance;
	}

	LABtoLCH()
	{
		// Get the hue in degrees
		let hue = Math.atan2(this.b, this.g) / Math.PI * 180.0;

		if (hue < 0.0)
		{
			hue += 360.0;
		}

		// L, which is in the R channel, remains the same
		// Chromaticity
		this.g = Math.sqrt(this.g * this.g + this.b * this.b);
		// Hue
		this.b = hue;
	}
	sRGBtoLCH()
	{
		// Apply transfer function, this puts the sRGB color in radiometrically linear space
		this.sRGBColorToLinear();
		// Convert to XYZ
		this.Rec709ToXYZ();
		// From XYZ to LAB
		this.XYZtoLAB();
		// Finally, from LAB to LCH
		this.LABtoLCH();
	}

	LCHtosRGB()
	{
		// LCH to LAB
		this.LCHtoLAB();
		// LAB to XYZ
		this.LABtoXYZ();
		// XYZ to Rec709 primaries
		this.XYZtoRec709();
		// Apply the sRGB transfer function
		this.LinearColorToSRGB();
		const clamp = (value: number) => { return Math.min(1.0, Math.max(0.0, value)); };
		this.r = clamp(this.r);
		this.g = clamp(this.g);
		this.b = clamp(this.b);
	}

	to8BitValues() : Rgb
	{
		return { r: this.r * 255, g: this.g * 255, b: this.b * 255 } as Rgb;
	}

	asString(): string
	{
		const result: string = this.r + ", " + this.g + ", " + this.b;
		return result;
	}
};

export function hexToSRgb(hex: string): Color | null {
	const sanitizedHex = hex.replaceAll('##', '#');
	const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sanitizedHex);

	if (!colorParts) return null;

	const [, r, g, b] = colorParts;

	const result =  new Color(parseInt(r, 16) / 255.0,
					parseInt(g, 16) / 255.0,
					parseInt(b, 16) / 255.0);
	return result;
}

export function hexToTailwindRgbString(hex: string): string {
	const sanitizedHex = hex.replaceAll('##', '#');
	const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sanitizedHex);

	if (!colorParts) return '(invalid)';

	const [, r, g, b] = colorParts;

	return `${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)}`;
}

export function sRgbToHex(r: number, g: number, b: number): string {
	const toHex = (c: number) => `0${Math.round(c * 255).toString(16)}`.slice(-2);
	const result = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	return result;
}

export function generateA11yOnColor(hex: string): '255 255 255' | '0 0 0' {
	const hclColor = hexToSRgb(hex);
	if (hclColor == null)
	{
		return '255 255 255';
	}
	hclColor.sRGBColorToLinear();

	return hclColor.r > 0.5 ? '0 0 0' : '255 255 255';
}

export function generatePalette(baseColor: string): Palette {
	const hexValidation = new RegExp(/^#[0-9a-f]{6}$/i);
	if (!hexValidation.test(baseColor)) baseColor = '#CCCCCC';

	// Grab it in sRGB first
	const lchBaseColor = hexToSRgb(baseColor);

	const response: Palette = {
	};

	if (lchBaseColor == null)
	{
		return response;
	}

	// Build the hex while it's still in sRGB
	const baseColorHex: string =  sRgbToHex(lchBaseColor.r, lchBaseColor.g, lchBaseColor.b);

	// Convert it to LCH
	lchBaseColor.sRGBtoLCH();

	const intensityToLuminance = (intensity: number, baseColorLuma: number) =>
	{
		// The luma to return for an intensity of 500
		let result = baseColorLuma;

		// Ensure it's within range
		intensity = Math.max(0.0, Math.min(1000.0, intensity));

		if (intensity < 500)
		{
			// Get how far we are from white to the baseColor luma
			result = 1.0 - (intensity / 500);
			// Now rerange that to the space from the base color luma to white
			result *= (100.0 - baseColorLuma);
			// Now ensure the minimum value (when it was 500) is the base color luma
			result += baseColorLuma;
		}
		else if (intensity > 500)
		{
			// Get the distance we are between the base luma and black
			result = 1.0 - ((intensity - 500) / 500);
			// Now just scale our base color luma
			result *= baseColorLuma;
		}

		return result;
	};

	[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((level) => {
		// First build the current color in LCH
		const palleteEntry = new Color(intensityToLuminance(level, lchBaseColor.r), lchBaseColor.g, lchBaseColor.b);
		// Then convert to sRGB
		palleteEntry.LCHtosRGB();
		// Now generate the hex entry
		const hex = sRgbToHex(palleteEntry.r, palleteEntry.g, palleteEntry.b);
		response[level] = { hex, rgb: hexToTailwindRgbString(hex), on: generateA11yOnColor(hex) };
	});

	return response as Palette;
}

type ContrastLevel = 'AA' | 'AAA';
type ContrastSize = 'small' | 'large';

export const contrastLevels: Record<
	ContrastSize,
	{
		[key in ContrastLevel]: number;
	}
> = {
	/** For text that is less than 18pt */
	small: {
		AA: 0.3,
		AAA: 0.2
	},
	/** For text that is at or is larger than 18pt */
	large: {
		AA: 0.2,
		AAA: 0.15
	}
};

/** Takes the RGB and returns the luminance of it */
export function getLuminance(r: Color): number;
export function getLuminance(r: number, g: number, b: number): number;
export function getLuminance(r: number | Color, g?: number, b?: number) {
	const { _r, _g, _b } = typeof r === 'object' ? { _r: r.r, _g: r.g, _b: r.b } : { _r: r, _g: g, _b: b }; // I'm not really happy with this ternary, but it works
	// we can't use !_r shorthand here because 0 is a valid value
	if (_r === undefined || _g === undefined || _b === undefined) throw new Error('Invalid RGB value!');

	const color = new Color(_r, _g, _b);

	// Convert to LCH
	color.sRGBtoLCH();

	// The R channel contains luminance
	return color.r;
}

export function destringSRgb(rgbString: string): Color {
	const rgb = rgbString.match(/(\d+),?\s*(\d+),?\s*(\d+)/); // matches "255, 255, 255" and "255 255 255"
	if (!rgb) throw new Error('Invalid RGB string!');
	return new Color(parseInt(rgb[1], 10) / 255.0, parseInt(rgb[2], 10) / 255.0, parseInt(rgb[3], 10) / 255.0);
}

// overload to specify that when there is no returnType, it will always return Color
export function handleStringColor(colorString: string): Color;
export function handleStringColor(colorString: string, returnType: 'rgb'): Color;
export function handleStringColor(colorString: string, returnType: 'hex'): string;
export function handleStringColor(colorString: string, returnType?: 'hex' | 'rgb'): string | Color;
export function handleStringColor(colorString: string, returnType: 'hex' | 'rgb' = 'rgb'): string | Color {
	// if it's a css variable
	if (colorString.includes('--')) {
		colorString = colorString.replace(/var\(|\)/g, ''); // grab just the variable name
		const cssVarHydrated = getComputedStyle(document.documentElement).getPropertyValue(colorString).trim();
		return handleStringColor(cssVarHydrated, returnType);
	}
	// if it has spaces, it's an rgb string
	if (colorString.includes(' ')) {
		// Destringing provides it in sRGB real values (not integer)
		const sRGB = destringSRgb(colorString);
		return returnType === 'hex' ? sRgbToHex(sRGB.r, sRGB.g, sRGB.b) : sRGB;
	}

	// if it's a hex string
	if (colorString.includes('#')) {
		const rgb = hexToSRgb(colorString);
		if (!rgb) return '(invalid)';
		return returnType === 'hex' ? colorString : rgb;
	}
	return colorString;
}

export function calculateRatio(color1: string | Color, color2: string | Color) {
	const col1 = typeof color1 === 'string' ? handleStringColor(color1) : color1;
	const col2 = typeof color2 === 'string' ? handleStringColor(color2) : color2;
	if (col1 === undefined || col2 === undefined) throw new Error('Color is undefined!');
	col1.sRGBtoLCH();
	col2.sRGBtoLCH();
	// L is from 0-100 so let's make it 0-1 for the contrast
	return Math.abs(col1.r - col2.r) / 100.0;
}

export function textPasses(textColor: string, backgroundColor: string, size: ContrastSize, level: ContrastLevel) {
	const ratio = calculateRatio(textColor, backgroundColor);
	return ratio >= contrastLevels[size][level];
}

/** A catch-all function to give a report on what size and level a given combination achieves.  */
export function getPassReport(textColor: string, backgroundColor: string) {
	const _textColor = handleStringColor(textColor, 'hex');
	const _backgroundColor = handleStringColor(backgroundColor, 'hex');
	const contrast = calculateRatio(_textColor, _backgroundColor);
	const smallAA = textPasses(_textColor, _backgroundColor, 'small', 'AA');
	const smallAAA = textPasses(_textColor, _backgroundColor, 'small', 'AAA');
	const largeAA = textPasses(_textColor, _backgroundColor, 'large', 'AA');
	const largeAAA = textPasses(_textColor, _backgroundColor, 'large', 'AAA');
	const fails = !smallAA && !smallAAA && !largeAA && !largeAAA;
	const AAAEmoji = '<i class="fa-solid fa-heart h-3"></i>';
	const AAEmoji = '<i class="fa-solid fa-star h-3"></i>';
	const largeAAEmoji = '<i class="fa-solid fa-star-half-stroke h-3"></i>';
	const failEmoji = '<i class="fa-solid fa-triangle-exclamation h-3"></i>';
	const report = {
		emoji: smallAAA ? AAAEmoji : smallAA ? AAEmoji : largeAA ? largeAAEmoji : failEmoji,
		note:
			`${_textColor} and ${_backgroundColor} ` +
			(smallAAA
				? 'has great contrast!'
				: smallAA
				? 'is satisfactory for larger text'
				: largeAA
				? 'has poor contrast'
				: 'fails contrast guidelines')
	};
	return {
		textColor: _textColor,
		backgroundColor: _backgroundColor,
		contrast,
		report,
		smallAA,
		smallAAA,
		largeAA,
		largeAAA,
		fails
	};
}
