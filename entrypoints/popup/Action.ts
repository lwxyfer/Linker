import { getActiveTab, getAllBookmarks, removeBookmark } from './utils';
import bookmarkPro from '../common/bookmark'


const formateData = (data: BookmarkNode): BookmarkNode => {
    const title = data.title;
    const note = data?.note
    const tagString = data.tags?.map((tag: string) => '#' + tag).join(' ')
    const titleCompose = [title, tagString].filter((i) => i).join(' - ')

    return {
        ...data,
        title: title
    }
}

export const handleNew = async (data: BookmarkNode) => {
    const res = await bookmarkPro.create(formateData({
        ...data,
        createdTime: Date.now(),
    }));

    chrome.action.setIcon({ path: 'icon/128x128.png' });

    return Promise.resolve(res)
}


export const handleUpdate = async (newValue, oldValue) => {    
    const res = await bookmarkPro.update(oldValue.id, formateData({
        ...oldValue,
        ...newValue,
        updatedTime: Date.now(),
    }));
    
    if (newValue.parentId && newValue.parentId !== oldValue.parentId) {
        // remove 
        const removeRes = await bookmarkPro.move(oldValue.id, {
            parentId: newValue.parentId,
        })
    }

    return res
}


export const handleSearch = async (url) => {
    if (url) {
        const res = await bookmarkPro.searchFirst(url)

        return res
    }
    return {}
}

export const handleRemove = async (bookmarkId: string, syncDelete: boolean) => {

    chrome.action.setIcon({ path: 'icon/128.png' });

    return removeBookmark(bookmarkId)
}