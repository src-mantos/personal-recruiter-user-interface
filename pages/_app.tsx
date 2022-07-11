import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React, { useState, useEffect } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

function PRApp(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <Component {...pageProps} />
    );
}

export default PRApp;