# Fitness Tracker App

Uma aplicação web completa para acompanhamento de fitness, dieta e exercícios, desenvolvida com React, TypeScript e várias bibliotecas modernas.


![Screenshot do Projeto](.\fitness-tracker-app-src\src\assets\images\fitness.png)

## Funcionalidades

- **Dashboard interativo** com resumo de atividades e estatísticas
- **Sistema de gestão de dieta** com registo de refeições e cálculo nutricional
- **Sistema de metas** com acompanhamento de progresso
- **Gestão de exercícios e treinos** com biblioteca de exercícios
- **Visualização de progresso** com gráficos interativos
- **Perfil de utilizador** com cálculo de necessidades calóricas
- **Design responsivo** adaptado para todos os dispositivos
- **Persistência local** de dados usando localStorage

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **Redux Toolkit** para gestão de estado
- **React Router** para navegação
- **Recharts** para gráficos interativos
- **React Hook Form** para formulários
- **Date-fns** para manipulação de datas
- **UUID** para geração de IDs únicos
- **Vite** como bundler e servidor de desenvolvimento

## Estrutura do Projeto

```
fitness-tracker-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── diet/
│   │   ├── exercise/
│   │   ├── goals/
│   │   ├── layout/
│   │   └── progress/
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   ├── exercises.ts
│   │   └── foods.ts
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Diet.tsx
│   │   ├── Exercises.tsx
│   │   ├── Goals.tsx
│   │   ├── Profile.tsx
│   │   └── Progress.tsx
│   ├── store/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Como Iniciar

1. Clone o repositório ou extraia o arquivo zip
2. Abra a pasta no VSCode
3. Abra um terminal e execute:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

4. Acesse a aplicação no navegador através do endereço indicado (geralmente http://localhost:5173)

## Funcionalidades Detalhadas

### Dashboard

O dashboard apresenta um resumo das atividades do utilizador, incluindo:
- Resumo calórico diário
- Gráfico de balanço calórico dos últimos 7 dias
- Distribuição de macronutrientes
- Progresso das metas ativas
- Próximos treinos agendados
- Refeições do dia

### Dieta

A página de dieta permite:
- Registar refeições (pequeno-almoço, almoço, jantar, lanches)
- Adicionar alimentos às refeições
- Visualizar informações nutricionais
- Acompanhar o consumo calórico diário
- Pesquisar alimentos na base de dados

### Exercícios

A gestão de exercícios inclui:
- Criar treinos personalizados
- Adicionar exercícios a partir da biblioteca
- Definir séries, repetições e pesos
- Marcar exercícios como concluídos
- Calcular calorias queimadas

### Metas

O sistema de metas permite:
- Criar metas personalizadas (peso, medidas, força, etc.)
- Definir valores iniciais e objetivos
- Acompanhar o progresso em percentagem
- Registar checkpoints ao longo do tempo
- Visualizar metas concluídas

### Progresso

A visualização de progresso oferece:
- Gráficos interativos para diferentes métricas
- Análise de tendências ao longo do tempo
- Filtros por período (semana, mês, ano)
- Resumo estatístico das atividades

### Perfil

O perfil do utilizador permite:
- Configurar dados pessoais
- Definir objetivos de fitness
- Calcular necessidades calóricas diárias
- Personalizar a experiência

## Personalização

A aplicação foi projetada para ser facilmente personalizável. Você pode:
- Adicionar novos alimentos à base de dados em `src/data/foods.ts`
- Expandir a biblioteca de exercícios em `src/data/exercises.ts`
- Modificar os estilos em `src/index.css` e `src/App.css`
- Adicionar novas funcionalidades estendendo os reducers em `src/store/index.ts`

## Licença

Este projeto é disponibilizado como código aberto sob a licença MIT.

---

Desenvolvido com ❤️ para ajudar você a alcançar seus objetivos de fitness.
