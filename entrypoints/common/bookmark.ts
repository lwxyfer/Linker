interface Bookmark {
    id: string;
    parentId: string;
    title: string;
    url?: string;
    children?: Bookmark[];
    dateAdded?: number;
    index: number;
}

function flattenBookmarks(bookmarks: Bookmark[]): Bookmark[] {
    let flat: Bookmark[] = [];

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
    private bookmarks: Bookmark[];
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

    async initData(): Promise<void> {
        const storedBookmarks = await this.getStorageData()

        console.log('书签类初始化数据', storedBookmarks)

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
        }

        this.bookmarks = storedBookmarks ? storedBookmarks : [];
        this.nextId = this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(bookmark => parseInt(bookmark.id))) + 1 : 1;
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
    async getList(): Promise<Bookmark[]> {
        return this.bookmarks;
    }

    async create(bookmark: Bookmark): Promise<Bookmark> {
        const res = await chrome.bookmarks.create(formateData(bookmark));

        // 保持使用同一个 ID
        bookmark.id = res?.id || this.nextId.toString();
        this.nextId++;
        this.bookmarks.push(bookmark);

        await this.saveBookmarksToStorage();

        return bookmark;
    }

    async get(id: string): Promise<Bookmark | undefined> {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    syncGet(id: string): Bookmark | undefined {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    }

    async getChildren(parentId: string): Promise<Bookmark[]> {
        return this.bookmarks.filter(bookmark => bookmark.parentId === parentId);
    }

    async getRecent(numberOfItems: number): Promise<Bookmark[]> {
        return this.bookmarks.slice(-numberOfItems);
    }

    async getSubTree(id: string): Promise<Bookmark[]> {
        const rootBookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        if (rootBookmark) {
            const populateChildren = (bookmark: Bookmark): Bookmark => {
                bookmark.children = this.bookmarks.filter(child => child.parentId === bookmark.id);
                return bookmark;
            };
            return [populateChildren(rootBookmark)];
        }
        return [];
    }

    async getTree(): Promise<Bookmark[]> {
        const rootBookmarks = this.bookmarks.filter(bookmark => !bookmark.parentId || bookmark.parentId === '0');
        const populateChildren = (bookmark: Bookmark): Bookmark => {
            bookmark.children = this.bookmarks.filter(child => child.parentId === bookmark.id);
            return bookmark;
        };
        return rootBookmarks.map(populateChildren);
    }

    async move(id: string, destination: { parentId: string }): Promise<Bookmark | null> {
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

    async search(query: string): Promise<Bookmark[]> {
        // return this.bookmarks.filter(bookmark => bookmark.title.includes(query) || (bookmark.url && bookmark.url.includes(query)));
        return this.bookmarks.filter(bookmark => bookmark.url === query);
    }

    async searchFirst(query: string): Promise<Bookmark> {
        // return this.bookmarks.filter(bookmark => bookmark.title.includes(query) || (bookmark.url && bookmark.url.includes(query)))?.[0]
        return this.bookmarks.filter(bookmark => bookmark.url === query)?.[0]
    }

    async update(id: string, changes: { title?: string; url?: string }): Promise<Bookmark | null> {
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
await mockChromeBookmarks.initData()


export default mockChromeBookmarks