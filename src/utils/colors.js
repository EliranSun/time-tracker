export const replaceMetaThemeColor = (color) => {
    const prevMeta = document.querySelectorAll('meta[name="theme-color"]');
    if (prevMeta.length > 0) {
        Array.from(prevMeta).map(item => item.remove());
    }

    var meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = color;
    document.getElementsByTagName('head')[0].appendChild(meta);
};

export const getAppBackgroundColor = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const isDarkMode = prefersDarkScheme.matches;

    return isDarkMode ? "#282c34" : "#ffffff";
}