export function initNavbar() {
  const navToggle = document.querySelector<HTMLElement>(".nav-toggle");
  const links = document.querySelector<HTMLElement>(".nav-links");
  const linksContainer =
    document.querySelector<HTMLElement>(".links-container");

  if (!navToggle || !links || !linksContainer) {
    console.warn("Navbar elements not found");
    return;
  }

  if (navToggle.dataset.navReady === "true") {
    return;
  }

  navToggle.dataset.navReady = "true";

  navToggle.addEventListener("click", function () {
    const linksHeight = links.getBoundingClientRect().height;
    const containerHeight = linksContainer.getBoundingClientRect().height;
    if (containerHeight === 0) {
      linksContainer.style.height = `${linksHeight}px`;
    } else {
      linksContainer.style.height = "0px";
    }
  });
}
