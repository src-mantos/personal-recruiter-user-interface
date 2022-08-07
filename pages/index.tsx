import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import TileChannel, {TileChannelProps} from './components/scrape/TileChannel';

import Layout from './components/search/Layout';

import AppTitle from './_components/_headers/AppTitle';

import RequestQueue from './_components/_scrape/_queue/RequestQueue';
import { IPostDataScrapeRequest } from 'data-service/types';
import ToolTip from './_components/_panels/ToolTip';
import {useToolTipContext} from './_components/_utils/ToolTipContext'
import ScrapeManagementComponent from './_components/_scrape/ScrapeManagementComponent';
import useDispatcherContext, { DispatchContextProvider } from './_components/_utils/DispatcherContext';
import SplitPanel from './_components/_search/SplitPanel';
import SearchManagementComponent from './_components/_search/SearchManagementComponent';



const Home: NextPage = () => {
    const [contextData, setContextData] = useState({ msgData:{}, locData:{} });
    const {ToolTipContext, setMessage, setLocData, getContextValue} = useToolTipContext(setContextData);

    
    return (
        <DispatchContextProvider>
            <ToolTipContext.Provider value={contextData}>
                <div className="container is-fluid">
                    <Head>
                        <title>Personal Recruter</title>
                        <meta name="description" content="Generated by create next app" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                    </Head>
                    
                    <AppTitle key={"header"}/>
                    
                    <ScrapeManagementComponent></ScrapeManagementComponent>

                    <SearchManagementComponent></SearchManagementComponent>

                    <ToolTip desc={''} hidden={false}></ToolTip>
                </div>
            </ToolTipContext.Provider>
        </DispatchContextProvider>
    );
};

export default Home;
