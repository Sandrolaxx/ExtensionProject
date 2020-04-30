executeImageDownload = (info, tab) => {
    chrome.tabs.sendMessage(tab.id, "downloadClickedElement", function (url) {
        let fileName = url.substring(0, url.indexOf("?")).substring(url.lastIndexOf("/") + 1);
        chrome.downloads.download({
            url : url,
            filename : fileName
        })
    })
};

chrome.contextMenus.create({
    title : "Salvar Imagem como..",
    contexts : ["page"],
    onclick : executeImageDownload
});