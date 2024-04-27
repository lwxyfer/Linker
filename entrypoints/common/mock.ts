// 定义书签数据结构
interface Bookmark {
    title: string;
    url?: string;
    children?: Bookmark[];
}

// 递归函数：创建书签
function createBookmark(bookmark: Bookmark, parentId: string) {
    chrome.bookmarks.create({ parentId, title: bookmark.title, url: bookmark.url }, (newBookmark) => {
        if (bookmark.children) {
            bookmark.children.forEach((child) => {
                createBookmark(child, newBookmark.id);
            });
        }
    });
}

// 示例书签数据
const bookmarksData: Bookmark = {
    title: "Folder",
    children: [
        {
            title: "Subfolder 1",
            children: [
                { title: "Bookmark 1", url: "https://example.com/bookmark1" },
                { title: "Bookmark 2", url: "https://example.com/bookmark2" }
            ]
        },
        { title: "Bookmark 3", url: "https://example.com/bookmark3" }
    ]
};
const bookmarksData2: Bookmark = {
    title: "文件夹 3",
    children: [
        {
            title: "Subfolder 1",
            children: [
                { title: "Bookmark 1", url: "https://example.com/bookmark1" },
                { title: "Bookmark 2", url: "https://example.com/bookmark2" }
            ]
        },
        { title: "Bookmark 3", url: "https://example.com/bookmark3" }
    ]
};

// 检查书签目录是否已存在
function checkBookmarkFolderExists(folderTitle: string, callback: (exists: boolean, folderId?: string) => void) {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const bookmarksBarNode = bookmarkTreeNodes[0].children.find((node) => node.id === "1");
        if (bookmarksBarNode) {
            const folderNode = bookmarksBarNode.children.find((node) => node.title === folderTitle && node.url === undefined);
            if (folderNode) {
                callback(true, folderNode.id);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}


export default () => {
    // 创建书签目录和书签层级结构
    // Call the function to add mock bookmarks to storage
    checkBookmarkFolderExists("Folder", (exists, folderId) => {
        if (exists) {
            console.log("The bookmark folder already exists with ID: " + folderId);
        } else {
            createBookmark(bookmarksData, "1");
            createBookmark(bookmarksData2, "1");

        }
    });
}