# Portfolio CLI

This is a portfolio project built using [Next.js](https://nextjs.org/) and React. The project simulates a command-line interface (CLI) to navigate through different sections of the portfolio.

## Table of Contents

- [Getting Started](#getting-started)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/achrafxx/portfolio-cli.git
cd portfolio-cli
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Commands

The CLI supports the following commands:

- `h, help`: Display the help message
- `p, projects`: Show all projects directories
- `project <name>`: Navigate to a project directory
- `e, experiences`: Show all experience directories
- `experience <name>`: Navigate to an experience directory
- `a, about`: Show information about me

For example, to list all projects, you can type projects or p and press enter.

## Project Structure

portfolio-cli/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── components/
│   │   ├── output/
│   │   │   ├── OutputFactory.tsx
│   │   │   ├── experience/
│   │   │   │   ├── DetailedExperience.tsx
│   │   │   │   ├── ExperiencesOutput.tsx
│   ├── context/
│   │   ├── InputRefContext.tsx
│   ├── hooks/
│   │   ├── useInputHandler.ts
│   │   ├── useOutput.ts
│   │   ├── useContextPath.ts
│   │   ├── useCommandExecutor.ts
│   │   ├── useDelayedDisplay.ts
│   │   ├── useInputHistory.ts
│   │   ├── useSuggestions.ts
│   │   ├── useSpecialCommands.ts
│   │   ├── useCheckEnv.ts
│   │   ├── swr/
│   │   │   ├── useGetUsername.ts
│   ├── styles/
│   │   ├── globals.css
├── public/
│   ├── images/
├── package.json
├── README.md


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [React Documentation](https://reactjs.org/docs) - learn about React features and API.

## Deploy on Vercel

The easiest way to deploy this project is to use the [Vercel Platform](https://vercel.com/new?utm_source=achrafxx&utm_campaign=oss).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
