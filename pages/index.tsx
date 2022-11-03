import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { RecoilRoot } from "recoil";

import AppHeader from './Components/AppHeader';
import { IPostData } from 'data-service/types';
import ScrapeInterfaceHOC from './Components/ScrapeInterfaceHOC';
import SearchInterfaceHOC from './Components/SearchInterfaceHOC';
import SearchDisplayInterfaceHOC from './Components/SearchDisplayInterfaceHOC';

const Home: NextPage = () => {
    const [contextData, setContextData] = useState({ msgData:{}, locData:{}});
    

    
    return (
        <RecoilRoot>
                
            <div className="container is-fluid">
                <Head>
                    <title>Personal Recruter</title>
                    <meta name="description" content="Finding interesting ways to gain perspective of the job market" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                </Head>
                    
                <AppHeader key={"header"}/>
                    
                <ScrapeInterfaceHOC></ScrapeInterfaceHOC>

                <SearchInterfaceHOC></SearchInterfaceHOC>

                <SearchDisplayInterfaceHOC></SearchDisplayInterfaceHOC>

                    
            </div>
            
        </RecoilRoot>
    );
};

export default Home;
