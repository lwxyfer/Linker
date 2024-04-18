

interface TabInfo {
    url: string;
    title: string;
    favIconUrl: string
}


export const getActiveTab = (): Promise<TabInfo> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const currentTab = tabs[0];
            // TODO: 去除 ref 字段
            const url = currentTab.url;
            const title = currentTab.title;
            const favIconUrl = currentTab.favIconUrl;

            console.log('current tab', currentTab);
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
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree((bookmarks) => {
            resolve(bookmarks?.[0]?.children || []); // 第一层为空数据
        });
    });
}


// 声明新书签的类型
interface NewBookmark {
    id: string;
    title: string;
    url: string;
}

// 创建一个返回 Promise 的函数来新增书签
export function createNewBookmark(id, title: string, url: string): Promise<NewBookmark> {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.create({
            'parentId': id, // 父文件夹的 ID，可以是 '1'（书签栏）或其他文件夹的 ID
            'title': title,
            'url': url
        }, (newBookmark) => {
            if (newBookmark) {
                const { id, title, url } = newBookmark;
                resolve({ id, title, url });
            } else {
                reject(new Error('Failed to create new bookmark'));
            }
        });
    });
}
