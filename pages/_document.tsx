import Document, { Head, Html, Main, NextScript } from 'next/document';
// import { CssBaseline } from '@nextui-org/react';

class PRDocument extends Document {
    static async getInitialProps(ctx:any) {
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: [<>{initialProps.styles}</>]
        };
    }
  
    render() {
        return (
            <Html lang="en">
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
  
export default PRDocument;