## Overall structure

The core idea of the plasma design concept is that we call the **Application Frame**. This template is device independent and consists of:

![overall structure](images/overall_structure.png)

## Main Area

The main area consists of:

![main area](images/main_area.png)

1. **Application Header**
   - The application header provides up to 4 slots for different information. In case the application needs/have more application wide information we allow the possibility of grouping information for example by the usage of a pop up menu.
2. **Main Menu**
   - We recommend to only use up to 7 navigation points for the first level.
   - We don't recommend more than 3 navigation levels. For a higher complexity we recommend the usage of the sub navigation placed in the sub area.
   - This menu should only be used for domain-level navigation hierarchies. Eg. categories like pants, shirts but NOT red pants, blue pants etc. For those we recommend the usage of the sub navigation placed in the sub area.

## Sub Area

The sub area is optional and can consist of:

![sub area](images/sub_area.png)

1. **Free information**
   - E.g. information like author of the document, weather etc.
2. **Sub navigation**
   - This should be used for a complex sub navigation.
   - Recommended depth of max. 4 levels.
   - For less complicated sub navigation we recommend using the tab navigation within our contentbox.
   - Each navigation point can lead to a different layout used in the content area.
3. **Features like**
   - Application wide actions, chats etc. are imaginable.
4. **Context specific actions**
   - Based on the content.

## Content Area

The content area consists of layouts fulfilling different requirements. Right now we are supporting 2 layouts out of the box.

![content area](images/content_area.png)

1. Single box
2. Master Detail

Each white panel shown here is represented as a contentbox.

## Code Example

Here's how to implement a basic Application Frame:

```typescript jsx
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core";
import { ContentBox } from "@com.mgmtp.a12.widgets/widgets-core";

const MyApplication = () => {
  return (
    <ApplicationFrame
      header={
        <ApplicationHeader
          slots={{
            left: <Logo />,
            center: <SearchBar />,
            right: <UserMenu />
          }}
        />
      }
      mainMenu={
        <SlidingMenu
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Products", href: "/products" },
            { label: "Orders", href: "/orders" }
          ]}
        />
      }
      sub={<SubNavigation />}
      content={
        <ContentBox>
          <YourMainContent />
        </ContentBox>
      }
    />
  );
};
```

For responsive behavior and sidebar options:

```typescript jsx
<ApplicationFrame
  responsive
  sidebarConfig={{
    expandedSubState: true,
    subResizableOptions: {
      minWidth: 200,
      maxWidth: 400
    }
  }}
  // ...other props
/>
```
