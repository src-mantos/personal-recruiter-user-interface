/**
 * Application Type Interfaces
 */

import { IScrapeRequest, ISearchQuery } from "data-service/types";

/**
 * Basic prop building block for ui development
 */
export interface StylableComponent {
    key?: React.Key | null;
    className?: string;
}

interface MakeRequest{sendRequest: boolean;}

export interface SearchQuery extends MakeRequest, Partial<ISearchQuery> {};
export interface UserScrapeRequest extends MakeRequest, Partial<IScrapeRequest> {};