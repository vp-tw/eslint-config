import { css, cx } from "@emotion/css";
import { useQuery } from "@tanstack/react-query";

import path from "pathe";
import {
  useEffect,
  // eslint-disable-next-line perfectionist/sort-named-imports -- `perfectionist` should validate this.
  useCallback,
  useRef,
  useState,
} from "react";

/**
 * `eslint-plugin-import-x` has been removed from `antfu/eslint-config`.
 *
 * See: [fix: remove eslint-plugin-import-x](https://github.com/antfu/eslint-config/commit/db5a31d)
 */
// #eslint-disable-next-line import/no-namespace -- `import/no-namespace` should validate this.
import * as React from "react";

// eslint-disable-next-line @emotion/syntax-preference -- Styles should be written using objects.
const emotionWithStringShouldBeInvalid = css`
  color: red;
`;

// Styles should be written using objects.
const emotionWithObjectShouldBeValid = css({
  color: "red",
});

// eslint-disable-next-line ts/array-type -- `ts` should validate this.
const a: string[] = ["Hello", "world!"];
const b: Array<string> = ["Hello", "world!"];

path.resolve("foo", ...a, ...b);

// eslint-disable-next-line react-hooks/rules-of-hooks -- `react-hooks` should validate this.
const onClick = useCallback(() => {}, []);

namespace MyComponent {
  export interface Props {
    foo: string;
    onClick?: (...args: Array<any>) => void;
  }
}

// eslint-disable-next-line jsdoc/require-returns-check -- `jsdoc` should validate this.
/**
 * @returns test
 *
 * @param _args
 */
const noop = (..._args: Array<any>) => {};

const MyComponent: React.FC<MyComponent.Props> = (props) => {
  const [_unusedState] = useState(0);
  const ref = useRef(null);
  noop(ref.current);

  // eslint-disable-next-line @tanstack/query/no-rest-destructuring -- `@tanstack/query` should validate this.
  const { data, ...rest } = useQuery({
    queryKey: ["todos"],
    queryFn: noop,
  });

  useEffect(() => {
    // eslint-disable-next-line no-console -- `no-console` should validate this.
    console.log({ props, data, rest });
    // eslint-disable-next-line react-compiler/react-compiler -- `react-compiler` should validate this.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `react-hooks` should validate this.
  }, []);

  return (
    <div
      onClick={onClick}
      className={cx(emotionWithObjectShouldBeValid, emotionWithStringShouldBeInvalid)}
    >
      Test
      {/* eslint-disable-next-line react-dom/no-unsafe-target-blank -- `react-dom` should validate this. */}
      <a target="_blank" href="https://example.com">
        Test
      </a>
    </div>
  );
};

const A: React.FC = () => "a";

/**
 * `eslint-plugin-import-x` has been removed from `antfu/eslint-config`.
 *
 * See: [fix: remove eslint-plugin-import-x](https://github.com/antfu/eslint-config/commit/db5a31d)
 */
// #eslint-disable-next-line import/no-default-export -- `import/no-default-export` should validate this.
export default MyComponent;

export {
  MyComponent,
  // eslint-disable-next-line perfectionist/sort-named-exports -- `perfectionist` should validate this.
  A,
};
