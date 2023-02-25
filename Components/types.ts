/**
 * Facade UI Type Interfaces
 */

import { IScrapePostDataRequest, IScrapeRequest, ISearchFilter, ISearchQuery, FilterOperation, IPostData } from "data-service/types";
import { clearInterval } from "timers";

/**
 * educational, TODO: confirm usage / standardize
 */
export interface StylableComponent {
    key?: React.Key | null;
    className?: string;
}

export enum AsyncState {
    Pending,
    Requested,
    Complete,
    Error
}

export interface MakeRequest{
    sendRequest: boolean;
    asyncState?: AsyncState;
}

//TODO consolidate UserScrapeRequest & ActiveScrapeRequest. proper typing and use case will solve this
export interface UserScrapeRequest extends MakeRequest, Partial<IScrapeRequest> {
    isActive?:boolean;
};

export type ActiveScrapeRequest = IScrapeRequest & Partial<IScrapePostDataRequest> & {
    isActive?:boolean;
};

export interface ScrapeQueue extends MakeRequest{
    queue: ActiveScrapeRequest[];
}

export interface PostDataProps {
    record?: Partial<IPostData>;
    index?: number;
    selected?:boolean;
    altMessage?:string;
    onClick?:{():void}
}

export interface EditorPostData extends MakeRequest{
    fetchRecord:boolean;
    updateList:boolean;
    record: Partial<IPostData>;
    index: number;
}

export interface SearchQuery <T> extends MakeRequest, Partial<ISearchQuery> {
    dataset?: T[];
};
export interface SearchFilter extends ISearchFilter {
    label: string;
}
export interface UserSearchFilter extends SearchFilter{
    value: any;
}
/**
 * @see dataservice for applicable dataKey's
 */
export const FilterSet:SearchFilter[] = [
    {
        dataKey  : "location",
        label    : "Location",
        operation: FilterOperation.REGEX
    }, {
        dataKey  : "organization",
        label    : "Company",
        operation: FilterOperation.REGEX
    }, {
        dataKey  : "userModified",
        label    : "Edited Posts",
        operation: FilterOperation.BOOL
    }, {
        dataKey  : "title",
        label    : "Post Title",
        operation: FilterOperation.REGEX
    }, {
        dataKey  : "description",
        label    : "Description",
        operation: FilterOperation.REGEX
    }, {
        dataKey  : "_id",
        label    : "Raw ID",
        operation: FilterOperation.IN
    }
    /*, { //TODO: actually finish filtering
        dataKey  : "captureTime",
        label    : "Captured After",
        operation: FilterOperation.AFTER
    }*/
];
export const FilterMap = new Map();
for ( let refFilter of FilterSet )
    FilterMap.set( refFilter.dataKey, refFilter );


/**
 * time delayed function execution experiment
 */
type func = {():void}|{():Promise<void>};
export class DelayedTask{
    task:func;
    delay: number;
    ref:NodeJS.Timeout|undefined;
    constructor( task: func, delay:number=100 ){
        this.task = task;
        this.delay = delay;
    }

    public execute( delay?:number ){
        if ( this.ref === undefined )
            this.ref = setTimeout( () => {
                console.log({ msg: "DelayedTask-"+( delay !== undefined )?"inpt":"init", delay: ( delay !== undefined )? delay : this.delay });
                this.task();
                this.ref = undefined;
            }, ( delay !== undefined )? delay : this.delay );
    }

    public clear(){
        if ( this.ref !== undefined )
            clearTimeout( this.ref );
    }
};

