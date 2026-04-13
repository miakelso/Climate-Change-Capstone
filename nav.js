document.querySelectorAll('.top-nav').forEach((nav, index) => {
  const brand = nav.querySelector('.nav-brand');
  const menu = nav.querySelector('.nav-menu');
  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.nav-links');

  if (!menu || !toggle || !links || !brand) {
    return;
  }

  const navId = `primary-navigation-${index + 1}`;
  links.id = navId;
  toggle.setAttribute('aria-controls', navId);

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  nav.querySelectorAll('.nav-links a').forEach((link) => {
    const linkFile = new URL(link.href, document.baseURI).pathname.split('/').pop() || 'index.html';

    if (linkFile === currentFile) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const getAvailableWidth = () => {
    const container = nav.querySelector('.container, .nav-inner');

    if (!container) {
      return 0;
    }

    const containerStyles = window.getComputedStyle(container);
    const gap = parseFloat(containerStyles.columnGap || containerStyles.gap || '0');
    const brandWidth = brand.getBoundingClientRect().width;

    return container.clientWidth - brandWidth - gap - 24;
  };

  const measureLinksWidth = () => {
    const previousDisplay = links.style.display;
    const previousPosition = links.style.position;
    const previousVisibility = links.style.visibility;
    const previousLeft = links.style.left;
    const previousTop = links.style.top;
    const previousWidth = links.style.width;

    links.style.display = 'flex';
    links.style.position = 'absolute';
    links.style.visibility = 'hidden';
    links.style.left = '0';
    links.style.top = '0';
    links.style.width = 'max-content';

    const width = links.getBoundingClientRect().width;

    links.style.display = previousDisplay;
    links.style.position = previousPosition;
    links.style.visibility = previousVisibility;
    links.style.left = previousLeft;
    links.style.top = previousTop;
    links.style.width = previousWidth;

    return width;
  };

  const syncState = () => {
    const shouldCollapse = measureLinksWidth() > getAvailableWidth();

    nav.classList.toggle('is-collapsed', shouldCollapse);

    if (!shouldCollapse) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }

    const isOpen = nav.classList.contains('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', syncState);
  if (document.fonts?.ready) {
    document.fonts.ready.then(syncState);
  }

  syncState();
});