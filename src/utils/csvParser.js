import Papa from 'papaparse';

export const fetchPokaYokesData = async () => {
  try {
    const response = await fetch('/data/JPR-S-PSS-0013 - Lista de Poka Yoke Faurecia Porto Real - Rev05(Lista de Poka Yokes).csv');
    if (!response.ok) throw new Error('Network response was not ok');
    
    // Ler como array buffer para usar TextDecoder e resolver problemas de acentuação
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1252');
    const text = decoder.decode(buffer);

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: false,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data;
          
          // Achar a linha de cabeçalho
          let headerIndex = -1;
          for (let i = 0; i < rawData.length; i++) {
            const rowStr = rawData[i].join(' ').toUpperCase();
            if (rowStr.includes('CLIENTE') || rowStr.includes('LINHA') || rowStr.includes('POSTO') || rowStr.includes('POKA')) {
              headerIndex = i;
              break;
            }
          }

          const items = [];

          if (headerIndex !== -1) {
            const headers = rawData[headerIndex].map(h => h ? h.trim() : '');
            for (let i = headerIndex + 1; i < rawData.length; i++) {
              const row = rawData[i];
              if (row.length < 4) continue;

              const item = {};
              headers.forEach((header, index) => {
                if (header) {
                  let key = header;
                  const upper = header.toUpperCase();
                  
                  if (upper.includes('POSTO')) key = 'DISPOSITIVO/POSTO';
                  else if (upper.includes('POKA') || upper.includes('PY') || upper === 'DISPOSITIVO') key = 'PY';
                  else if (upper.includes('ESPECIFI') || upper.includes('DESCR')) key = 'Especificacao';
                  else if (upper.includes('FALHA')) key = 'Falha Evitada';
                  else if (upper.includes('INSTRUÇ') || upper.includes('INSTRUC')) key = 'Instrucao';
                  else if (upper.includes('STATUS')) key = 'STATUS PY';
                  else if (upper.includes('LINHA')) key = 'LINHA';
                  
                  item[key] = row[index] ? row[index].trim() : '';
                }
              });

              // Fallback por índice posicional se chaves essenciais não forem mapeadas
              if (!item['PY'] && row[3]) item['PY'] = row[3].trim();
              if (!item['Especificacao'] && row[4]) item['Especificacao'] = row[4].trim();
              if (!item['Falha Evitada'] && row[5]) item['Falha Evitada'] = row[5].trim();
              if (!item['DISPOSITIVO/POSTO'] && row[6]) item['DISPOSITIVO/POSTO'] = row[6].trim();
              if (!item['LINHA'] && row[7]) item['LINHA'] = row[7].trim();
              if (!item['STATUS PY'] && row[10]) item['STATUS PY'] = row[10].trim();

              if (item['PY']) items.push(item);
            }
          } else {
            // Se nenhum cabeçalho for identificado, usa estritamente os índices posicionais do CSV
            for (let i = 0; i < rawData.length; i++) {
              const row = rawData[i];
              if (row.length < 7) continue;
              
              const pyCode = row[3] ? row[3].trim() : '';
              if (!pyCode || !pyCode.toUpperCase().startsWith('PY')) continue;

              items.push({
                'Numero': row[1] ? row[1].trim() : '',
                'Cliente': row[2] ? row[2].trim() : '',
                'PY': pyCode,
                'Especificacao': row[4] ? row[4].trim() : '',
                'Falha Evitada': row[5] ? row[5].trim() : '',
                'DISPOSITIVO/POSTO': row[6] ? row[6].trim() : '',
                'LINHA': row[7] ? row[7].trim() : '',
                'Instrucao': row[8] ? row[8].trim() : '',
                'STATUS PY': row[10] ? row[10].trim() : 'FUNCIONANDO'
              });
            }
          }

          resolve(items);
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error("Erro ao processar dados CSV:", error);
    return [];
  }
};

export const fetchInstrucoesList = async () => {
  try {
    const response = await fetch('/data/Lista - Instrução de PY ....csv');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1252');
    const text = decoder.decode(buffer);

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: false,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data;
          const items = [];
          
          let currentLinha = ''; // BDIA ou BTR
          
          for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            const firstCol = row[0] || '';
            
            if (firstCol.includes('POKAYOKE - BDIA')) currentLinha = 'BDIA';
            if (firstCol.includes('POKAYOKE - BTR')) currentLinha = 'BTR';
            
            if (row.length >= 5 && row[1] && row[1] !== 'Perímetro' && !firstCol.includes('POKAYOKE')) {
              const cleanString = (str) => str ? str.trim() : '';
              
              items.push({
                JIT: currentLinha, // Or row[0]
                Perimetro: cleanString(row[1]),
                Doc: cleanString(row[2]),
                Standard: cleanString(row[3]),
                Status: cleanString(row[4])
              });
            }
          }
          resolve(items);
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error("Erro ao processar dados CSV de instruções:", error);
    return [];
  }
};

