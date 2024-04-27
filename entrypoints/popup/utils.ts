import bookmarkPro from '../common/bookmark'


interface TabInfo {
    url: string;
    title: string;
    favIconUrl: string;
    id?: string
}


export const getActiveTab = (): Promise<TabInfo> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const currentTab = tabs[0];
            // TODO: 去除 ref 字段
            const url = currentTab.url;
            const title = currentTab.title;
            const favIconUrl = currentTab.favIconUrl;
            const id = currentTab.id;

            // console.log('current tab', currentTab);
            resolve({ url, title, favIconUrl });
        });
    });
}

interface BookmarkTreeNode {
    id: string;
    parentId?: string;
    index?: number;
    url?: string;
    title: string;
    dateAdded?: number;
    dateGroupModified?: number;
    unmodifiable?: string;
    children?: BookmarkTreeNode[];
    type?: "bookmark" | "folder" | "separator";
}

/**
 * Retrieves all bookmarks from the chrome.bookmarks API.
 *
 * @return {Promise<BookmarkTreeNode[]>} A promise that resolves with an array of BookmarkTreeNode objects representing all the bookmarks.
 */
export function getAllBookmarks(): Promise<BookmarkTreeNode[]> {
    return bookmarkPro.getTree()
}


// 声明新书签的类型
interface NewBookmark {
    id: string;
    title: string;
    url: string;
}


interface BookmarkTreeNode {
    id: string;
    parentId?: string;
    title: string;
    url?: string;
    children?: BookmarkTreeNode[];
}

export function findParentNodeByUrl(url: string, allBookmarks: BookmarkTreeNode[]): BookmarkTreeNode | null {
    for (const node of allBookmarks) {
        if (node.url && node.url === url) {
            // 找到匹配的书签节点，返回其父节点信息
            return node;
        }
        if (node.children) {
            const parentNode = findParentNodeByUrl(url, node.children);
            if (parentNode) {
                return parentNode;
            }
        }
    }
    return null;
}

export function findParentNode(id: string, allBookmarks: BookmarkTreeNode[]): BookmarkTreeNode | null {
    for (const node of allBookmarks) {
        if (node.children) {
            for (const childNode of node.children) {
                if (childNode.id === id) {
                    // 找到匹配的父节点，返回该节点信息
                    return node;
                }
            }
            const parentNode = findParentNode(id, node.children);
            if (parentNode) {
                return parentNode;
            }
        }
    }
    return null;
}


// Define an asynchronous function to remove a bookmark by its ID
export async function removeBookmark(bookmarkId: string): Promise<void> {
    return bookmarkPro.remove(bookmarkId)
}
