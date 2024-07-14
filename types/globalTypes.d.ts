

interface ExtraTypes {
    createdTime: number;
    updatedTime: number;
    tags?: string[];
    note?: string;
}

declare interface BookmarkNode extends ExtraTypes {
    id: string;
    parentId: string;
    title: string;
    url: string;
    children?: Bookmark[];
    dateAdded?: number;
}
