# testispace-react-embed

Official React component for embedding TestiSpace testimonials on your website.

## Installation

```bash
npm install testispace-react-embed
```

## Usage

```tsx
import TestiSpaceEmbed from 'testispace-react-embed';

function App() {
  return (
    <div className="App">
        <h1>My Testimonials</h1>
        <TestiSpaceEmbed 
            spaceId="YOUR_SPACE_ID"
            layout="grid" // optional: grid, masonry, carousel, list
            style="modern" // optional: modern, minimal, classic, gradient
        />
    </div>
  );
}
```

## Publishing (For Maintainers)

1.  Navigate to this directory:
    ```bash
    cd packages/react-embed
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Build the package:
    ```bash
    npm run build
    ```

4.  Login to NPM (if not logged in):
    ```bash
    npm login
    ```

5.  Publish:
    ```bash
    npm publish --access public
    ```
