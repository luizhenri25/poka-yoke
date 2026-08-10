export const pecasCoelhoData = {
  BDIA: [
    {
      posto: "POSTO 10",
      pecas: [
        "FECHO DE CINTO ESQUERDO E DIREITO P13C",
        "FECHO DE CINTO ESQUERDO E DIREITO P02H"
      ],
      instrucoes: "⚠️ ATENÇÃO OPERACIONAL: A peça coelho deste posto deve estar obrigatoriamente identificada e pintada na cor VERMELHA."
    },
    {
      posto: "INSPEÇÃO FINAL FUNCIONAL BDIA",
      pecas: [
        "CHECK ELETRICO"
      ],
      instrucoes: ""
    }
  ],
  BTR: [
    {
      posto: "INSPEÇÃO FINAL - P02H",
      pecas: [
        "2 ETIQUETA TOP THETTER",
        "APOIO DE CABEÇA P13C"
      ],
      instrucoes: ""
    },
    {
      posto: "INSPEÇÃO FINAL - P13C",
      pecas: [
        "2 ETIQUETA TOP THETTER",
        "APOIO DE CABEÇA P02H"
      ],
      instrucoes: ""
    },
    {
      posto: "PREPARAÇÃO DA ESTRUTURA (DFE015)",
      pecas: [
        "ENROLADOR P02H",
        "ENROLADOR P13C"
      ],
      instrucoes: ""
    }
  ]
};

export const pecasCoelhoControleMensal = [
  {
    id: 1,
    nomePeca: "Fecho de Cinto P13C / P02H (Red Rabbit Vermelha)",
    posto: "POSTO 10",
    linha: "BDIA",
    localizacao: "No próprio POSTO 10 (Gaveta de Dispositivos)",
    responsavel: "Engenharia de Processos (Caio Cabral)",
    ultimaVerificacao: "04/07/2026",
    proximaVerificacao: "04/08/2026",
    status: "Vencido"
  },
  {
    id: 2,
    nomePeca: "Etiquetas Top Tether & Apoio de Cabeça P13C",
    posto: "INSPEÇÃO FINAL - P02H",
    linha: "BTR",
    localizacao: "No próprio POSTO IF P02H (Suporte Lateral)",
    responsavel: "Engenharia de Processos (Caio Cabral)",
    ultimaVerificacao: "15/07/2026",
    proximaVerificacao: "15/08/2026",
    status: "Em Dia"
  },
  {
    id: 3,
    nomePeca: "Etiquetas Top Tether & Apoio de Cabeça P02H",
    posto: "INSPEÇÃO FINAL - P13C",
    linha: "BTR",
    localizacao: "No próprio POSTO IF P13C (Suporte Lateral)",
    responsavel: "Engenharia de Processos (Caio Cabral)",
    ultimaVerificacao: "20/07/2026",
    proximaVerificacao: "20/08/2026",
    status: "Em Dia"
  },
  {
    id: 4,
    nomePeca: "Enrolador P02H / P13C (Amostra Mestre)",
    posto: "PREPARAÇÃO DA ESTRUTURA (DFE015)",
    linha: "BTR",
    localizacao: "No próprio POSTO DFE015 (Armário do Posto)",
    responsavel: "Engenharia de Processos (Caio Cabral)",
    ultimaVerificacao: "01/08/2026",
    proximaVerificacao: "01/09/2026",
    status: "Em Dia"
  },
  {
    id: 5,
    nomePeca: "Check Elétrico (Red Rabbit BDIA)",
    posto: "INSPEÇÃO FINAL FUNCIONAL BDIA",
    linha: "BDIA",
    localizacao: "No próprio POSTO IF BDIA (Painel de Testes)",
    responsavel: "Engenharia de Processos (Caio Cabral)",
    ultimaVerificacao: "08/07/2026",
    proximaVerificacao: "08/08/2026",
    status: "Vencendo em Breve"
  }
];
