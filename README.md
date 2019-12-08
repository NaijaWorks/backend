# NaijaHacks Hackathon 2019

## Team NaijaWorks
This is the backend repo for the
[#Naijaworks](https://github.com/NaijaWorks) hackathon project. See frontend repo [here](https://github.com/NaijaWorks/frontend)

## Team Members and Roles
* [`Isaac Aderogba (Isaac)`](https://github.com/IsaacAderogba) - Experienced Full Stack Developer. He will complete our project's UI/UX Design with Figma. He will also initiate the front-end implementation using Typescript React
* [`Oloruntobi Awoderu (Toby)`](https://github.com/OloruntobiAwoderu) - Experienced Full Stack Developer. He will work together with Jose in implementing the Backend using GraphQL and MongoDB and switch to complete some layouts of the frontend
* [`Josemaria Nriagu (Jose)`](https://github.com/josenriagu) - Experienced Full Stack Developer. He will work together with Toby for the backend as well as fnishing up the frontend with Isaac

# Problem

Lack of appropriate and unified platform for creative techies in Nigeria to showcase their skillset and get better exposure.

## Proposed Solution - NaijaWorks
A platform for discovering IT skills within Nigeria. Users will get to create account and update their profiles with their stacks and relevant projects and ways for prospective clients to get in touch with them. As a stretch goal, we will build ways to filter results based on specific states and/or cities.

## Benefits

- To serve as a one stop pool of nigerian tech skills for clients seeking these skills.
- Reduce rate of unemployment in Nigeria.

## Design Flows & Mockup
To fully understand our design flows and data schema, see our [Figma Design Document](https://www.figma.com/file/DKxIYlDY6iBsQUP0pbcQ13/NaijaHacks?node-id=0%3A1)

## What Stacks do we intend to use?
* Typescript React for Frontend
* Apollo Client for innteracting to GraphQL server
* Node/Express for Backend
* MongoDB for Data Management
* GraphQL for API

## Top-level directory layout - Frontend (sample)

    .
    ├── data                    # GraphQl files (alternatively `graphql` or `server`)
    ├── public                  # Compiled files (alternatively `dist`)
    ├── src                     # Source files (alternatively `lib` or `app`)
    └── README.md   


## How to setup project and run locally

### Clone the repositories

Backend

```
git@github.com:NaijaWorks/backend.git
```
Frontend
```
git clone git@github.com:NaijaWorks/frontend.git
```

### Install all dependencies

Using yarn

```
yarn install
```

Using npm

```
npm install
```

### Start backend server

Using yarn

```
yarn server
```

Using npm

```
npm server
```     

### Start Frontend project on browser

Using yarn

```
yarn start
```

Using npm

```
npm start
```     