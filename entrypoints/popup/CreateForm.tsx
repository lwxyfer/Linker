import React from 'react';
import { Form, Input, Tag, TreeSelect, Button } from 'antd';
import { getActiveTab, getAllBookmarks, createNewBookmark } from './utils';


const LinkCard = ({ data, title, desc }) => {
    return <div style={{display: 'flex', alignItems: 'center'}}>
        <img width={60} height={60} src={data?.favIconUrl} />
        <div style={{marginLeft: 10}}>
            <h3 style={{marginBottom: 0}}>{data.title}</h3>
            <p>描述</p>
        </div>
    </div>
}


const handleNew = async (data) => {
    const title = `${data.title} - ${data.desc} - ${data.tags?.mpa((tag) => '#' + tag)}`;
    const res = await createNewBookmark(data.path, title, data.url);

    console.log('新建成功', res)
    return Promise.resolve()
}

const MyForm = () => {
    const [form] = Form.useForm();
    const [allBookMarks, setAllBookMarks] = React.useState([])
    const [tabInfo, setTabInfo] = React.useState({})

    const onFinish = async (values) => {
        console.log('Received values:', values);
        const res = await handleNew(values)
        if (res) {
            // TODO: 去重
       }
    };

    async function handleTabInfo() {
        try {
            const tabInfo = await getActiveTab();
            console.log("当前页面的URL: ", tabInfo.url);
            console.log("当前页面的标题: ", tabInfo.title);
            console.log("当前页面的标题: ", tabInfo.favIconUrl);

            setTabInfo(tabInfo)
            form.setFieldsValue(tabInfo);
        } catch (error) {
            console.error("获取标签页信息时出错: ", error);
        }

        const bms = await getAllBookmarks()
        console.log('所有书签', bms)
        setAllBookMarks(bms)
    }

    React.useEffect(() => {
        handleTabInfo()
    }, [])

    const renderTreeNodes = (data: BookmarkTreeNode[]) =>
        data.map((node) => {
            if (node.children) {
                return {
                    title: node.title,
                    value: node.id,
                    children: renderTreeNodes(node.children),
                };
            }
            return {
                title: node.title,
                value: node.id,
            };
    });

    const treeData = renderTreeNodes(allBookMarks)

    console.log('rerender', treeData, allBookMarks)

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ sm: { span: 4,  } }}
            wrapperCol={{ sm: { span: 20, } }}
            style={{ maxWidth: 380 }}
            layout="horizontal"
            size="middle"
            onFinish={onFinish}
            requiredMark={false}
            variant="filled"
        >
            <LinkCard data={tabInfo} />
            <br />
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input the title!' }]}
                style={{ marginBottom: 8 }}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="URL"
                name="url"
                rules={[{ required: true, message: 'Please input the URL!' }]}
                style={{ marginBottom: 8 }}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Desc"
                name="desc"
                style={{ marginBottom: 8 }}
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                label="Tags"
                name="tags"
                style={{ marginBottom: 8 }}
            >
                <Tag>Tag 1</Tag>
                <Tag>Tag 2</Tag>
                <Tag>Tag 3</Tag>
            </Form.Item>

            <Form.Item
                label="Path"
                name="path"
            >
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MyForm;