When migrating from the Line Chart Widget to direct usage of Recharts, certain deprecated APIs and types need to be replaced with their corresponding Recharts components and properties.

## Deprecated APIs and Their Recharts Equivalents

Below is a mapping of deprecated APIs to their Recharts equivalents for Line Chart.

| Deprecated API      | Recharts Equivalent                                                                                                                            |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| cartesianGridProps  | [<CartesianGrid />](https://recharts.github.io/en-US/api/CartesianGrid/)                                                                       |
| xAxisProps          | [<XAxis />](https://recharts.github.io/en-US/api/XAxis/)                                                                                       |
| xAxisDataKey        | [<XAxis dataKey />](https://recharts.github.io/en-US/api/YAxis/#dataKey)                                                                       |
| xAxisLabel          | [<XAxis label />](https://recharts.github.io/en-US/api/XAxis/#label)                                                                           |
| yAxisProps          | [<YAxis />](https://recharts.github.io/en-US/api/YAxis/)                                                                                       |
| yAxisLabel          | [<YAxis label />](https://recharts.github.io/en-US/api/YAxis/#label)                                                                           |
| tooltipProps        | [<Tooltip />](https://recharts.github.io/en-US/api/Tooltip/)                                                                                   |
| linePropsMap        | [<Line />](https://recharts.github.io/en-US/api/Line/)                                                                                         |
| legendProps         | [<Legend />](https://recharts.github.io/en-US/api/Legend/)                                                                                     |
| thresholdLineProps  | [<Area />](https://recharts.github.io/en-US/api/Area/) and wrapped by [<ComposedChart />](https://recharts.github.io/en-US/api/ComposedChart/) |
| comparableAreaProps | [<Area />](https://recharts.github.io/en-US/api/Area/) and wrapped by [<ComposedChart />](https://recharts.github.io/en-US/api/ComposedChart/) |
| showLegend          | [<Legend />](https://recharts.github.io/en-US/api/Legend/)                                                                                     |
| showAndHideLines    | [<Line />](https://recharts.github.io/en-US/api/Line/)                                                                                         |
| onLegendClick       | [<Legend onClick />](https://recharts.github.io/en-US/api/Legend/#onClick)                                                                     |
| onDotClick          | [<Line activeDot />](https://recharts.github.io/en-US/api/Line/#activeDot)                                                                     |

For the complete list and documentation of all Recharts Line Chart components, please refer to the [LineChart API](https://recharts.github.io/en-US/api/LineChart/).

## Deprecated Types and Their Recharts Equivalents

And below is a mapping of deprecated type to its Recharts equivalents for Line Chart.

| Deprecated type | Recharts Equivalent                                        |
| :-------------- | :--------------------------------------------------------- |
| LegendProps     | [<Legend />](https://recharts.github.io/en-US/api/Legend/) |

**NOTE:** Some Widgets' custom elements, such as Line Chart template's `Legend` and `Item` are also deprecated. Therefore, relying solely on Recharts may not provide the same result.
If you still wish to implement these functionalities, please refer to the Widgets core's existing implementation to apply the necessary customizations in your project.

## Migration Example

This is a practical example of how to migrate from the legacy Line Chart Widget.

- **Before:** Single component with properties

  ```tsx
  import { ResponsiveContainer, LineChart } from "@com.mgmtp.a12.widgets/widgets-core/lib/chart/index.js";

  const DATA = [
  	{ name: "A", desktop: 170 },
  	{ name: "B", desktop: 150 },
  	{ name: "C", desktop: 140 },
  	{ name: "D", desktop: 125 },
  	{ name: "E", desktop: 100 }
  ];

  const LINE_PROPS_MAP = {
  	desktop: {
  		dataKey: "desktop",
  		stroke: "#0088FE",
  		strokeWidth: 2
  	}
  };

  <ResponsiveChartContainer aspect={0.5} maxHeight={300}>
  	<LineChart data={DATA} xAxisProps={{ dataKey: "name", tick: false }} linePropsMap={LINE_PROPS_MAP} />
  </ResponsiveChartContainer>;
  ```

- **After:** Composed components with children from Recharts directly

  ```tsx
  import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip } from "recharts";

  const DATA = [
  	{ name: "A", desktop: 170 },
  	{ name: "B", desktop: 150 },
  	{ name: "C", desktop: 140 },
  	{ name: "D", desktop: 125 },
  	{ name: "E", desktop: 100 }
  ];

  <ResponsiveContainer aspect={0.5} maxHeight={300}>
  	<LineChart data={DATA}>
  		<XAxis dataKey="name" tick={false} />
  		<YAxis />
  		<Tooltip />
  		<Line dataKey="desktop" stroke="#0088FE" strokeWidth={2} />
  	</LineChart>
  </ResponsiveContainer>;
  ```
