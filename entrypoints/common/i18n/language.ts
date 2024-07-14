import { isZH } from '../utils'

const i18nMap = {
    'Title': { en: 'Title', zh: '标题' },
    'URL': { en: 'URL', zh: '链接' },
    'Note': { en: 'Note', zh: '备注' },
    'Tags': { en: 'Tags', zh: '标签' },
    'Path': { en: 'Path', zh: '目录' },
    'Please input the title!': { en: 'Please input the title!', zh: '请输入标题！' },
    'Please input the URL!': { en: 'Please input the URL!', zh: '请输入链接！' },
    'Please input the description!': { en: 'Please input the description!', zh: '请输入描述！' },
    'Tag 1': { en: 'Tag 1', zh: '标签1' },
    'Tag 2': { en: 'Tag 2', zh: '标签2' },
    'Tag 3': { en: 'Tag 3', zh: '标签3' },
    'Submit': { en: 'Submit', zh: '保存' },
    'Submitting': { en: 'Submitting', zh: '保存中' },
    'Catalog': { en: 'Catalog', zh: '目录' },
    'Tag': { en: 'Tag', zh: '标签' },
    'memoryText': { en: 'Add any information that can help you remember this site', zh: '添加任何能让你记住这个网站的信息' },
    'tagTips': { en: 'Enter to Create or select tags', zh: '回车创建或选择标签' },
    'selectPath': { en: 'Select Path', zh: '选择书签存放目录' },
    'syncDelete': { en: 'Sync Delete', zh: '同步删除浏览器书签' },
    'delete': { en: 'Delete', zh: '移除' },
    'searchTipMac': { en: 'Find Your Link（⌘ + F）', zh: '查找链接（⌘ + F）' },
    'searchTipWin': { en: 'Find Your Link（Ctrl + F）', zh: '查找链接（Ctrl + F）' },
    'searchPlaceholder': { en: 'Just Input', zh: '随便输入点' },
    'TagTip': { en: 'Add tags when add Site', zh: '添加链接时可增加标签' },
};


// 根据当前语言选择对应的i18n映射
export const getCurrentI18n = (key: keyof typeof i18nMap): string | undefined => {
    // 假设i18n是一个根据当前语言环境返回对应文本的函数
    const currentLanguage = isZH() ? 'zh' : 'en'; // 假设当前语言为中文
    const i18nText = i18nMap[key];
    return i18nText ? i18nText[currentLanguage] : undefined;
};
