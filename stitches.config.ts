import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } = createStitches({
    theme: {
        colors: {
            brownStrong: '#A16B56',
            brownLight: '#E0A370',
            tanStrong: '#DEC584',
            tanLight: '#E2D7A7',
            blueStrong: '#567D89',
            blueLight: '#709F9D',
            accentBlue: '#83b799',
            accentTan: '#e2cd6d',
        },
        fonts: {
            standard: 'Roboto, sans-serif;',
            accent1: 'Verdana, Geneva, sans-serif;',
        },
    },
    media: {
        bp1: '(min-width: 480px)',
        bp2: '(min-width: 640px)',
        bp3: '(min-width: 1024px)',
    },
    utils: {
        marginX: (value: any) => ({ marginLeft: value, marginRight: value }),
    },
});
