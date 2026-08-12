// Links de Vídeos e Padrões Visuais (mLEAN Corp) extraídos da documentação de Treinamento
export const POSTO_LINKS = {
  MODO_BACKUP: {
    BDIA: {
      'POSTO 3': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1654?selectedPerimeters=835',
      'POSTO 4': 'https://mps-ptr-mlean.app.corp/visual-standards/details/2119?selectedPerimeters=835',
      'POSTO 8': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1688?selectedPerimeters=835',
      'POSTO 9': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1656?selectedPerimeters=835',
      'POSTO 10': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1657?selectedPerimeters=835',
      'POSTO 11': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1689?selectedPerimeters=835',
      'POSTO 12': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1692?selectedPerimeters=835',
      'IF BDIA': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1658?selectedPerimeters=835',
      'INSPEÇÃO FINAL FUNCIONAL': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1658?selectedPerimeters=835'
    },
    BTR: {
      'PREPARAÇÃO DA ESTRUTURA': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1695?selectedPerimeters=848',
      'POSTO 6': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1770?selectedPerimeters=848',
      'POSTO 7': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1771?selectedPerimeters=848',
      'POSTO 07': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1771?selectedPerimeters=848',
      'INSPEÇÃO FINAL - P02H': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1693?selectedPerimeters=848',
      'INSPEÇÃO FINAL P02H': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1693?selectedPerimeters=848',
      'INSPEÇÃO FINAL - P13C': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1769?selectedPerimeters=848',
      'INSPEÇÃO FINAL P13C': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1769?selectedPerimeters=848'
    }
  },
  LIBERACAO_PY: {
    BDIA: {
      'POSTO 3': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1926?selectedPerimeters=1445',
      'POSTO 4': 'https://mps-ptr-mlean.app.corp/visual-standards/summary/1836?selectedPerimeters=1445',
      'POSTO 6': 'https://mps-ptr-mlean.app.corp/visual-standards/summary/1833?selectedPerimeters=1445',
      'POSTO 8': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1834?selectedPerimeters=1445',
      'POSTO 9': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1806?selectedPerimeters=1445',
      'POSTO 10': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1807?selectedPerimeters=1445',
      'POSTO 12': 'https://mps-ptr-mlean.app.corp/visual-standards/summary/1831?selectedPerimeters=1445',
      'IF BDIA': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1835?selectedPerimeters=1445',
      'INSPEÇÃO FINAL FUNCIONAL': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1835?selectedPerimeters=1445'
    },
    BTR: {
      'PREPARAÇÃO DA ESTRUTURA': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1841?selectedPerimeters=1446',
      'POSTO 6': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1844?selectedPerimeters=1446',
      'POSTO 7': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1845?selectedPerimeters=1446',
      'POSTO 07': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1845?selectedPerimeters=1446',
      'INSPEÇÃO FINAL - P02H': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1840?selectedPerimeters=1446',
      'INSPEÇÃO FINAL P02H': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1840?selectedPerimeters=1446',
      'INSPEÇÃO FINAL - P13C': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1843?selectedPerimeters=1446',
      'INSPEÇÃO FINAL P13C': 'https://mps-ptr-mlean.app.corp/visual-standards/details/1843?selectedPerimeters=1446'
    }
  }
};

export const getPostoLink = (tipo, linha, posto) => {
  if (!tipo || !linha || !posto) return null;
  const tKey = tipo.includes('BACKUP') ? 'MODO_BACKUP' : 'LIBERACAO_PY';
  const normPosto = String(posto).trim().toUpperCase();

  const dict = POSTO_LINKS[tKey]?.[linha];
  if (!dict) return null;

  if (dict[normPosto]) return dict[normPosto];
  
  // Procura por correspondência parcial
  for (const key of Object.keys(dict)) {
    if (normPosto.includes(key) || key.includes(normPosto)) {
      return dict[key];
    }
  }
  return null;
};
