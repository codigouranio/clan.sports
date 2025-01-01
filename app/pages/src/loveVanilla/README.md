# Vanilla Lovers' Project  
*Celebrating the Art of Simplicity in Web Development*  

## Introduction  
Welcome to the **Vanilla Lovers' Project**! This initiative is a tribute to developers who cherish the elegance and freedom of plain JavaScript. It's for those who prefer the clarity and control of building applications without relying on frameworks like React or Angular.  

If you’re passionate about simplicity and want to explore the raw power of JavaScript, this project is your playground.

**Example in Action**: Check out [Clan Sports](https://www.clansports.club), a real-world project utilizing concepts from Vanilla Lovers' Project.  

## What's Inside  
This project is a showcase of how much can be achieved with pure JavaScript. No frameworks, no libraries—just clean, efficient, and well-documented code to inspire and empower developers. It's designed to help you:  
- Understand core JavaScript concepts better.  
- Build applications that are lightweight and efficient.  
- Appreciate the beauty of coding from scratch.  

## Technical Details  

### The Core Framework  
The **BaseApp** is the heart of this project, designed to manage different pages in your application. It leverages JavaScript's simplicity while enabling you to create dynamic and responsive applications.  

### ```createDiv``` Function
The ```createDiv``` function is the primary method for creating HTML elements. It returns an object with methods to customize the element further and add child elements or content.

Parameters:
* id: (optional) string - The id of the div.
* type: (optional) string - The tag type (defaults to div).
* className: (optional) string - The class of the div.

Example Usage:
```
const div = createDiv({
  id: "example-id",
  className: "example-class",
});
```

Methods of ```createDiv```:

```.add(child)```
Adds a child element to the parent div.

* child: (required) An element created with createDiv or another HTML element.

Example:
```
const parentDiv = createDiv({ className: "parent-class"})
   .add(createDiv({ className: "child-class" }));
```
```.addText(tag, text)```

Adds a text element (like h1, p, etc.) to the div.
* tag: (required) string - The type of text element (e.g., h1, p).
* text: (required) string - The content of the text element.

```.setHtml(htmlString)```

Sets the inner HTML of the element.

* htmlString: (required) string - HTML content as a string.

### Render Functionality

The framework uses a renderChild function to render elements to the DOM. The renderChild method appends the constructed UI to the desired parent container.

Example Usage:
```
render() {
   const root = createDiv({ id: "app-root" });
   this.renderChild(root);
}
```

### Comprehensive Example
Below is a full example of how to use the framework to build a complex UI:
```
const root = createDiv({
  id: "player-info",
  type: "article",
  className: "player-info-container",
})
  .add(
    createDiv({
      className: "player-header-wrapper",
    }).add(
      createDiv({ className: "player-header" }).add(
        createDiv({ id: "player-info" })
          .add(
            createDiv({ id: "player-name" }).addText(
              "h3",
              params[1].concat(" ", params[0])
            )
          )
          .add(
            createDiv({ id: "player-position" }).addText(
              "h6",
              "Year # " + params[2]
            )
          )
          .add(createDiv({ id: "player-number" }).addText("p", "88"))
          .add(
            createDiv({
              id: "player-following",
              className: "follow-button",
            }).addText("button", "Follow")
          )
      )
    )
  )
  .add(
    createDiv({ className: "player-body" }).add(
      createDiv({ className: "player-content" }).add(
        createDiv({ id: "player-article" }).setHtml(`
  <h1>Teams</h1>
  <pre>
  Player Information:
  - Full Name
  - Date of Birth
  - Age
  - Gender
  - Position(s): (e.g., Forward, Midfielder)
  </pre>
  <footer>
    <div class="profile-ownership">
      <p class="ownership-status">Controlled by: <span id="ownership-label">System</span></p>
      <button id="change-ownership" class="ownership-button">Change Ownership</button>
    </div>
  </footer>
        `)
      )
    )
  );

return this.renderChild(root);
```

### Lifecycle Hooks  
The BaseApp uses a lifecycle model with the following methods:  
1. **`beforeRender()`**: Prepares the page before rendering.  
2. **`render()`**: Renders the main content of the page.  
3. **`afterRender()`**: Executes post-render logic, such as API calls or DOM manipulation.  

### Data Management  
Two core methods ensure seamless data handling:  
- **`setData()`**: Updates the data and triggers a re-render. When this method is called, the `beforeRender()` and `render()` methods are executed. Instead of running `afterRender()` again, the **`updatedData()`** method is called to avoid infinite loops.  
- **`getData()`**: Retrieves the current data for the page or component.  

### Handling Dynamic Pages  
BaseApp enables dynamic page rendering based on:  
- **URL Parameters**  
- **Query Strings**  

This dynamic system makes it easy to handle multi-page applications with minimal overhead.  

### Typical Workflow  
1. During the first render:  
   - **`beforeRender()`**: Prepares and initializes the page.  
   - **`render()`**: Displays a progress loader or initial UI.  
   - **`afterRender()`**: Handles API calls or other asynchronous tasks to fetch and display data.  

2. When calling **`setData()`**:  
   - **`beforeRender()`**: Prepares for the update.  
   - **`render()`**: Re-renders the UI with the updated state.  
   - **`updatedData()`**: Updates specific components or parts of the page without restarting the entire lifecycle.  

### Benefits  
This approach provides a lightweight yet powerful framework that allows you to:  
- Maintain full control over the rendering process.  
- Avoid endless rendering loops with clear lifecycle management.  
- Handle API calls efficiently, displaying loaders during asynchronous operations.  

If you love vanilla JavaScript, you'll enjoy this simple yet versatile approach. It strikes the perfect balance between control and complexity, enabling you to build sophisticated applications with excellent results.  

## Contributing
We welcome contributions from fellow vanilla enthusiasts! If you have ideas, suggestions, or improvements, feel free to submit a pull request. Let's continue to make this project a haven for those who love the simplicity and elegance of vanilla JavaScript.

## License
This project is licensed under the MIT License.

## Acknowledgements
We would like to express our gratitude to the entire vanilla JavaScript community for their unwavering dedication to simplicity and elegance in web development.