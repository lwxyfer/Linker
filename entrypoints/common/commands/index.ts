/** 唤醒插件弹窗 */
const showPopup = (command: string) => {
    chrome.action.openPopup();
}

export enum Command {
    /** 打开插件 */
    ShowPopup = 'show_popup',
    /** 唤醒配置页 */
    OpenSettings = 'open_settings',
}

export type CommandTypes = `${Command}`

const COMMAND_MAP = {
    [Command.ShowPopup]: showPopup
} as {
    [key: string]: (command: string) => void
}

export default COMMAND_MAP;