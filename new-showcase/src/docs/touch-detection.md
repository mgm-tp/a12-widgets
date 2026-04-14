### What is Device Detection

In Widgets we use **Device Detection** to detect device's capacities like touch handling and adapt the widget to achieve
the best user experience for each device type. Below is the list of widgets that currently have different versions base
on device type.

- [Date Picker](#/widgets/data-entry/pickers/date-picker): The Date Picker widget is shown in a popup on
  non-touch devices and is shown in a dialog on touch devices.
- [Time Picker](#/widgets/data-entry/pickers/time-picker): The Time Picker widget uses the same mechanism like
  date picker to provide good experience for touch devices. When touch input is detected, it provides a clock-like
  interface so user can easily use their finger to choose the time.
- [Autocomplete](#/widgets/data-entry/autocomplete): The Autocomplete widget adapts to a modal on touch device
  instead of an in-place dropdown. The layout is also more spacious and finger friendly.
- [Tooltip](#/widgets/data-display/tooltip): The Tooltip widget is shown in a pop-up when user hovers over an
  element on desktop. On mobile/tablet, tooltip is shown by touching on the element, and a modal will open. If content is too long,
  user can use their finger to scroll the content.

**Note**: Since we use JavaScript-based device detection and not media query to detect touch handling, it is not
possible to simply resize browser window to switch between widget's version. To do so, use browser developer tool and
switch to mobile mode (and reload), or simply view the widget on a touch device.

### Configure Device Detection

#### Use `configure(dcp)` function

All components in Widgets use **`provider`** which is a **global instance**
of **`MobileDetectDeviceClassProvider`** to **detect and decide** the **component version** (touch/none touch,
mobile/desktop/tablet). **To override** the default `provider`, **use** the function **`configure(dcp)`** with
the **`dcp`** is an **instance** of the **class** which is **inherited** from the **`DeviceClassProvider`**
interface.

Below is the example code which disables the touch detector for the whole application:

```typescript jsx
// Create a new class which is inherited from MobileDetectDeviceClassProvider (the class of default provider)
export class NewDeviceClassProvider extends MobileDetectDeviceClassProvider {
	// override the hasTouch function, make it always return false
	hasTouch(): boolean {
		return false;
	}
}

import {
	configure,
	MobileDetectDeviceClassProvider
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector";
import MobileDetect from "mobile-detect";
export class AppView extends React.Component<AppViewProp, AppViewState> {
	constructor(props: AppViewProp) {
		super(props);

		// create an instance of the NewDeviceClassProvider
		const newDeviceClassProvider = new NewDeviceClassProvider(
			new MobileDetect(typeof window !== "undefined" && window ? window.navigator.userAgent : "node.js")
		);

		// call configure function and pass the new provider
		configure(newDeviceClassProvider);
	}
}
```

**Note**: Our widgets already optimizing its behavior and layout bases on device types to provide the best user
experiment, overriding the default `provider` might disable these implementations, and it can cause some unwanted
behaviors or bugs (likes breaking layout on a mobile or small device, etc...), therefore, please use this feature
wisely.

#### Prototype overriding

We already know that all components in Widgets use **`provider`** which is a **global instance**
of **`MobileDetectDeviceClassProvider`** to **detect and decide** the **component version**, therefore we can
override its prototype to adjust the way the detector works

```typescript
MobileDetectDeviceClassProvider.prototype.hasTouch = function () {
	return false;
};
```

### Conditionally enable touch support

Instead of completely disabling touch support, we can also conditionally enable/disable it. This is helpful in case we
want to allow the user to control the behavior via some setting interface. See the menu in the widgets showcase in the upper right corner: In the "Device info" section there is an example of how the user can deactivate touch support even if the device has a touch surface.

Below is the code example which helps to implement Touch Support feature:

```typescript jsx
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector";
import { configure, MobileDetectDeviceClassProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/common";

export class App extends React.Component<{}, {}> {
  render(): React.ReactNode {
    {DeviceDetector.hasTouch() && (
      <Button
        label="Toggle touch support"
        onClick={toggleTouchSupport}
      />
    )}
  }
}

function toggleTouchSupport(): void {
  const touchSupport = getTouchSupport();
  localStorage.setItem("touchSupport", JSON.stringify(!touchSupport));
  window.location.reload();
}

function getTouchSupport(): boolean {
  const storedValue = localStorage.getItem("touchSupport");
  const touchSupport = storedValue !== null ? JSON.parse(storedValue) : DeviceDetector.hasTouch();
  if (!touchSupport) {
    localStorage.removeItem("touchSupport");
    disableTouchSupport();
  }
  return touchSupport;
}

function disableTouchSupport(): void {
  class NoTouchDeviceClassProvider extends MobileDetectDeviceClassProvider {
    // override the hasTouch function, make it always return false
    hasTouch(): boolean {
      return false;
    }
  }
  const newDeviceClassProvider = new NoTouchDeviceClassProvider(new MobileDetect(window.navigator.userAgent));
  configure(newDeviceClassProvider);
}
```
