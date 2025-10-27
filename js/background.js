const { contextMenus, runtime, tabs } = (globalThis.chrome || browser);

contextMenus.create(
  {
    id: 'redirect',
    title: 'Redirect',
    contexts: ['all'],
  },
);

contextMenus.onClicked.addListener((info, tab) => {
  tabs.sendMessage(tab.id, { url: tab.url }, () => runtime.lastError);
});
