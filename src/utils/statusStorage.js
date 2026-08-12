// Gerenciamento e Persistência de Status Customizados dos Postos Poka-Yoke

const STORAGE_KEY = 'poka_yoke_status_custom_map';

export const getCustomPostoStatusMap = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Erro ao ler poka_yoke_status_custom_map:", e);
    return {};
  }
};

export const savePostoStatus = (postoName, pyCode, newStatus) => {
  try {
    const current = getCustomPostoStatusMap();
    const key = `${postoName}_${pyCode}`;
    current[key] = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error("Erro ao salvar status do posto:", e);
    return {};
  }
};

export const getPostoStatus = (postoName, pyCode, defaultStatus) => {
  const current = getCustomPostoStatusMap();
  const key = `${postoName}_${pyCode}`;
  if (current[key]) return current[key];
  return defaultStatus || 'FUNCIONANDO';
};
