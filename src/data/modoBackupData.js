export const modoBackupData = {
  BDIA: {
    "POSTO 3": [
      { type: "bold", title: "Acionamento:", text: "Acionar o gap líder através do andon e colocar a placa de PY no posto com o lado vermelho virado para a frente." },
      { type: "bold", title: "Sistema:", text: "O processista/manutentor deverá desabilitar (by passar) a função no PLC." },
      { type: "bold", title: "Registro:", text: "Registrar no documento SAO-F-PSE-0651 as informações para rastreabilidade (data, hora, sequência de início, produto, parte impactada, tipo, razão, responsável, etc.)." },
      { type: "bold", title: "Ação do Operador:", text: "O operador deverá fazer o check de 100% das peças em modo backup utilizando caneta piloto na etiqueta do encosto." },
      { type: "bold", title: "Finalização:", text: "Ao final do modo backup, anotar o VIS do último veículo no documento SAO-F-PSE-0651." }
    ],
    "POSTO 4": [
      { type: "bold", title: "Acionamento:", text: "Acionar o GAP líder através do andon, colocar a placa no lado vermelho e acionar a manutenção para troca da parafusadeira por uma calibrada." },
      { type: "bold", title: "Ação Alternativa (Sem Troca):", text: "Caso não seja possível a troca, iniciar a operação em modo backup e solicitar à Qualidade a verificação do valor do torquímetro com transdutor, registrando no JPR-F-PSS-0037." },
      { type: "bold", title: "Inspeção:", text: "Fazer inspeção 100% com cálibre (0,10mm), aplicar check list e anotar a rastreabilidade no formulário SAO-F-PSE-0651." },
      { type: "bold", title: "Aperto Manual:", text: "Realizar o aperto manual com torquímetro de estalo, aplicando 28 Nm para P13C ou 45,05 Nm para P02H." },
      { type: "bold", title: "Sistema:", text: "O supervisor deve \"by passar\" o banco no posto utilizando a chave 421." }
    ],
    "POSTO 8": [
      { type: "bold", title: "Acionamento:", text: "Acionar o gap líder e colocar a placa de PY no lado vermelho." },
      { type: "bold", title: "Sistema:", text: "O processista ou manutentor deverá desativar o dispositivo no PLC." },
      { type: "bold", title: "Registro:", text: "Registrar no documento SAO-F-PSE-0651 as informações necessárias para rastreabilidade." },
      { type: "bold", title: "Ação do Operador:", text: "O operador deverá realizar o reconhecimento visual se o airbag se encontra na capa com os 2 parafusos para fazer os furos." },
      { type: "bold", title: "Finalização:", text: "Ao final do modo backup deverá ser anotado o VIS do último veículo no doc. SAO-F-PSE-0651." }
    ],
    "POSTO 9": [
      { type: "bold", title: "Acionamento Geral:", text: "Acionar o GAP líder através do andon e colocar a placa de PY no lado vermelho." },
      { type: "bold", title: "Backup Parafusadeira:", text: "Caso não seja possível a troca, acionar a Qualidade para verificação, fazer inspeção 100% com cálibre e realizar aperto manual com torquímetro de estalo." },
      { type: "bold", title: "Liberação de Torque:", text: "O supervisor deve \"by passar\" o banco utilizando a chave 421." },
      { type: "bold", title: "Backup Molicote:", text: "Desabilitar a função no PLC." },
      { type: "bold", title: "Molicote (Comunicação/Mecânico):", text: "Para problemas de comunicação, colocar o aplicador em modo manual e testar 3 vezes; para problemas mecânicos, solicitar suporte manual (espuma) e também testar 3 vezes." },
      { type: "bold", title: "Backup Apoio de Cabeça (APC):", text: "Desabilitar a leitura no PLC, verificar visualmente se o apoio confere com o banco a ser montado e retirar a etiqueta." }
    ],
    "POSTO 12": [
      { type: "bold", title: "Acionamento:", text: "Acionar o gap líder e colocar a placa de PY no lado vermelho." },
      { type: "bold", title: "Sistema:", text: "O processista ou manutentor deverá desativar o dispositivo no PLC." },
      { type: "bold", title: "Registro:", text: "Registrar no documento SAO-F-PSE-0651 as informações necessárias para rastreabilidade." },
      { type: "bold", title: "Ação do Operador:", text: "O operador deverá realizar o reconhecimento visual da rota dos chicotes." },
      { type: "bold", title: "Marcação Visual:", text: "Após o reconhecimento visual, o operador deverá fazer uma marcação em todos os conectores dos chicotes." }
    ]
  },
  BTR: {}
};

export const regraComumBackup = [
  "O facilitador deve tomar as ações cabíveis para reparo (OS para manutenção, abrir Kata linha, etc.).",
  "Caso o tempo de reparo ultrapasse 24 horas de produção, um desvio oficial deverá ser emitido pela Engenharia de Processos e validado pela Qualidade e Produção."
];

export const frequenciaValidacao = "Os poka yokes devem ser validados após set up, paradas para manutenção, quedas de energia, incidentes de qualidade, trocas de turno não sobrepostos (paradas para troca de turno) ou trabalhando há mais de 16 horas continuamente.";
