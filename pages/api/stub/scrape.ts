import type { NextApiRequest, NextApiResponse } from 'next';
import { IPostData, IScrapeRequest } from 'data-service/types';
import * as data from '../post-request.json';

const requestQueue:IScrapeRequest[] =[];
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse< any >
) {
    const userRequest: IScrapeRequest = req.query as unknown as IScrapeRequest;
    res.status(200).json(userRequest);
}
