import { describe, it, expect } from 'vitest';
import { calculateRatio, destringSRgb, getLuminance, hexToSRgb, hexToTailwindRgbString, sRgbToHex, textPasses } from './colors';

describe('Colors.ts', () => {
	it('Converts between hex and RGB properly', async () => {
		expect(hexToSRgb('#000000')?.to8BitValues()).toEqual({ r: 0, g: 0, b: 0 });
		expect(hexToSRgb('#FFFFFF')?.to8BitValues()).toEqual({ r: 255, g: 255, b: 255 });
		expect(hexToSRgb('#FF0000')?.to8BitValues()).toEqual({ r: 255, g: 0, b: 0 });
		expect(hexToSRgb('#00FF00')?.to8BitValues()).toEqual({ r: 0, g: 255, b: 0 });
		expect(hexToSRgb('#0000FF')?.to8BitValues()).toEqual({ r: 0, g: 0, b: 255 });
		expect(hexToSRgb('#FFFF00')?.to8BitValues()).toEqual({ r: 255, g: 255, b: 0 });
		expect(hexToSRgb('#00FFFF')?.to8BitValues()).toEqual({ r: 0, g: 255, b: 255 });
		expect(hexToSRgb('#FF00FF')?.to8BitValues()).toEqual({ r: 255, g: 0, b: 255 });
		expect(hexToSRgb('#0FBA81')?.to8BitValues()).toEqual({ r: 15, g: 186, b: 129 });
		expect(hexToSRgb('#4F46E5')?.to8BitValues()).toEqual({ r: 79, g: 70, b: 229 });
	});

	it('Converts between RGB and hex properly', async () => {
		expect(sRgbToHex(0, 0, 0)).toEqual('#000000');
		expect(sRgbToHex(1.0, 1.0, 1.0)).toEqual('#ffffff');
		expect(sRgbToHex(1.0, 0, 0)).toEqual('#ff0000');
		expect(sRgbToHex(0, 1.0, 0)).toEqual('#00ff00');
		expect(sRgbToHex(0, 0, 1.0)).toEqual('#0000ff');
		expect(sRgbToHex(1.0, 1.0, 0)).toEqual('#ffff00');
		expect(sRgbToHex(0, 1.0, 1.0)).toEqual('#00ffff');
		expect(sRgbToHex(1.0, 0, 1.0)).toEqual('#ff00ff');
		expect(sRgbToHex(15, 186.0/255.0, 129.0/255.0)).toEqual('#0fba81');
		expect(sRgbToHex(79.0/255.0, 70.0/255.0, 229.0/255.0)).toEqual('#4f46e5');
	});
	it('Converts between hex and Tailwind RGB strings properly', async () => {
		expect(hexToTailwindRgbString('#000000')).toEqual('0 0 0');
		expect(hexToTailwindRgbString('#FFFFFF')).toEqual('255 255 255');
		expect(hexToTailwindRgbString('#FF0000')).toEqual('255 0 0');
		expect(hexToTailwindRgbString('#00FF00')).toEqual('0 255 0');
		expect(hexToTailwindRgbString('#0000FF')).toEqual('0 0 255');
		expect(hexToTailwindRgbString('#FFFF00')).toEqual('255 255 0');
		expect(hexToTailwindRgbString('#00FFFF')).toEqual('0 255 255');
		expect(hexToTailwindRgbString('#FF00FF')).toEqual('255 0 255');
		expect(hexToTailwindRgbString('#0FBA81')).toEqual('15 186 129');
		expect(hexToTailwindRgbString('#4F46E5')).toEqual('79 70 229');
	});

	// TODO: Update luminance values as algorithm to calculate changed
	it('Takes an RGB and returns the calculated luminance', async () => {
		expect(getLuminance(0, 0, 0)).toEqual(0);
		expect(getLuminance(1.0, 1.0, 1.0)).toEqual(1);
		expect(getLuminance(1.0, 0, 0)).toEqual(0.2126);
		expect(getLuminance(0, 1.0, 0)).toEqual(0.7152);
		expect(getLuminance(0, 0, 1.0)).toEqual(0.0722);
		expect(getLuminance(1.0, 1.0, 0)).toEqual(0.9278);
		expect(getLuminance(0, 1.0, 1.0)).toEqual(0.7874);
		expect(getLuminance(1.0, 0, 1.0)).toEqual(0.2848);
		expect(getLuminance(15.0/255.0, 186.0/255.0, 129.0/255.0)).toEqual(0.36804348374162077);
		expect(getLuminance(79.0/255.0, 70.0/255.0, 229.0/255.0)).toEqual(0.11699725241042669);
	});

	it('Destrings an RGB string that includes commas, and return an RGB object', async () => {
		expect(destringSRgb('0, 0, 0').to8BitValues()).toEqual({ r: 0, g: 0, b: 0 });
		expect(destringSRgb('255, 255, 255').to8BitValues()).toEqual({ r: 255, g: 255, b: 255 });
		expect(destringSRgb('255, 0, 0').to8BitValues()).toEqual({ r: 255, g: 0, b: 0 });
		expect(destringSRgb('0, 255, 0').to8BitValues()).toEqual({ r: 0, g: 255, b: 0 });
		expect(destringSRgb('0, 0, 255').to8BitValues()).toEqual({ r: 0, g: 0, b: 255 });
		expect(destringSRgb('255, 255, 0').to8BitValues()).toEqual({ r: 255, g: 255, b: 0 });
		expect(destringSRgb('0, 255, 255').to8BitValues()).toEqual({ r: 0, g: 255, b: 255 });
		expect(destringSRgb('255, 0, 255').to8BitValues()).toEqual({ r: 255, g: 0, b: 255 });
		expect(destringSRgb('15, 186, 129').to8BitValues()).toEqual({ r: 15, g: 186, b: 129 });
		expect(destringSRgb('79, 70, 229').to8BitValues()).toEqual({ r: 79, g: 70, b: 229 });
	});

	it('Destrings an RGB string, and return an RGB object', async () => {
		expect(destringSRgb('0 0 0').to8BitValues()).toEqual({ r: 0, g: 0, b: 0 });
		expect(destringSRgb('255 255 255').to8BitValues()).toEqual({ r: 255, g: 255, b: 255 });
		expect(destringSRgb('255 0 0').to8BitValues()).toEqual({ r: 255, g: 0, b: 0 });
		expect(destringSRgb('0 255 0').to8BitValues()).toEqual({ r: 0, g: 255, b: 0 });
		expect(destringSRgb('0 0 255').to8BitValues()).toEqual({ r: 0, g: 0, b: 255 });
		expect(destringSRgb('255 255 0').to8BitValues()).toEqual({ r: 255, g: 255, b: 0 });
		expect(destringSRgb('0 255 255').to8BitValues()).toEqual({ r: 0, g: 255, b: 255 });
		expect(destringSRgb('255 0 255').to8BitValues()).toEqual({ r: 255, g: 0, b: 255 });
		expect(destringSRgb('15 186 129').to8BitValues()).toEqual({ r: 15, g: 186, b: 129 });
		expect(destringSRgb('79 70 229').to8BitValues()).toEqual({ r: 79, g: 70, b: 229 });
	});

	it('Calculates the ratio between two luminances', async () => {
		expect(calculateRatio(0, 0)).toEqual(1);
		expect(calculateRatio(1, 1)).toEqual(1);
		expect(calculateRatio(0.2126, 0.2126)).toEqual(1);
	});

	it('Calculates whether text on a background pass the AA contrast ratio', async () => {
		expect(textPasses('0, 0, 0', '255, 255, 255', 'small', 'AA')).toEqual(true);
		expect(textPasses('#0FBA81', '255, 255, 255', 'large', 'AA')).toEqual(false);
		expect(textPasses('#0FBA81', '#4f46e5', 'large', 'AA')).toEqual(false);
	});
});
