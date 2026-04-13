# Projeto Avaliativo: Machine Learning com Dados de Chamados

Você recebeu um conjunto de dados contendo registros de chamados. O objetivo é aplicar técnicas de **Machine Learning** em um dataset real de chamados (helpdesk) para resolver um problema específico.
A partir desse dataset, você deverá: **Definir um problema de Machine Learning e construir uma solução avaliada por métricas**

## Escolha do problema

Cada grupo deverá escolher **UMA** das possibilidades abaixo **ou propor outra (com justificativa)**:

1. **Classificação de Categoria:** Prever a categoria do chamado com base no título.
2. **Classificação de Prioridade:** Prever se um chamado é Baixa, Média ou Alta prioridade.
3. **Classificação de Status:** Prever o status do chamado (Pendente, Em atendimento, etc.). ⚠️ *Atenção: evite usar atributos que "entregam" diretamente a resposta, como data de fechamento — isso tornaria o modelo trivial.*
4. **Agrupamento de Chamados (Clustering):** Agrupar chamados semelhantes automaticamente, sem usar rótulos.
5. **Detecção de Chamados Duplicados:** Identificar chamados que tratam do mesmo problema usando similaridade semântica entre títulos. *Não há rótulos de "duplicata" no dataset — a avaliação deve ser feita por análise qualitativa dos pares encontrados.*
6. **Busca por Similaridade Semântica:** Dado um novo título de chamado, recuperar os chamados mais semelhantes do histórico. *(Nota: este problema não é um sistema de recomendação clássico — é uma tarefa de recuperação de informação baseada em similaridade de texto.)*
7. **Previsão de Tempo (Regressão):** Prever o tempo até o atendimento ou o tempo de resolução, se houver dados suficientes. *Este é um problema de regressão — use métricas como MAE e RMSE.*
8. **Problema personalizado:** O grupo pode propor um problema próprio, desde que: a) envolva Machine Learning; b) use o dataset fornecido; c) seja aprovado pelo professor.

## Requisitos

#### ✅ 1. Definir claramente o problema
Descreva o que se deseja prever ou descobrir, qual é a entrada do modelo e qual é a saída esperada.

#### ✅ 2. Preparar e tratar os dados
Inclui limpeza, tratamento de valores ausentes e transformação dos atributos. Para atributos textuais (como o título), é necessário aplicar alguma técnica de representação, como **TF-IDF**, **CountVectorizer** ou **embeddings pré-treinados**. Remoção de stopwords e normalização do texto são boas práticas recomendadas.

#### ✅ 3. Separar os dados em treino e teste
Antes de qualquer treinamento, divida o dataset em conjunto de treino e conjunto de teste (mínimo 70% / 30%). **Nunca avalie o modelo nos mesmos dados em que ele foi treinado.**

#### ✅ 4. Treinar pelo menos 1 modelo de Machine Learning
Escolha um algoritmo adequado ao tipo de problema. Veja sugestões na seção de referências.

#### ✅ 5. Avaliar o modelo com métricas apropriadas
Use métricas condizentes com o tipo de problema. Veja a seção de métricas abaixo.

#### ✅ 6. Interpretar os resultados (análise crítica)
Não basta apresentar os números — explique o que eles significam. O modelo aprendeu algo útil? Onde ele erra mais? Por quê?

## Entregáveis

Cada entrega deve ser feita em um notebook Jupyter (ou Google Colab) contendo:

### Entrega 1 (16/04/26):** Definição e exploração dos dados

* Escolher o problema de ML (classificação, clustering, regressão etc.) e justificar a escolha
* Carregar o dataset e explorar as colunas, tipos e distribuição dos dados
* Identificar valores ausentes, classes desbalanceadas e possíveis problemas
* Definir a entrada e a saída esperada do modelo

### Entrega 2 (23/04/26):** Pré-processamento e preparação dos dados

* Limpar os dados: remover ou preencher valores ausentes, tratar inconsistências, mormalizar, codificar variáveis categóricas (se necessário), etc
* Para atributos textuais, aplicar técnicas de representação (TF-IDF, CountVectorizer ou embeddings)

### Entrega 3 (28/04/26):** Treinamento e avaliação do modelo

* Separar os dados em treino e teste (mínimo 70% / 30%). Pode usar validação cruzada para uma avaliação mais robusta.
* Treinar pelo menos 1 modelo de Machine Learning adequado ao problema escolhido
* Calcular as métricas apropriadas 
* Gerar matriz de confusão, relatório de classificação ou visualização do clustering
* (Bônus) Treinar um segundo modelo para comparação

### Entrega 4 (30/04/26):** Análise crítica e apresentação

* Redigir a análise: o modelo aprendeu algo útil? Onde erra mais? Por quê?
* Apresentação oral (5 min por equipe) explicando o projeto, os resultados e as conclusões