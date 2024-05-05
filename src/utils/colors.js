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
    const hour = new Date().getHours();
    const isDay = hour > 6 && hour < 18;
    return isDay ? "#ededed" : "#282c34";
};

export const calcAlphaChannelBasedOnOpacity = (opacity) => {
    const alpha = Math.round(opacity * 255).toString(16);
    return alpha.length === 1 ? `0${alpha}` : alpha;
};
