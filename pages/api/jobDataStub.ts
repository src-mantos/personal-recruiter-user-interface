import type { NextApiRequest, NextApiResponse } from 'next';
import { IPostData } from 'data-service/types';
import * as data from './post-request.json';


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse< any >
) {
    
    res.status(200).json(data);
}
