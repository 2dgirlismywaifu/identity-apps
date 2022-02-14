# Unit Tests

Product Unit tests have been implemented using [Jest](https://jestjs.io/) along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).
Make sure to write unit tests when you are working on new or existing features.

## Structuring Tests

Tests should be properly structured. Checkout the following examples.

### Example 01

Let's say that you have a component called `applications-page.tsx` at the root of `features/applications` that needs to be tested.

#### Steps

1. Create a `__tests__`(underscore-underscore-tests-underscore-underscore 😉) under `features/applications`.
2. Create a file with the pattern `<FILE_NAME>.test.<FILE_EXTENSION>` inside the `__tests__` folder. (In this case `applications-page.test.tsx`).

>> Naming the test container folders `__tests__` This pattern seems to be the best when there)

#### Folder Structure

```
features
└── applications
    ├── __tests__
    |       └── applications-page.test.tsx
    └── applications-page.tsx
```

### Example 02

Let's say that you have a component called `applications-list.tsx` at the root of `features/applications/components` that needs to be tested.

#### Steps

1. Create a `__tests__` under `features/applications/components`.
2. Create a file with the pattern `<FILE_NAME>.test.<FILE_EXTENSION>` inside the `__tests__` folder. (In this case `applications-list.test.tsx`).

#### Folder Structure

```bash
features
└── applications
    ├── __tests__
    ├── components
    |       └── __tests__
    |       |       └── applications-list.test.tsx
    |       └── applications-list.tsx
    └── applications-page.tsx
```

## Writing Tests

Writing unit tests for every component that you develop is mandatory.
Take a look at the following example test case where we test if the component that we are writing mounts and renders as expected.

```tsx
import { render } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { ApplicationList } from "../../../components/applications";

describe("Test if the Application List is working as expected", () => {
    it("<ApplicationList /> renders without exploding", () => {
        const component = render(<ApplicationList />);
        expect(component.getByTestId("application-list")).toBeInTheDocument();
    });
});
```

:bulb: Note that we use a custom `render` function here rather than from the `@testing-library/react` module. The reason for
this is that we need to wrap our components with providers like `Redux` etc. And doing this in every test case is a
tedious task. So we have written a custom renderer following the guide in
[official documentation][react-testing-library-custom-renderer]. `@unit-testing` is a webpack alias added to avoid importing this function using relative paths.

### Identifying Elements in DOM

As a practice we use `data-componentid`(../../modules/core/src/models/core.ts) inorder to make our tests resilient to change.
Use the [getByTestId](https://testing-library.com/docs/queries/bytestid/) method to access with the component id.

#### Example: Assert on components with `getByTestId`.

```typescript jsx
expect(component.getByTestId("getting-started-page-layout")).toBeInTheDocument();
```

:no_entry: Never use any other selectors such as `id`, `classes`, etc. to identify the elements.

If there are no `data-componentid` present in the element, extend the [IdentifiableComponentInterface](../../modules/core/src/models/core.ts) from `@wso2is/core/models` to inherit the attribute.

#### Example: Inheriting `data-componentid`

```typescript jsx

export interface SampleComponentInterface extends IdentifiableComponentInterface {

    // Other attributes
}

export const SampleComponent: FunctionComponent<SampleComponentInterface> = (
    props: SampleComponentInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        // Other props
    } = props;
}

```

:warning: Some components might have the `data-testid` already implemented using the [TestableComponentInterface](../../modules/core/src/models/core.ts).
This interface and the data attribute since has been **deprecated*. Hence, :boom: **DO NOT USE IT** in new components. Refactor the usage where ever possible.

### Snapshot Testing

Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.

A typical snapshot test case renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.

```
it("<ApplicationList /> matches snapshot", () => {
    const component = render(<ApplicationList />);
    expect(component.container).toMatchSnapshot();
});
```

For further reference, checkout the official documentation of [React Testing Library][react-testing-library].

## Running the test suite

Following are few of the useful commands that you can use to run the existing unit tests for modules.

### Run Tests for all modules

```bash
# From project root.
npm run test
```

### Run Tests for all modules in watch mode

```bash
# From project root.
npm run test:watch
```

### Run Tests for individual component

#### Using Lerna

```bash
# From anywhere inside the project.
npx lerna run test --scope @wso2is/forms
```

#### From the project root.

```bash
# Run tests for modules.
npm run test:unit:modules
```

```bash
# Run tests for apps.
npm run test:unit:apps
```

```bash
# Run tests for specific module. (Replace <MODULE_NAME> with something like `@wso2is/core` or `@wso2is/myaccount`)
npm run test:unit:<MODULE_NAME>
```

#### From inside respective component.

```bash
# From inside component ex: apps/console. Use `npm run test:watch for watch mode.
npm run test
```

## Code Coverage

### Generate coverage report

```bash
# From the root of the project.
npm run test:unit:coverage
```

[react-testing-library]: https://testing-library.com/docs/
[react-testing-library-custom-renderer]: https://testing-library.com/docs/react-testing-library/setup#custom-render
