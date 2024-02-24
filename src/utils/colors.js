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

export const replaceAppLogo = (logo) => {
    const prevLink = document.querySelectorAll('link[href*="logo192"]');
    if (prevLink.length > 0) {
        Array.from(prevLink).map(item => item.remove());
    }

    var link = document.createElement('link');
    link.rel = "icon";
    link.href = logo;
    document.getElementsByTagName('head')[0].appendChild(link);
};

export const getAppBackgroundColor = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const isDarkMode = prefersDarkScheme.matches;

    return isDarkMode ? "#282c34" : "#ffffff";
}