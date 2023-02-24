import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { RecoilRoot } from "recoil";

import AppHeader from '../Components/AppHeader';
// import ScrapeInterfaceHOC from '../Components/ScrapeInterfaceHOC';
import SearchInterfaceHOC from '../Components/SearchInterfaceHOC';
import SearchDisplayInterfaceHOC from '../Components/SearchDisplayInterfaceHOC';
import ScrapeHUD from '../Components/scrape/ScrapeHUD';
import SearchHUD from '../Components/search/SearchHUD';
import DataDisplayInterface from '../Components/data/DataDisplayInterface';

export const getServerSideProps: GetServerSideProps<{ msg: string }> = async ( context ) => {
    return { props: { msg: 'tricking next into not static-ly rendering this page for production' }, };
};

const Home: NextPage = () => (
    <RecoilRoot>

        <div className="container is-fluid">
            <Head>
                <title>Personal Recruter</title>
                <meta name="description" content="Finding interesting ways to gain perspective of the job market" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>

            <AppHeader key={"header"}/>
            <ScrapeHUD></ScrapeHUD>
            {/* <ScrapeInterfaceHOC></ScrapeInterfaceHOC> */}
            <SearchHUD></SearchHUD>
            {/* <SearchInterfaceHOC></SearchInterfaceHOC> */}

            <DataDisplayInterface></DataDisplayInterface>
            {/* <SearchDisplayInterfaceHOC></SearchDisplayInterfaceHOC> */}


        </div>

    </RecoilRoot>
);

export default Home;
