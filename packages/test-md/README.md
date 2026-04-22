# Test Markdown

```ts
// Export `default` should be ignored.
export default function test() {
  console.log("Hello, world!");
}

// eslint-disable-next-line ts/array-type -- `ts` should validate this.
const a: string[] = ["Hello", "world!"];
const b: Array<string> = ["Hello", "world!"];
```

```tsx
// `react/exhaustive-deps` should be ignored in markdown files.
useEffect(() => {
  console.log(state);
}, []);

const MyComponent = () => {
  const [state, setState] = useState(0);
  useEffect(() => {
    console.log(state);
    // eslint-disable-next-line react/exhaustive-deps -- `@eslint-react` should validate this.
  }, []);
  return <div>Hello, world!</div>;
};
```
