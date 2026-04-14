We initially introduced [Chart Widgets](#/widgets/data-display/deprecated-charts) based on [Recharts](https://recharts.org/) with the goal of customizing them to align with Plasma's theming concepts.
However, this approach required significant effort and was never fully completed, we also did not achieve the desired accessibility standards for charts.

Meanwhile, Recharts has evolved significantly and now provides a mature, comprehensive set of chart components that extend far beyond the basic charts we had originally adopted.
Therefore, from version 38.1.1, we have decided to deprecate our custom Chart Widgets and recommend using Recharts directly for any charting needs.

This guide helps you migrate from the deprecated Charts Widget to direct Recharts usage.

## Installation

First, ensure you have Recharts installed in your project:

```cmd
// By npm
npm install recharts

// By pnpm
pnpm install recharts
```

## Chart Migration Guides

After that, you can start migrating your existing Chart Widgets to Recharts components.
We have created specific migration guides to assist you in this transition.
Please refer to the following guides based on the chart type you are using:

- [Bar Chart](#/get-started/migration-instructions/chart-widgets-to-recharts/bar-chart-migration)
- [Line Chart](#/get-started/migration-instructions/chart-widgets-to-recharts/line-chart-migration)
- [Pie Chart](#/get-started/migration-instructions/chart-widgets-to-recharts/pie-chart-migration)

## Key Differences

### 1. Component Structure

- **Before**: Single component with properties
  ```tsx
  <BarChart showLegend xAxisDataKey="name" />
  ```
- **After**: Composed components with children
  ```tsx
  <BarChart>
  	<Legend />
  	<XAxis dataKey="name" />
  </BarChart>
  ```

### 2. Styling

- **Before**: Custom properties for styling
  ```tsx
  <BarChart barPropsMap={{ value1: { fill: "blue" } }} />
  ```
- **After**: Component-based styling with individual properties
  ```tsx
  <BarChart>
  	<Bar dataKey="value1" fill="blue" />
  </BarChart>
  ```

### 3. Event Handling

- **Before**: Custom event handlers
  ```tsx
  <BarChart onLegendClick={handleClick} />
  ```
- **After**: Recharts native event handlers
  ```tsx
  <BarChart>
  	<Legend onClick={handleClick} />
  </BarChart>
  ```

### 4. Accessibility

- **Before**: Limited accessibility features.
- **After**: Recharts provides better support for accessibility. Refer to the [Recharts Storybook > API > Accesibility](https://recharts.github.io/en-US/storybook/).

### 5. Additional Features

Recharts provides a broad set of features and customization options that were not available in the deprecated Chart Widgets.
To make the most of its capabilities, explore the [Recharts Storybook](https://recharts.github.io/en-US/storybook/).

Lastly, you can find examples of common use cases in the [Recharts Examples](https://recharts.github.io/en-US/examples/).
