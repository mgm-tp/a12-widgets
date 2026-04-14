When migrating from the Bar Chart Widget to direct usage of Recharts, certain deprecated APIs need to be replaced with their corresponding Recharts components and properties.

## Deprecated APIs and Their Recharts Equivalents

Below is a mapping of deprecated APIs to their Recharts equivalents for Bar Chart.

| Deprecated API      | Recharts Equivalent                                                                                                                            |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| cartesianGridProps  | [<CartesianGrid />](https://recharts.github.io/en-US/api/CartesianGrid/)                                                                       |
| xAxisProps          | [<XAxis />](https://recharts.github.io/en-US/api/XAxis/)                                                                                       |
| xAxisDataKey        | [<XAxis dataKey />](https://recharts.github.io/en-US/api/YAxis/#dataKey)                                                                       |
| xAxisLabel          | [<XAxis label />](https://recharts.github.io/en-US/api/XAxis/#label)                                                                           |
| xAxisLabelProps     | [<Label />](https://recharts.github.io/en-US/api/Label/)                                                                                       |
| yAxisProps          | [<YAxis />](https://recharts.github.io/en-US/api/YAxis/)                                                                                       |
| yAxisLabel          | [<YAxis label />](https://recharts.github.io/en-US/api/YAxis/#label)                                                                           |
| yAxisLabelProps     | [<Label />](https://recharts.github.io/en-US/api/Label/)                                                                                       |
| tooltipProps        | [<Tooltip />](https://recharts.github.io/en-US/api/Tooltip/)                                                                                   |
| barPropsMap         | [<Bar />](https://recharts.github.io/en-US/api/Bar/)                                                                                           |
| cellPropsList       | [<Cell />](https://recharts.github.io/en-US/api/Cell/)                                                                                         |
| labelKey            | [<Legend />](https://recharts.github.io/en-US/api/Legend/)                                                                                     |
| thresholdProps      | [<Area />](https://recharts.github.io/en-US/api/Area/) and wrapped by [<ComposedChart />](https://recharts.github.io/en-US/api/ComposedChart/) |
| aboveThresholdStyle | [<Cell />](https://recharts.github.io/en-US/api/Cell/)                                                                                         |
| belowThresholdStyle | [<Cell />](https://recharts.github.io/en-US/api/Cell/)                                                                                         |
| showLegend          | [<Legend />](https://recharts.github.io/en-US/api/Legend/)                                                                                     |
| showTooltip         | [<Tooltip />](https://recharts.github.io/en-US/api/Tooltip/)                                                                                   |
| onLegendClick       | [<Legend onClick />](https://recharts.github.io/en-US/api/Legend/#onClick)                                                                     |

For the complete list and documentation of all Recharts Bar Chart components, please refer to the [BarChart API](https://recharts.github.io/en-US/api/BarChart/).

## Deprecated Types and Their Recharts Equivalents

And below is a mapping of deprecated types to their Recharts equivalents for Bar Chart.

| Deprecated Type | Recharts Equivalent                                                                    |
| :-------------- | :------------------------------------------------------------------------------------- |
| Layout          | [<Bar layout />](https://recharts.github.io/en-US/api/Bar/#layout)                     |
| VerticalAlign   | [<Legend verticalAlign />](https://recharts.github.io/en-US/api/Legend/#verticalAlign) |
| Align           | [<Legend align />](https://recharts.github.io/en-US/api/Legend/#align)                 |

**NOTE:** Some Widgets' custom elements, such as Bar Chart template's `Legend` and `Item` are also deprecated. Therefore, relying solely on Recharts may not provide the same result.
If you still wish to implement these functionalities, please refer to the Widgets core's existing implementation to apply the necessary customizations in your project.

## Migration Example

This is a practical example of how to migrate from the legacy Bar Chart Widget.

- **Before:** Single component with properties

  ```tsx
  import { ResponsiveChartContainer, BarChart } from "@com.mgmtp.a12.widgets/widgets-core/lib/chart/index.js";

  const DATA = [
  	{ product: "Apple", sale: 120 },
  	{ product: "Peach", sale: 150 },
  	{ product: "Grapes", sale: 100 },
  	{ product: "Strawberry", sale: 90 },
  	{ product: "Blueberry", sale: 140 }
  ];

  const BAR_PROPS_MAP = {
  	sale: {
  		dataKey: "sale",
  		color: "#0088FE"
  	}
  };

  <ResponsiveChartContainer aspect={1} maxHeight={400}>
  	<BarChart
  		barSize={40}
  		data={DATA}
  		labelKey="product"
  		xAxisProps={{ dataKey: "product" }}
  		xAxisLabel="Product"
  		xAxisLabelProps={{ position: "insideBottom", offset: -5 }}
  		yAxisLabel="Sale"
  		barPropsMap={BAR_PROPS_MAP}
  		cartesianGridProps={{
  			horizontal: true,
  			vertical: true
  		}}
  	/>
  </ResponsiveChartContainer>;
  ```

- **After:** Composed components with children from Recharts directly

  ```tsx
  import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

  const DATA = [
  	{ product: "Apple", sale: 120 },
  	{ product: "Peach", sale: 150 },
  	{ product: "Grapes", sale: 100 },
  	{ product: "Strawberry", sale: 90 },
  	{ product: "Blueberry", sale: 140 }
  ];

  <ResponsiveContainer aspect={1} maxHeight={400}>
  	<BarChart data={DATA} barSize={40}>
  		<CartesianGrid stroke="#f1f2f4" strokeDasharray="2 4" strokeWidth={2} />
  		<XAxis dataKey="product" label={{ value: "Product", position: "insideBottom", offset: -5 }} />
  		<YAxis label={{ value: "Sale", angle: -90, position: "insideLeft" }} />
  		<Tooltip />
  		<Bar dataKey="sale" fill="#0088FE" />
  	</BarChart>
  </ResponsiveContainer>;
  ```
