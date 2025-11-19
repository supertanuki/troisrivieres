export const saveLocale = (id) => localStorage.setItem("locale", id);

export const getLocale = () => localStorage.getItem("locale") || 'fr';
