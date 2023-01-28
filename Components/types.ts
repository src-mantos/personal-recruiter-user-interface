/**
 * Application Type Interfaces
 */

import { IScrapePostDataRequest, IScrapeRequest, ISearchFilter, ISearchQuery, FilterOperation } from "data-service/types";

/**
 * Basic prop building block for ui development
 */
export interface StylableComponent {
    key?: React.Key | null;
    className?: string;
}

export interface MakeRequest{sendRequest: boolean;}

export interface SearchQuery extends MakeRequest, Partial<ISearchQuery> {};
export interface UserScrapeRequest extends MakeRequest, Partial<IScrapeRequest> {};

export type ActiveScrapeRequest = IScrapeRequest&Partial<IScrapePostDataRequest>;

export interface SearchFilter extends ISearchFilter {
    label: string;
    operation: FilterOperation;
}
export interface UserSearchFilter extends SearchFilter{
    value: string
}

/**
 * _id? - EQ | IN
    userModified - T|F
    captureTime?: Date;
    
    title - REGEX | contains
    organization - REGEX | contains
    location - REGEX | contains | LIKE
    description: REGEX | contains | LIKE
    */
export const FilterSet:SearchFilter[] = [
    {
        dataKey: "location",
        label: "Location",
        operation: FilterOperation.REGEX
    },{
        dataKey: "organization",
        label: "Company",
        operation: FilterOperation.REGEX
    },{
        dataKey: "userModified",
        label: "Edited Posts",
        operation:FilterOperation.BOOL
    },{
        dataKey: "title",
        label: "Post Title",
        operation: FilterOperation.REGEX
    },{
        dataKey: "description",
        label: "Description",
        operation: FilterOperation.REGEX
    },{
        dataKey: "_id",
        label: "Raw ID",
        operation: FilterOperation.IN
    }
];