/* Это скрипт для переключения светлой/темной темы на сайте https://developer.apple.com/ */

((window, undefined) => {

  function onDidChangeSystemColorScheme() {
    AppStore.state.systemColorScheme = prefersColorSchemeMediaQueryList.matches ?
      ColorScheme.dark.value :
      ColorScheme.light.value;
    if (AppStore.state.preferredColorScheme === ColorScheme.auto.value) {
      setPreferredColorScheme(ColorScheme.auto.value);
    }
  }

  function setPreferredColorScheme(
    colorSchemeValue) {
    AppStore.setPreferredColorScheme(colorSchemeValue);
    Array.from(optionInputs).map((option) => {
      option.checked = !!(option.value === colorSchemeValue);
    });

    const prefersDark = !!(
      colorSchemeValue === ColorScheme.dark.value ||
      (colorSchemeValue === ColorScheme.auto.value &&
      AppStore.state.systemColorScheme === ColorScheme.dark.value)
    );

    if (prefersDark) {
      ColorSchemeDarkHead.map((node) => {
        (node.parentElement === null && document.head.appendChild(node));
      });
      document.body.dataset.colorScheme = ColorScheme.dark.value;
    }
    else {
      ColorSchemeDarkHead.map((node) => {
        (node.parentElement && node.parentElement.removeChild(node));
      });
      document.body.dataset.colorScheme = ColorScheme.light.value;
    }
  }

  // const DarkModeCssClass = 'dmf';

  const ColorScheme = {
    auto: {
      value: 'auto',
    },
    light: {
      value: 'light',
    },
    dark: {
      value: 'dark',
    },
  };

  const ColorSchemeLocales = {
    en: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
    zh_CN: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'и‡ЄеЉЁ',
      light: 'жµ…и‰І',
      dark: 'ж·±и‰І',
    },
    ja_JP: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'и‡Єе‹•',
      light: 'гѓ©г‚¤гѓ€',
      dark: 'гѓЂгѓјг‚Ї',
    },
    ko_KR: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'мћђлЏ™',
      light: 'лќјмќґнЉё',
      dark: 'л‹¤нЃ¬',
    },
    it_IT: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'Automatico',
      light: 'Chiaro',
      dark: 'Scuro',
    },
    fr_FR: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'Automatique',
      light: 'Clair',
      dark: 'Sombre',
    },
    de_DE: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'Automatisch',
      light: 'Hell',
      dark: 'Dunkel',
    },
    pt_BR: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'AutomГЎtica',
      light: 'Clara',
      dark: 'Escura',
    },
    es_lamr: {
      toggleAriaLabel: 'Select a color scheme preference',
      auto: 'AutomГЎtico',
      light: 'Claro',
      dark: 'Obscuro',
    },
  };

  const htmlLangAttribute = document.body.parentElement.lang;

  const localeKey = htmlLangAttribute
    .replace('en_US', 'en')
    .replace('en-US', 'en')
    .replace('-', '_');

  const Locale = ColorSchemeLocales[localeKey];

  const ColorSchemeToggleRadioGroup = document
    .querySelector('.color-scheme-toggle');

  const ColorSchemeToggleRadioLabels = ColorSchemeToggleRadioGroup
    .querySelectorAll('.text');

  const ColorSchemeDarkHead = Array.from(
    document.head.querySelectorAll('[data-color-scheme="dark"]')
  );

  ColorSchemeDarkHead.map((node) => node.media = '');

  ColorSchemeToggleRadioGroup
    .setAttribute('aria-label', Locale.toggleAriaLabel);

  Array.from(ColorSchemeToggleRadioLabels).map((label) => {
    label.textContent = Locale[label.parentElement.dataset.colorSchemeOption];
  });

  const optionInputs = Array.from(
    window.document.querySelectorAll('label[data-color-scheme-option] > input[type="radio"]')
  );

  const supportsAutoColorScheme = (typeof window.matchMedia !== 'undefined') && [
    ColorScheme.light.value,
    ColorScheme.dark.value,
    'no-preference',
  ].some(scheme => window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches);

  const defaultColorScheme = supportsAutoColorScheme ?
    ColorScheme.auto :
    ColorScheme.light;

  const AppStore = {
    state: {
      preferredColorScheme: window.Settings.preferredColorScheme || defaultColorScheme.value,
      supportsAutoColorScheme,
      systemColorScheme: ColorScheme.light.value,
    },
    setPreferredColorScheme(value) {
      this.state.preferredColorScheme = value;
      window.Settings.preferredColorScheme = value;
    },
    setSystemColorScheme(value) {
      this.state.systemColorScheme = value;
    },
  };

  const prefersColorSchemeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

  if (supportsAutoColorScheme) {
    AppStore.state.systemColorScheme = prefersColorSchemeMediaQueryList.matches ?
      ColorScheme.dark.value :
      ColorScheme.light.value;
  }

  try {
    prefersColorSchemeMediaQueryList
      .addEventListener('change', onDidChangeSystemColorScheme);
  }
  catch (e) {
    prefersColorSchemeMediaQueryList
      .addListener(onDidChangeSystemColorScheme);
  }

  if (supportsAutoColorScheme === false) {
    window.document.body
      .setAttribute('data-supports-auto-color-scheme', false);
  }

  setPreferredColorScheme(AppStore.state.preferredColorScheme);

  window.setPreferredColorScheme = setPreferredColorScheme;

})(window);
