# GitHub Portfolio Component

A customizable React component that creates a beautiful GitHub portfolio display. This component shows your GitHub profile information, latest repositories, and language statistics in a modern, responsive interface.

## Features

- shadcn/ui components
- Language statistics visualization
- Fully responsive design
- Real-time GitHub data fetching
- TypeScript support
- Loading states and error handling

## Screenshot

![](/src/assets/screenshots/repo-light.png)
![](/src/assets/screenshots/repo-dark.png)
![](/src/assets/screenshots/stats-light.png)
![](/src/assets/screenshots/stats-dark.png)

## Installation

1. First, install the required dependencies:

```bash
npm install @shadcn/ui recharts lucide-react
# or
yarn add @shadcn/ui recharts lucide-react
```
(If you are having trouble installing shad, here is the documentaion explaing the process step by step [https://ui.shadcn.com/docs/installation](https://ui.shadcn.com/docs/installation))

2. Install the necessary shadcn/ui components:

```bash
npx shadcn-ui@latest add card tabs
```

3. Copy the `GitHubStats.tsx` component into your project.

## Usage

```tsx
import GitHubStats from './components/GitHubStats';

function App() {
  return (
    <GitHubStats
      username='your-username'
      defaultTheme="dark" // Removing this prop will set the default theme to light :)
    />
  );
}
```

## Customization

### Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by:

1. Passing additional classes via the `className` prop
2. Modifying the existing Tailwind classes in the component
3. Overriding the shadcn/ui theme

## Error Handling

The component includes built-in error handling for:
- Failed API requests
- Invalid usernames
- Rate limiting
- Network issues

Error messages are displayed to the user in a friendly and easy to read format.

## TypeScript Support

The component includes TypeScript interfaces for:
- Component props
- GitHub API responses
- Chart data

## Contributing

Feel free to submit issues and enhancement requests!
