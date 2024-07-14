

function flattenBookmarks(bookmarks: BookmarkNode[]): BookmarkNode[] {
    let flat: BookmarkNode[] = [];

    for (let i = 0; i < bookmarks.length; i++) {
        let bookmark = bookmarks[i];

        // 把当前节点添加到 flat 列表中
        flat.push({
            ...bookmark,
            children: undefined
        });

        // 如果当前节点有子节点，递归调用 flattenBookmarks
        if (bookmark.children) {
            flat = flat.concat(flattenBookmarks(bookmark.children));
        }
    }

    return flat;
}

const formateData = (data) => {
    const title = data.title;
    const note = data?.note
    const tagString = data.tags?.map((tag: string) => '#' + tag).join(' ')
    const titleCompose = [title, note, tagString].filter((i) => i).join(' - ')

    return {
        url: data.url,
        title: titleCompose,
        parentId: data.parentId
    }
}


class MockChromeBookmarks {
    private readonly storageKey: string = 'chromeBookmarks';
    private bookmarks: BookmarkNode[];
    private nextId: number;

    constructor() {
        this.bookmarks = [];
        this.nextId = this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(bookmark => parseInt(bookmark.id))) + 1 : 1;
    }

    private async getStorageData(): Promise<any> {
        return new Promise((resolve) => {
            chrome.storage.local.get(this.storageKey, (result) => {
                const data = result[this.storageKey] || [];
                resolve(data);
            });
        });
    }

    private async saveBookmarksToStorage(): Promise<void> {
        return chrome.storage.local.set({ [this.storageKey]: this.bookmarks });
    }


    // 将  chrome 书签栏数据和 MockChromeBookmarks 数据进行比较
    async diffData() {
        const currentBookmarks = await this.getStorageData()
        const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
            chrome.bookmarks.getTree(resolve);
        });

        // NOTE: 0 的取值还是研究下
        const chromeBookmarks: BookmarkNode[] = flattenBookmarks(bookmarks?.[0]?.children) || [];

        // console.log("读取的数据", chromeBookmarks, currentBookmarks)

        if (chromeBookmarks.length === currentBookmarks.length && [this.bookmarks || []]?.length === 0) {
            this.bookmarks = chromeBookmarks || [];

            return Promise.resolve()
        }

        if (chromeBookmarks.length !== currentBookmarks.length || !this.bookmarks || this.bookmarks?.length === 0) {
            const urlListWithData: Record<string, { tags: string[]; note?: string; createdTime: number; updatedTime: number }> = {};
            currentBookmarks.forEach((item) => {
                urlListWithData[item.url] = {
                    tags: item.tags || [],
                    note: item.note,
                    createdTime: item.createdTime,
                    updatedTime: item.updatedTime,
                };
            });

            chromeBookmarks.forEach((item) => {
                if (urlListWithData[item?.url]) {
                    item = {
                        ...item,
                        ...urlListWithData[item?.url],
                    }
                }
            });

            this.bookmarks = chromeBookmarks || [];

            await this.saveBookmarksToStorage()
        }
    }

    async initData(): Promise<void> {
        const storedBookmarks = await this.getStorageData()

        // console.log('Local 书签类初始化数据', storedBookmarks)

        if (!storedBookmarks || storedBookmarks?.length === 0) {
            const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
                chrome.bookmarks.getTree(resolve);
            });
            const importedData = flattenBookmarks(bookmarks?.[0]?.children)

            this.bookmarks = importedData || [];
            this.nextId = this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(bookmark => parseInt(bookmark.id))) + 1 : 1;

            // 从书签栏同步到  storage 中
            await this.saveBookmarksToStorage()
            return;
        } else {
            await this.diffData()

            return Promise.resolve()
        }

        // this.bookmarks = storedBookmarks ? storedBookmarks : [];
        // this.nextId = this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(bookmark => parseInt(bookmark.id))) + 1 : 1;
    }

    async importData(): Promise<void> {
        const storedBookmarks = await this.getStorageData()

        const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
            chrome.bookmarks.getTree(resolve);
        });

        const syncData = flattenBookmarks(bookmarks?.[0]?.children)
        console.log('从书签栏导入数据', bookmarks, syncData)

        this.bookmarks = storedBookmarks ? storedBookmarks : (syncData || []);
        this.nextId = this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(bookmark => parseInt(bookmark.id))) + 1 : 1;
    }

    // 存储和内存数据同步获取才行
    async getList(): Promise<BookmarkNode[]> {
        return this.bookmarks;
    }

    async create(bookmark: BookmarkNode): Promise<BookmarkNode> {
        const res = await chrome.bookmarks.create(formateData(bookmark));

        // 保持使用同一个 ID
        bookmark.id = res?.id || this.nextId.toString();
        this.nextId++;
        this.bookmarks.push(bookmark);

        await this.saveBookmarksToStorage();

        return bookmark;
    }

    async get(id: string): Promise<BookmarkNode | undefined> {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    syncGet(id: string): BookmarkNode | undefined {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    async getChildren(parentId: string): Promise<BookmarkNode[]> {
        return this.bookmarks.filter(bookmark => bookmark.parentId === parentId);
    }

    async getRecent(numberOfItems: number): Promise<BookmarkNode[]> {
        return this.bookmarks.slice(-numberOfItems);
    }

    async getSubTree(id: string): Promise<BookmarkNode[]> {
        const rootBookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        if (rootBookmark) {
            const populateChildren = (bookmark: BookmarkNode): BookmarkNode => {
                bookmark.children = this.bookmarks.filter(child => child.parentId === bookmark.id);
                return bookmark;
            };
            return [populateChildren(rootBookmark)];
        }
        return [];
    }

    async getTree(): Promise<BookmarkNode[]> {
        const rootBookmarks = this.bookmarks.filter(bookmark => !bookmark.parentId || bookmark.parentId === '0');
        const populateChildren = (bookmark: BookmarkNode): BookmarkNode => {
            bookmark.children = this.bookmarks.filter(child => child.parentId === bookmark.id);
            return bookmark;
        };
        return rootBookmarks.map(populateChildren);
    }

    async move(id: string, destination: { parentId: string }): Promise<BookmarkNode | null> {
        const bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        if (bookmark) {
            bookmark.parentId = destination.parentId;
            
            await chrome.bookmarks.move(id, { parentId: destination.parentId });
            await this.saveBookmarksToStorage();
            return bookmark;
        }
        return null;
    }

    async remove(id: string): Promise<void> {
        const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
        if (index !== -1) {
            this.bookmarks.splice(index, 1);

            await this.saveBookmarksToStorage();
            await chrome.bookmarks.remove(id);
        }
    }

    async removeTree(id: string): Promise<void> {
        const bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        if (bookmark) {
            this.bookmarks = this.bookmarks.filter(b => b.id !== id && !b.id.startsWith(id + '-'));
            await this.saveBookmarksToStorage();
        }
    }

    async search(query: string): Promise<BookmarkNode[]> {
        // return this.bookmarks.filter(bookmark => bookmark.title.includes(query) || (bookmark.url && bookmark.url.includes(query)));
        return this.bookmarks.filter(bookmark => bookmark.url === query);
    }

    async searchFirst(query: string): Promise<BookmarkNode> {
        // return this.bookmarks.filter(bookmark => bookmark.title.includes(query) || (bookmark.url && bookmark.url.includes(query)))?.[0]
        return this.bookmarks.filter(bookmark => bookmark.url === query)?.[0]
    }

    async update(id: string, changes: { title?: string; url?: string }): Promise<BookmarkNode | null> {
        const bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        if (bookmark) {
            Object.assign(bookmark, changes);

            await chrome.bookmarks.update(id, {
                title: changes.title,
                url: changes.url
            })
            await this.saveBookmarksToStorage();
            return bookmark;
        }
        return null;
    }
}

// 使用示例
const mockChromeBookmarks = new MockChromeBookmarks();
// mockChromeBookmarks.initData()


export default mockChromeBookmarks