(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const themeButton = document.querySelector(".theme-toggle");
  const languageButtons = document.querySelectorAll("[data-language]");
  const themeStorageKey = "legal-studio-theme";
  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function setMenuOpen(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? LegalStudioI18n.text("closeMenu") : LegalStudioI18n.text("openMenu"));
    navigation.dataset.open = String(open);
    document.body.classList.toggle("menu-open", open);
  }

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (menuButton.getAttribute("aria-expanded") === "true" && !event.target.closest(".nav-wrap")) setMenuOpen(false);
  });

  function applyTheme(theme, persist) {
    const useDark = theme === "dark";
    document.documentElement.dataset.theme = useDark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(useDark));
    themeButton.setAttribute("aria-label", LegalStudioI18n.text("switchTheme"));
    if (persist) {
      try { localStorage.setItem(themeStorageKey, theme); } catch (error) { /* Theme still works for this visit. */ }
    }
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(themeStorageKey); } catch (error) { /* Fall back to the system preference. */ }
  applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : (themeQuery.matches ? "dark" : "light"), false);
  themeButton.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
  });
  themeQuery.addEventListener("change", (event) => {
    let preference = null;
    try { preference = localStorage.getItem(themeStorageKey); } catch (error) { /* Keep the theme selected for this visit. */ }
    if (!preference) applyTheme(event.matches ? "dark" : "light", false);
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => LegalStudioI18n.setLanguage(button.dataset.language));
  });
  document.addEventListener("languagechange", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-label", LegalStudioI18n.text(open ? "closeMenu" : "openMenu"));
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const yearElement = document.getElementById("current-year");
  yearElement.textContent = String(new Date().getFullYear());

  const form = document.getElementById("contact-form");
  const errorElement = document.getElementById("form-error");
  const mailFallback = document.getElementById("mailto-fallback");
  const formFields = {
    name: form.elements.name,
    phone: form.elements.phone,
    email: form.elements.email,
    service: form.elements.service,
    message: form.elements.message
  };
  const whatsappNumber = "9779800000000"; // Replace with the lawyer's WhatsApp number, digits only.
  const contactEmail = "[EMAIL]"; // Replace this and the visible contact placeholders before launch.
  const serviceLabels = {
    business: "serviceOneTitle",
    retainer: "serviceTwoTitle",
    compliance: "serviceThreeTitle",
    technology: "serviceFourTitle",
    property: "serviceFiveTitle",
    other: "otherService"
  };

  function validateForm() {
    const values = Object.fromEntries(Object.entries(formFields).map(([key, field]) => [key, field.value.trim()]));
    const invalid = Object.values(formFields).find((field) => !field.value.trim());
    if (invalid) {
      const errorKey = { name: "errorName", phone: "errorPhone", email: "errorEmail", service: "errorService", message: "errorMessage" }[invalid.name];
      return { field: invalid, message: LegalStudioI18n.text(errorKey) };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email)) return { field: formFields.email, message: LegalStudioI18n.text("errorEmail") };
    return { values };
  }

  form.addEventListener("input", () => {
    errorElement.textContent = "";
    Object.values(formFields).forEach((field) => field.removeAttribute("aria-invalid"));
  });
  form.addEventListener("change", () => {
    errorElement.textContent = "";
    Object.values(formFields).forEach((field) => field.removeAttribute("aria-invalid"));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = validateForm();
    if (result.message) {
      errorElement.textContent = result.message;
      result.field.setAttribute("aria-invalid", "true");
      result.field.focus();
      return;
    }

    const values = result.values;
    const service = LegalStudioI18n.text(serviceLabels[values.service]);
    const message = [
      LegalStudioI18n.text("whatsappMessageIntro"),
      "",
      `${LegalStudioI18n.text("whatsappName")}: ${values.name}`,
      `${LegalStudioI18n.text("whatsappPhone")}: ${values.phone}`,
      `${LegalStudioI18n.text("whatsappEmail")}: ${values.email}`,
      `${LegalStudioI18n.text("whatsappService")}: ${service}`,
      `${LegalStudioI18n.text("whatsappMessage")}: ${values.message}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const mailSubject = encodeURIComponent(LegalStudioI18n.text("mailSubject"));
    const mailBody = encodeURIComponent(message);
    mailFallback.href = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;
    mailFallback.hidden = false;
    errorElement.classList.add("form-success");
    errorElement.textContent = LegalStudioI18n.text("formSuccess");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
})();
