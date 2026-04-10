# Projeto Avaliativo: Machine Learning com Dados de Chamados

O objetivo é aplicar técnicas de **Machine Learning** em um dataset real de chamados (helpdesk), permitindo que cada grupo **defina o problema**, desenvolva um modelo e **avalie seu desempenho com métricas adequadas**.

Você recebeu um conjunto de dados contendo registros de chamados com atributos como:

* Título
* Categoria
* Prioridade
* Status
* Datas

A partir desse dataset, você deverá: **Definir um problema de Machine Learning e construir uma solução avaliada por métricas**

---

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

---

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

---

## Métricas

Escolha as métricas adequadas ao tipo de problema do seu grupo:

| Tipo de problema | Métricas sugeridas |
|---|---|
| Classificação | Accuracy, Precision, Recall, F1-score (macro e weighted), Matriz de confusão |
| Regressão | MAE (Erro Absoluto Médio), RMSE (Raiz do Erro Quadrático Médio) |
| Clustering | Silhouette Score, Elbow Method (para escolha do número de clusters), análise qualitativa dos grupos |
| Similaridade / Busca | Similaridade de cosseno, avaliação manual dos resultados |

> ⚠️ **Atenção sobre desbalanceamento de classes:** datasets de chamados costumam ter distribuição desigual entre categorias (ex: muitos chamados de "baixa prioridade" e poucos de "alta"). Nesses casos, a *accuracy* pode ser enganosa. Analise o relatório de classificação completo (`classification_report` do scikit-learn) e prefira o **F1-score macro** como métrica principal.

---

## Referências de algoritmos

Escolha algoritmos compatíveis com o tipo de problema. Abaixo estão sugestões organizadas por tipo:

* **Classificação:** Naive Bayes (bom ponto de partida para texto), Regressão Logística, SVM, Random Forest, Gradient Boosting
* **Regressão:** Regressão Linear, Ridge, Random Forest Regressor
* **Clustering:** K-Means, DBSCAN
* **Similaridade:** TF-IDF + Cosine Similarity, Sentence Transformers (embeddings)

**Bibliotecas recomendadas:** `scikit-learn`, `pandas`, `matplotlib`, `seaborn`. Para embeddings avançados: `sentence-transformers`.

---

## Desafio opcional (bônus ⭐)

O grupo pode aumentar sua nota realizando a **comparação entre dois ou mais modelos ou abordagens**. O bônus deve incluir:

* Comparação direta das métricas entre os modelos
* Discussão sobre as diferenças observadas
* Escolha justificada do melhor modelo

**Exemplos de comparações válidas:**
* Classificação: Naive Bayes vs. Regressão Logística vs. SVM
* Clustering: K-Means vs. DBSCAN
* Representação de texto: TF-IDF vs. embeddings pré-treinados

---

## Entregáveis

### 1. Código do projeto
Notebook ou script com todo o pipeline: leitura dos dados → pré-processamento → separação treino/teste → treinamento → avaliação.

### 2. Relatório (ou README) com as seguintes seções:

* Problema escolhido e justificativa
* Pré-processamento realizado
* Modelo(s) utilizado(s)
* Métricas utilizadas (com explicação do que cada uma representa)
* Resultados obtidos e análise crítica

### 3. Demonstração

* Apresentação oral (5–10 minutos) explicando o projeto, os resultados e as conclusões