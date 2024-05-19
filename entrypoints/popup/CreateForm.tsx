import React from 'react';
import { Form, Input, Tag, TreeSelect, Button, Select, Checkbox } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { getActiveTab, getAllBookmarks, findParentNodeByUrl } from './utils';
import { getCurrentI18n } from '@/entrypoints/common/i18n/language';
import { handleNew, handleRemove, handleUpdate, handleSearch } from './Action';

const LinkCard = ({ data, title, desc }) => {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img width={60} height={60} src={data?.favIconUrl} />
        <div style={{ marginLeft: 10 }}>
            <h3 style={{ margin: 0 }}>{data.title}</h3>
            {/* <p>描述</p> */}
        </div>
    </div>
}


const getOnlyFolders = (nodes) => {
    return nodes && nodes?.filter((item) => !item.url)
}

const renderTreeNodes = (data) =>
    data.map((node) => {
        if (getOnlyFolders(node.children)?.length > 0) {
            return {
                title: node.title,
                value: node.id,
                children: renderTreeNodes(getOnlyFolders(node.children)),
                icon: <FolderOutlined />
            };
        }
        return {
            title: node.title,
            value: node.id,
            icon: <FolderOutlined />
        };
    });


const MyForm = () => {
    const [form] = Form.useForm();
    const [allBookMarks, setAllBookMarks] = React.useState([])
    const [tabInfo, setTabInfo] = React.useState<{
        url: string
        title: string
        favIconUrl: string
    } | {}>({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [existNode, setExistNode] = React.useState(null)

    async function init() {
        try {
            const tabInfo = await getActiveTab();
            const searchRes = await handleSearch(tabInfo?.url)
            console.log("当前页面的信息: ", tabInfo);
            console.log("已存在标签素具: ", searchRes);

            setTabInfo(tabInfo)

            if (searchRes) {
                // 解构，避免引用值
                setExistNode({ ...searchRes })
                form.setFieldsValue({
                    ...tabInfo,
                    ...searchRes,
                });
            } else {
                form.setFieldsValue({
                    ...tabInfo,
                    parentId: '1'
                });
            }

            // chrome.scripting.executeScript(tabInfo.id, { file: 'content.ts' }, () => {
            //     // 向Content Script发送消息以获取OG信息
            //     // chrome.tabs.sendMessage(tab.id, { action: 'getOGInfo' });
            // });
        } catch (error) {
            console.error("获取标签页信息时出错: ", error);
        }
    }

    const checkNode = async () => {
        console.log('checknode', tabInfo)

        const res = await handleSearch(tabInfo?.url)
        setExistNode({ ...res })
    }

    const updateAllBMS = async () => {
        const bms = await getAllBookmarks()

        console.log('bms', bms)
        setAllBookMarks(bms)
        await checkNode()
    }

    interface FormValues {
        title: string;
        url: string;
        parentId?: string;
        syncDelete?: boolean;
        note?: string;
        tags?: Array<string>;
        isHome?: boolean
    }

    const onFinish = async (values: FormValues) => {
        setIsSubmitting(true)

        const savedValues: FormValues = {
            ...tabInfo,
            ...values
        }

        console.log('开始保存', existNode, savedValues)

        // TODO: 查重
        // 更新逻辑（更新 url path 也都 OK 的）
        // path 对应 remove 方法
        const res = existNode?.id ? await handleUpdate(savedValues, { ...existNode }) : await handleNew(savedValues)

        setIsSubmitting(false)

        if (res) {
            // TODO: 去重
            updateAllBMS()
        }
    };

    const handleDelete = React.useCallback(async () => {
        // NOTE: 一个是 tab 的 ID，一个是书签的 ID，注意
        const syncDelete = form.getFieldValue('syncDelete')
        const res = handleRemove(existNode?.id, syncDelete)

        if (res) {
            updateAllBMS()
        }
    }, [existNode?.id])

    const onChange = (changedValues, allValues) => {
        // 保存后也会存在修改字段值的 case
        onFinish(allValues)
    }

    React.useEffect(() => {
        init()
        updateAllBMS()
    }, [])

    const treeData = renderTreeNodes(allBookMarks)

    return (
        <div>
            <LinkCard data={tabInfo} />
            <Form
                form={form}
                name="basic"
                labelCol={{ sm: { span: 4, } }}
                wrapperCol={{ sm: { span: 20, } }}
                style={{ maxWidth: 380, margin: 12, marginLeft: 24 }}
                layout="horizontal"
                size="middle"
                onFinish={onFinish}
                requiredMark={false}
                variant="filled"
                initialValues={{ syncDelete: true }}
                onValuesChange={onChange}
            >
                <Form.Item
                    label={getCurrentI18n('Title')}
                    name="title"
                    rules={[{ required: true, message: getCurrentI18n('Please input the title!') }]}
                    style={{ marginBottom: 8 }}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={getCurrentI18n('URL')}
                    name="url"
                    rules={[{ required: true, message: getCurrentI18n('Please input the URL!') }]}
                    style={{ marginBottom: 8 }}
                >
                    <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
                </Form.Item>
                <Form.Item
                    label={getCurrentI18n('Note')}
                    name="note"
                    style={{ marginBottom: 8 }}
                    rules={[{ required: true, message: getCurrentI18n('Please input the description!') }]}
                >
                    <Input.TextArea placeholder='添加任何能让你记住这个网站的信息' />
                </Form.Item>
                <Form.Item
                    label={getCurrentI18n('Tags')}
                    name="tags"
                    style={{ marginBottom: 8 }}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="选择或者创建标签"
                        allowClear
                        options={[
                            {
                                value: '首页',
                                label: '首页'
                            },
                            {
                                value: '官网',
                                label: '官网'
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label={getCurrentI18n('Path')}
                    name="parentId"
                >
                    <TreeSelect
                        showSearch
                        treeIcon
                        allowClear
                        treeDefaultExpandAll
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder='选择书签存放位置'
                    />
                </Form.Item>
                <Form.Item
                    name="isHome"
                    valuePropName="checked"
                    wrapperCol={{ offset: 4, span: 16 }}
                >
                    <Checkbox>首页展示</Checkbox>
                </Form.Item>
                <br />
                <br />
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                        {existNode?.id ?
                            <div>
                                <Button type="text" danger onClick={handleDelete} loading={isSubmitting}>
                                    删除
                                </Button>
                                <Form.Item
                                    name="syncDelete"
                                    valuePropName="checked"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox><span style={{ fontSize: 12, color: '#666' }}>同步删除浏览器书签</span></Checkbox>
                                </Form.Item>
                            </div> :
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                {isSubmitting ? getCurrentI18n('Submitting') : getCurrentI18n('Submit')}
                            </Button>
                        }
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default MyForm;