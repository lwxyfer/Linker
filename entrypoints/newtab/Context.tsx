import React, { createContext } from 'react';
import { Input, Row, Col, AutoComplete, Button } from 'antd';
import bookmarkPro from '@/entrypoints/common/bookmark'
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { groupBookmarksByParentID } from '@/entrypoints/common/bookmarkUtils'


import './style.css'; // 引入自定义CSS样式


export interface DataContextInterface {
    list: {
        id: string;
        isHome: boolean;
        url: string;
        favIconUrl: string;
        title: string;
    }[];
    activeId: string;
    onActiveIdChange: (id: string) => void
}

export const DataContext = createContext<DataContextInterface | undefined>(undefined);


const ContextProvider: React.FC = ({ children }) => {
    const [list, setList] = React.useState([]);

    const getListApp = async () => {
        await bookmarkPro.initData()
        const list = await bookmarkPro.getList()

        setList(list)
    }

    React.useEffect(() => {
        getListApp()

        // 页面可见性变化事件
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                getListApp()
            }
        })

        return () => {
            window.removeEventListener('visibilitychange', () => { })
        }
    }, [])

    const [activeId, setActiveId] = React.useState('');

    const onActiveIdChange = (id) => {
        setActiveId(id)
    }

    return (
        <DataContext.Provider value={{ list, activeId, onActiveIdChange }}>
            { children }
        </DataContext.Provider>
    );
};

export default ContextProvider;