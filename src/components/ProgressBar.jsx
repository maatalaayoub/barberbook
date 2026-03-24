'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept <a> link clicks
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) return;

      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        const targetUrl = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);
        if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
          NProgress.start();
        }
      }
    };

    // Intercept programmatic navigation (router.push, etc.)
    const origPushState = history.pushState.bind(history);
    const origReplaceState = history.replaceState.bind(history);

    history.pushState = function (state, title, url) {
      if (url) {
        const targetUrl = new URL(url, window.location.origin);
        const currentUrl = new URL(window.location.href);
        if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
          NProgress.start();
        }
      }
      return origPushState(state, title, url);
    };

    history.replaceState = function (state, title, url) {
      if (url) {
        const targetUrl = new URL(url, window.location.origin);
        const currentUrl = new URL(window.location.href);
        if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
          NProgress.start();
        }
      }
      return origReplaceState(state, title, url);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
    };
  }, []);

  return null;
}
