

export function groupBookmarksByParentID(bookmarks: BookmarkTreeNode[]): Record<string, BookmarkTreeNode[]> {
    const groupedBookmarks: Record<string, BookmarkTreeNode[]> = {};

    bookmarks.forEach((bookmark) => {
        const parentID = bookmark.parentId || 'root'; // Use 'root' as the key for bookmarks without a parent

        if (!bookmark?.url) {
            return
        }

        if (!groupedBookmarks[parentID]) {
            groupedBookmarks[parentID] = [];
        }

        groupedBookmarks[parentID].push(bookmark);
    });

    return groupedBookmarks;
}