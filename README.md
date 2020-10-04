# react-easy-crud
react componets library to use with node-easy-crud to create easy curd application in MERN stack.
you should use [node-easy-crud](https://www.npmjs.com/package/node-easy-crud) on your backend to use this componets.

## Installation
`npm install react-easy-crud`

## Simple usage

```jsx
<EasyCrudTable url="<node-easy-crud read endpoint>"></EasyCrudTable>
```
### Example
```jsx
import React from "react";
import "./App.css";
import EasyCrudTable from "react-easy-crud";

function App() {
  return (
    <div className="App">
      <EasyCrudTable
        url="http://localhost:5000/api/crud/Subject"
      ></EasyCrudTable>
    </div>
  );
}

export default App;
```

### Headers
you can also pass custom headers using headers props
```jsx
<EasyCrudTable
  url="http://localhost:5000/api/crud/Subject"
  headers={{ "auth-token": "AUTH_TOKEN","key":"value" }}
></EasyCrudTable>
```
## SnapShots
Table with read data

<img src="https://github.com/shashank23p/react-easy-crud/blob/master/snaps/table.png" alt="Read Data Table" width="600"/>

Edit Form

<img src="https://github.com/shashank23p/react-easy-crud/blob/master/snaps/edit.png" alt="Edit form" width="500"/>


Add Form

<img src="https://github.com/shashank23p/react-easy-crud/blob/master/snaps/add.png" alt="Add form" width="500"/>


Delete Confirmation

<img src="https://github.com/shashank23p/react-easy-crud/blob/master/snaps/delete.png" alt="Delete model" width="500"/>
