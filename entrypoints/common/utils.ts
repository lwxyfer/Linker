

// get facicon
// https://github.com/faviconkit/javascript-api
export const getFavicon = (url, size = 32) => {
    const favIconUrl = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${32}`;

    return favIconUrl
}


export const isZH = () => {
    var userLanguage = navigator.language || navigator.userLanguage;

    return userLanguage.startsWith("zh")
}

interface TreeNode {
    key: string;
    id: string;
    data: any;
    title: string;
    children: TreeNode[];
}

interface DiffNode {
    type: 'add' | 'delete' | 'edit';
    node?: TreeNode;
    oldNode?: TreeNode;
    newNode?: TreeNode;
}


function diffTrees(oldTree: TreeNode | undefined, newTree: TreeNode | undefined): DiffNode[] {
    const diffs: DiffNode[] = [];

    function compareNodes(oldNode: TreeNode | undefined, newNode: TreeNode | undefined) {
        if (!oldNode && !newNode) return;

        // 节点新增
        if (!oldNode && newNode) {
            diffs.push({ type: 'add', node: newNode });
            return;
        }

        // 节点删除
        if (oldNode && !newNode) {
            diffs.push({ type: 'delete', node: oldNode });
            return;
        }

        // 节点相同，递归比较子节点
        if (oldNode?.id === newNode?.id) {
            // 判断节点内容是否相同
            if (JSON.stringify(oldNode) !== JSON.stringify(newNode)) {
                diffs.push({ type: 'edit', oldNode, newNode });
            }

            oldNode.children.forEach((child, index) => {
                compareNodes(child, newNode?.children?.[index]);
            });
        }
    }

    compareNodes(oldTree, newTree);

    return diffs;
}


