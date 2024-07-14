import React from 'react';
import { Input, Row, Col, Select, Tag, Affix } from 'antd';
import {
    SearchOutlined,
    LoadingOutlined,
    SettingFilled,
    SmileOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import wxtLogo from '@/assets/wxt.svg';
import bookmarkPro from '@/entrypoints/common/bookmark'
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { groupBookmarksByParentID } from '@/entrypoints/common/bookmarkUtils'
import { DataContext, DataContextInterface } from '../Context'
import search from './search';
import { getFavicon } from '@/entrypoints/common/utils'
import { getCurrentI18n } from '@/entrypoints/common/i18n/language';


import './style.css'; // 引入自定义CSS样式



// const searchResult = (list: Array<any>) =>
//     list.map((query, idx) => {

//         return {
//             value: query.id,
//             label: (
                    
//             ),
//         };
//     });



const Hero: React.FC = () => {
    const { list } = React.useContext<DataContextInterface | undefined>(DataContext) || { list: [] };
    const [options, setOptions] = React.useState<SelectProps<object>['options']>([]);
    const selectRef = React.useRef(null)

    const listApp = list.filter((item) => {
        return item.isHome === true && item.url;
    });

    const urlList = list.filter((item) => {
        return item.url;
    });

    const handleSearch = (value: string) => {
        console.log('value', value, urlList)

        const matchedValues = search(value, urlList);
        // const value2Options = searchResult(matchedValues)

        setOptions(matchedValues?.map((item) => ({
            label: item.title,
            value: item.url,
            ...item
        })) || []);

        console.log('on search', matchedValues)
    };

    
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
                event.preventDefault();
                event.stopPropagation();

                selectRef?.current?.focus();
            }
        };

        const handleScroll = () => {
            selectRef?.current?.blur();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('scroll', handleScroll);
        };
    }, [selectRef]);


    const isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;
    const placeholder = isMac ? getCurrentI18n('searchTipMac') : getCurrentI18n('searchTipWin');

    return (
        <div className="hero-component">
            <div className='hero-bg' />
            <div className="center">
                <div className="logo">
                    {/* <img src={wxtLogo} alt="Logo" /> */}
                </div>
                <Affix offsetTop={80}>
                    <div className="search-box">
                        <Select
                            ref={selectRef}
                            options={options}
                            style={{ width: 480, }}
                            showSearch
                            variant="filled"
                            value={null}
                            onChange={() => { }}
                            onSelect={() => { }}
                            filterOption={false}
                            onSearch={handleSearch}
                            popupClassName="search-box-popup"
                            placeholder={placeholder}
                            // popupMatchSelectWidth={false}
                            virtual={false}
                            suffixIcon={<SearchOutlined style={{ color: '#FFf' }} />}
                            notFoundContent={<div>{getCurrentI18n('searchPlaceholder') }</div>}
                            optionRender={(option) => {
                                const {
                                    data: query,
                                } = option;
                                const { title, note, url, tags } = query
                                console.log('query', query)

                                return (<a
                                    className="search-list-link"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',

                                    }}
                                    href={query.url}
                                    target="_blank"
                                >
                                    <img src={getFavicon(query.url)} alt={`Icon ${query.id}`} className='search-list-logo' />
                                    <div>
                                        <div>
                                            <span style={{ fontWeight: 600, }} className='text-overflow'>
                                                {query.title}
                                            </span>
                                            <span style={{ paddingLeft: 6, paddingRight: 6 }} className='text-overflow'>
                                                {query.note}
                                            </span>
                                            {
                                                query.tags?.map((tag) => (
                                                    <Tag>{tag}</Tag>
                                                ))
                                            }
                                        </div>
                                        <div style={{ color: '#999', width: '100%' }} className='text-overflow'>{query.url}</div>
                                    </div>
                                </a>)
                            }}
                        />
                        {/* <Input allowClear style={{ width: 460, height: 48, }} size="large" variant="filled" placeholder="Find Your Link" suffix={
                                <SearchOutlined style={{ color: '#FFf' }} />
                            } /> */}
                        {/* </Select> */}
                    </div>
                </Affix>
                {/* <Row gutter={16} className="hero-list">
                    {listApp.map(app => (
                        <Col key={app.id} span={4}>
                            <a href={app.url} className='hero-list-app'>
                                <img src={app.favIconUrl} alt={`Icon ${app.id}`} className='hero-list-app-logo' />
                                <p className='hero-list-app-title'>{app.title}</p>
                            </a>
                        </Col>
                    ))}
                    <Col key="new" span={4}>
                        <div className='hero-list-action'>
                            <div className='icon-action'>
                                <PlusOutlined style={{ fontSize: 24, color: '#333' }} />
                            </div>
                            <div className='icon-action'>
                                <EditOutlined style={{ fontSize: 24, color: '#333' }} />
                            </div>
                        </div>
                    </Col>                
                </Row> */}
            </div>
        </div>
    );
};

export default Hero;