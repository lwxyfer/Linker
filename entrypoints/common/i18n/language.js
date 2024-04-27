const i18nMap = {
    'Title': { en: 'Title', zh: '标题' },
    'URL': { en: 'URL', zh: '链接' },
    'Note': { en: 'Note', zh: '备注' },
    'Tags': { en: 'Tags', zh: '标签' },
    'Path': { en: 'Path', zh: '路径' },
    'Please input the title!': { en: 'Please input the title!', zh: '请输入标题！' },
    'Please input the URL!': { en: 'Please input the URL!', zh: '请输入链接！' },
    'Please input the description!': { en: 'Please input the description!', zh: '请输入描述！' },
    'Tag 1': { en: 'Tag 1', zh: '标签1' },
    'Tag 2': { en: 'Tag 2', zh: '标签2' },
    'Tag 3': { en: 'Tag 3', zh: '标签3' },
    'Submit': { en: 'Submit', zh: '保存' },
    'Submitting': { en: 'Submitting', zh: '保存中' }
};


// 根据当前语言选择对应的i18n映射
export const getCurrentI18n = (key) => {
    // 假设i18n是一个根据当前语言环境返回对应文本的函数
    const currentLanguage = 'zh'; // 假设当前语言为中文
    return i18nMap[key][currentLanguage];
};