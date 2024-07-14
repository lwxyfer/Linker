import Fuse from 'fuse.js'


type ListType = {
    id: string;
    isHome: boolean;
    url: string;
    favIconUrl: string;
    title: string;
}[];


const search = (query: string, list: ListType) => {
    const options = {
        keys: ['title', 'url', 'note', 'tags'],
        threshold: 0.3,
        useExtendedSearch: true,
    };

    const fuse = new Fuse(list, options);
    const results = fuse.search(query);
    const top10 = results
        .sort((a, b) => b?.score - a?.score)
        .slice(0, 10);

    return top10?.map((item) => item.item);
}



export default search;