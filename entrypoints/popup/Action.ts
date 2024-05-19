import { getActiveTab, getAllBookmarks, removeBookmark } from './utils';
import bookmarkPro from '../common/bookmark'


const formateData = (data) => {
    const title = data.title;
    const note = data?.note
    const tagString = data.tags?.map((tag: string) => '#' + tag).join(' ')
    const titleCompose = [title, note, tagString].filter((i) => i).join(' - ')

    return {
        ...data,
        title: title
    }
}

export const handleNew = async (data) => {
    const res = await bookmarkPro.create(data);
    return Promise.resolve(res)
}


export const handleUpdate = async (newValue, oldValue) => {    
    const res = await bookmarkPro.update(oldValue.id, formateData({
        ...oldValue,
        ...newValue,
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

    // TODO: 同步删除，暂时不做
    console.log('删除', bookmarkId)
    return removeBookmark(bookmarkId)
}