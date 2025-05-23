// For routing we add new custom events pushState and replaceState
// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof window.history !== "undefined") {
  const originalPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    const event = new CustomEvent("pushState", {detail: args});

    dispatchEvent(event);
    return result;
  };

  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    const event = new CustomEvent("replaceState", {detail: args});

    dispatchEvent(event);
    return result;
  };
}

const colorSchemeChangeEventName = "pcsd-standalone-style";

// Variable pcsUiEnvAdapter will be used by main application included by another
// javascript file
window.pcsUiEnvAdapter = {
  showMasthead: true,
  topModal: false,
  request: async (path, headers, postBody) => {
    const response = await fetch(path, {
      headers,
      ...(postBody !== undefined ? {method: "post", body: postBody} : {}),
    });
    document.dispatchEvent(
      new CustomEvent("pcsd-response", {detail: {url: path}}),
    );
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    };
  },
  location: (() => {
    const pushState = "pushState";
    const replaceState = "replaceState";
    const events = ["popstate", pushState, replaceState];
    return {
      getPath: () => window.location.pathname,

      getSearch: () => window.location.search,

      addEventsListener: listener =>
        events.forEach(e => window.addEventListener(e, listener)),

      removeEventsListener: listener =>
        events.forEach(e => window.removeEventListener(e, listener)),

      navigate: (to, {replace = false} = {}) =>
        window.history[replace ? replaceState : pushState](null, "", to),

      resolve: to => to,
    };
  })(),
  user: {
    // user who is not in group haclient cannot login => logged user is in the
    // group haclient
    isHaclient: async () => Promise.resolve(true),
    isSuperuser: () => false,
    addChangeListener: () => {
      // no change to listen in standalone mode
    },
  },
  colorScheme: {
    storageKey: "shell:style",
    addChangeListener: listener => {
      window.addEventListener(colorSchemeChangeEventName, event => {
        listener(event.detail.style);
      });
    },
    dispatchChangeEvent: requestedTheme =>
      window.dispatchEvent(
        new CustomEvent(colorSchemeChangeEventName, {
          detail: {
            style: requestedTheme,
          },
        }),
      ),
  },
  jump: () => {
    // In standalone mode jump makes not sens.
  },
};