const INSTRUCTION_FILES_MAP = {
  'JPR-I-PSS-1549': '/data/JPR-I-PSS-1549 - Instrução de Definição e Validação de PY - Posto 4 - Rev02(Instrução PY).csv',
  'JPR-I-PSS-1993': '/data/JPR-I-PSS-1993 - Instrução de Definição e Validação de PY - POSTO 6 - Rev00(Instrução PY).csv',
  'JPR-I-PSS-2024': '/data/JPR-I-PSS-2024 - Instrução de Definição e Validação de PY- Posto 7- Rev01(IT PY DFE015 BTR).csv',
  'JPR-I-PSS-1550': '/data/JPR-I-PSS-1550 - Instrução de Definição e Validação de PY -  Posto 9 - Rev04(Instrução - Paraf.csv',
  'JPR-I-PSS-1551': '/data/JPR-I-PSS-1551 - Instrução de Definição e Validação de PY - Posto 10 - Rev04(Registro de Treinamento).csv',
  'JPR-I-PSS-1552': '/data/JPR-I-PSS-1552- Instrução de Definição e Validação de PY - Inspeção final - Rev02(Registro de Treinamento).csv',
  'JPR-I-PSS-1553': '/data/JPR-I-PSS-1553 - Instrução de Definição e Validação de PY - Retrabalho - Rev02(Registro de Treinamento).csv',
  'JPR-I-PSS-1554': '/data/JPR-I-PSS-1554 - Instrução de Definição e Validação de PY - DFE015 - Rev02(Instrução de PY).csv',
  'JPR-I-PSS-1555': '/data/JPR-I-PSS-1555 - Instrução de Definição e Validação de PY - IF P13C - Rev01(Capa).csv',
  'JPR-I-PSS-1954': '/data/JPR-I-PSS-1954 - Instrução de Definição e Validação de PY - Posto 8 - Rev01(Instrução Paraf.csv',
  'JPR-I-PSS-1972': '/data/JPR-I-PSS-1972 - Instrução de Definição e Validação de PY - Posto 12 - Rev01(Instrução de PY).csv',
  'JPR-I-PSS-1969': '/data/JPR-I-PSS-1969 - Instrução de Definição e Validação de PY - Posto 11 - Rev02(Histórico das Modificações).csv',
  'JPR-I-PSS-2025': '/data/JPR-I-PSS-2025 - Instrução de Definição e Validação de PY - Posto 3  - Rev02(Instrução de PY).csv'
};

export const fetchFullInstructionText = async (postoName) => {
  try {
    const instrucoes = await fetchInstrucoesList();
    
    // Normalizações para tentar dar match entre o nome do posto na aba JIT e o perímetro na planilha de instruções
    const instrucao = instrucoes.find(i => {
      let p = String(i.Perimetro).toUpperCase().trim();
      let f = String(postoName).toUpperCase().trim();
      if (p === 'PREPARAÇÃO DE ESTRUTURA NISSAN') p = 'PREPARAÇÃO DA ESTRUTURA';
      return p === f || p.includes(f) || f.includes(p);
    });
    
    if (!instrucao || !instrucao.Doc) return [];
    
    const jprCode = instrucao.Doc; // ex: 'JPR-I-PSS-1549'
    const filePath = INSTRUCTION_FILES_MAP[jprCode];
    
    if (!filePath) return [];
    
    const response = await fetch(filePath);
    if (!response.ok) return [];
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1252');
    const rawContent = decoder.decode(buffer);

    
    const lines = rawContent.split('\n');
    const steps = [];
    let capture = false;
    
    for (const line of lines) {
      // Remove pontos e vírgulas, aspas e espaços extras
      let cleanLine = line.replace(/;/g, '').replace(/"/g, '').trim();
      if (!cleanLine) continue;
      
      const lower = cleanLine.toLowerCase();
      // Inicia a captura na seção de métodos de validação
      if (lower.includes('todo de valida') || lower.includes('método de validação') || lower.includes('metodo de validacao')) {
        capture = true;
        steps.push({ type: 'title', text: cleanLine });
        continue;
      }
      
      if (capture) {
        // Se começar com número ou for uma frase descritiva útil
        if (/^\d+/.test(cleanLine)) {
          steps.push({ type: 'step', text: cleanLine });
        } else if (cleanLine.length > 15 && !lower.includes('falha evitada') && !lower.includes('poka yoke')) {
          steps.push({ type: 'info', text: cleanLine });
        }
      }
    }
    
    return steps;
  } catch (error) {
    console.error("Erro ao processar arquivo de instrução completa:", error);
    return [];
  }
};
