# Frontend-2024

Front end repo for the IEEE AAST Alex SB website for the 2024 season

## To set up:

In an integrated VSCode terminal or Git Bash:

- Clone this repo on your device:

```bash
git clone https://github.com/IEEE-AAST-Alexandria-Student-Branch/Frontend-2024
```

- Open the directory: `cd Frontend-2024`

- Install npm packages: `npm install`

## To run, after installing:

- Run development build: `npm run dev`

## Design guide:

Our design should follow [this template](https://xd.adobe.com/view/360876a4-a18b-4a86-9505-fdd8c336159f-635b/).

## Directory structure:

The app is located at `src/App.tsx`

The pages accessed by the router are in `src/pages/`

All page-specific styles are in `src/pages/styles`
<br/>(We will soon import the styles into tailwind)

All components are stored in `src/components/`

- Common components to be used in multiple pages are in `src/components/common/`
- Page-specific components are in `src/components/<Page Name Here>/`
- Each page inside `src/components/` has a "styles" folder for css files to be used for its components
- All css files must be named after their component

All assets (images, icons, etc.) go in `src/assets/`

When editing or adding anything please respect the naming convention and keep the directory organized

Happy coding!

