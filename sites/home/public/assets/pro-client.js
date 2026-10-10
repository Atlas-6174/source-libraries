/* Self-hosted replacement for the Libraries Pro client.
 *
 * Upstream's pro-client.js talks to the hosted billing/account API
 * (api.libraries.dev). This build has no backend, so this file keeps the same
 * window.LibrariesPro surface the pages and the Studio read, answers it
 * locally, and makes no network requests:
 *
 *  - Everyone is entitled: the nav pill opens the Studio and the Studio gate
 *    stays open. No account, no session, no personal data.
 *  - Studio presets fall back to localStorage (`presets` is intentionally
 *    undefined, which is the Studio's signed-out path).
 *  - Hosted-only actions (checkout, sign-in, team, Pro content) are no-ops
 *    that resolve with { error: "unavailable" }, so callers' error paths run.
 *
 * Keeping the file name and global lets upstream pages sync unchanged.
 */
(function () {
  "use strict";

  var ISSUES_URL = "https://github.com/Atlas-6174/source-libraries/issues";
  var UNAVAILABLE = { error: "unavailable" };
  function unavailable() { return Promise.resolve(UNAVAILABLE); }

  var state = {
    authenticated: true,
    email: null,
    pro: true,
    business: false,
    lifetime: false,
    billing: false,
    subscription: null,
    ppp: null,
    resolved: true,
  };

  /* Same cache key upstream writes; studio.html reads it inline to paint its
     call to action on the first frame. Only the two flags are stored. */
  try {
    localStorage.setItem("ldev:auth", JSON.stringify({ a: true, p: true, e: null, t: Date.now() }));
  } catch (e) {
    /* Storage blocked: pages fall back to the event below. */
  }

  function announce() {
    document.dispatchEvent(new CustomEvent("pro:me", { detail: state }));
    return Promise.resolve(state);
  }

  var noopTeam = {};
  ["get", "invite", "resend", "cancel", "accept", "previewInvite", "remove", "role", "transfer", "seats", "rename"]
    .forEach(function (name) { noopTeam[name] = unavailable; });

  window.LibrariesPro = {
    /* Same origin: any leftover call hits this server and gets a clean 503. */
    apiBase: location.origin,
    get state() { return state; },
    refresh: announce,
    checkout: function () {},
    signIn: function () {},
    openSignIn: function () {},
    portal: function () {},
    magicLink: unavailable,
    requestCode: unavailable,
    submitCode: unavailable,
    approveDevice: unavailable,
    signInFromCheckout: unavailable,
    mountBadges: function () {},
    fetchContent: function () { return Promise.reject(new Error("Pro content is not part of this build")); },
    logout: announce,
    refreshGeo: function () { return Promise.resolve(null); },
    get ppp() { return null; },
    get team() { return noopTeam; },
    get presets() { return undefined; },
  };

  function paint() {
    var getPro = document.querySelector(".nav-get-pro");
    if (getPro) {
      var label = getPro.querySelector(".nav-get-pro-label");
      if (label) label.innerHTML = '<span class="nav-get-pro-word">Open </span>Studio';
      getPro.setAttribute("href", "/studio/app.html");
      getPro.setAttribute("aria-label", "Open the Studio");
      getPro.hidden = false;
      getPro.removeAttribute("data-state");
    }
    var mobilePro = document.querySelector(".mobile-menu-link--pro");
    if (mobilePro) {
      mobilePro.textContent = "Open Studio";
      mobilePro.setAttribute("href", "/studio/app.html");
      mobilePro.setAttribute("data-state", "studio");
      mobilePro.hidden = false;
    }
    /* No accounts in this build: drop every sign-in entry point, and the copy
       buttons of Pro recipe cards whose content lives on the hosted API. */
    ["pm-signin", "nav-signin-btn", "footer-signin", "mobile-signin", "pm-signout"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    /* Feedback has no backend here: send people to the issue tracker. The
       capture-phase listener runs before site.js opens the in-menu form. */
    var fb = document.getElementById("pm-feedback");
    if (fb) {
      fb.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(ISSUES_URL, "_blank", "noopener");
      }, true);
    }
    document.querySelectorAll(".card-copy[data-pro-copy]").forEach(function (btn) {
      btn.hidden = true;
    });
  }

  function init() {
    paint();
    announce();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
